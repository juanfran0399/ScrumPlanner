import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import surveyRoutes from './routes/survey.js'
import teamRoutes from './routes/team.js'
import sprintRoutes from './routes/sprint.js'
import plannerRoutes from './routes/planner.js'
import miembrosRoutes from './routes/miembros.js'
import usersRoutes from './routes/users.js'
import modeloRoutes from './routes/modelo.js'
import pool from './database.js'
import KNN from 'ml-knn'

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/survey', surveyRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/sprint', sprintRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/miembros', miembrosRoutes)
app.use('/api/modelo', modeloRoutes)
app.use('/api/users', usersRoutes)

// -------------------------
// Smarter Synthetic Data
// -------------------------
const roles = ['Scrum Owner', 'Scrum Master', 'Developer']
const trainingData = []

function generateRoleResponses (role) {
  switch (role) {
    case 'Scrum Owner':
      return Array.from({ length: 13 }, () => Math.floor(Math.random() * 2) + 3) // 3-4
    case 'Scrum Master':
      return Array.from({ length: 13 }, () => Math.floor(Math.random() * 3) + 2) // 2-4
    case 'Developer':
      return Array.from({ length: 13 }, () => Math.floor(Math.random() * 2) + 1) // 1-2
  }
}

for (let i = 0; i < 300; i++) {
  const role = roles[i % roles.length]
  const responses = generateRoleResponses(role)
  trainingData.push({ responses, role })
}

// -------------------------
// Normalize Function
// -------------------------
function normalize (data) {
  const nFeatures = data[0].length
  const means = Array(nFeatures).fill(0)
  const stds = Array(nFeatures).fill(0)

  // Mean
  for (const row of data) {
    row.forEach((val, i) => {
      means[i] += val
    })
  }
  means.forEach((sum, i) => {
    means[i] /= data.length
  })

  // Std
  for (const row of data) {
    row.forEach((val, i) => {
      stds[i] += Math.pow(val - means[i], 2)
    })
  }
  stds.forEach((sum, i) => {
    stds[i] = Math.sqrt(sum / data.length)
  })

  return data.map(row =>
    row.map((val, i) => (val - means[i]) / (stds[i] || 1))
  )
}

// -------------------------
// Split & Train KNN
// -------------------------
function shuffleAndSplit (data, testSize = 0.2) {
  const shuffled = [...data].sort(() => 0.5 - Math.random())
  const testCount = Math.floor(testSize * data.length)
  return {
    train: shuffled.slice(testCount),
    test: shuffled.slice(0, testCount)
  }
}

const { train, test } = shuffleAndSplit(trainingData)
const rawTrainFeatures = train.map(d => d.responses)
const rawTestFeatures = test.map(d => d.responses)
const trainLabels = train.map(d => d.role)
const testLabels = test.map(d => d.role)

// Normalize
const normTrainFeatures = normalize(rawTrainFeatures)
const normTestFeatures = normalize(rawTestFeatures)

// Try different k values
let bestK = 1
let bestAccuracy = 0
let bestModel = null

console.log('🔍 Tuning K...')
for (const k of [2, 3, 5, 7]) {
  const knn = new KNN(normTrainFeatures, trainLabels, { k })
  const predictions = knn.predict(normTestFeatures)
  const correct = predictions.filter((p, i) => p === testLabels[i]).length
  const accuracy = correct / testLabels.length
  console.log(`k = ${k}, Accuracy = ${(accuracy * 100).toFixed(2)}%`)
  if (accuracy > bestAccuracy) {
    bestK = k
    bestAccuracy = accuracy
    bestModel = knn
  }
}

console.log(`✅ Best k: ${bestK}, Accuracy: ${(bestAccuracy * 100).toFixed(2)}%`)

// Save the best model
const knn = bestModel

// -------------------------
// Predict & Save Survey
// -------------------------
app.post('/api/survey/save', async (req, res) => {
  const { id_usuario: idUsuario, puntaje, respuestas } = req.body

  try {
    const userResponses = respuestas.map(respuesta => {
      switch (respuesta.respuesta) {
        case 'Muy efectivo/a': return 4
        case 'Bastante efectivo/a': return 3
        case 'Poco efectivo/a': return 2
        case 'Nada efectivo/a': return 1
        default: return 0
      }
    })

    const normUserResponses = normalize([userResponses])[0]

    // Predict role
    const [predictedRole] = knn.predict([normUserResponses])
    console.log(`🎯 Predicted Role for user ${idUsuario}:`, predictedRole)

    // Insert survey summary
    await pool.query(
      'INSERT INTO Encuesta (id_usuario, puntaje, role) VALUES (?, ?, ?)',
      [idUsuario, puntaje, predictedRole]
    )

    // Insert individual answers
    const answerPromises = respuestas.map(respuesta =>
      pool.query(
        'INSERT INTO Encuesta_respuesta (id_usuario, id_pregunta, respuesta) VALUES (?, ?, ?)',
        [idUsuario, respuesta.id_pregunta, respuesta.respuesta]
      )
    )

    await Promise.all(answerPromises)

    res.json({
      success: true,
      message: 'Survey submitted successfully',
      role: predictedRole
    })
  } catch (error) {
    console.error('❌ Error saving survey:', error)
    res.status(500).json({ success: false, message: 'Error submitting survey' })
  }
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
