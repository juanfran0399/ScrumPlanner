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

// Middleware
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
// Generate a larger set of training data (100 samples)
const roles = ['Scrum Owner', 'Scrum Master', 'Developer']
const trainingData = []

for (let i = 0; i < 100; i++) {
  const role = roles[i % roles.length]
  const responses = Array.from({ length: 13 }, () => Math.floor(Math.random() * 4) + 1) // Random responses between 1 and 4

  trainingData.push({ responses, role })
}

const trainingFeatures = trainingData.map(data => data.responses)
const trainingLabels = trainingData.map(data => data.role)

// Debugging: Check data format
console.log('Training Features:', trainingFeatures)
console.log('Training Labels:', trainingLabels)

// Initialize and train KNN classifier
const knn = new KNN(trainingFeatures, trainingLabels)

// API Endpoint: Save Survey Responses & Predict Role
app.post('/api/survey/save', async (req, res) => {
  const { id_usuario, puntaje, respuestas } = req.body

  try {
    // Convert user responses to numeric values for prediction
    const userResponses = respuestas.map(respuesta => {
      switch (respuesta.respuesta) {
        case 'Muy efectivo/a': return 4
        case 'Bastante efectivo/a': return 3
        case 'Poco efectivo/a': return 2
        case 'Nada efectivo/a': return 1
        default: return 0
      }
    })

    // Predict Role using KNN
    const [predictedRole] = knn.predict([userResponses])
    console.log(`Predicted Role for user ${id_usuario}:`, predictedRole)

    // Save survey results into `Encuesta` table
    await pool.query(
      'INSERT INTO Encuesta (id_usuario, puntaje, role) VALUES (?, ?, ?)',
      [id_usuario, puntaje, predictedRole]
    )

    // Save individual responses into `Encuesta_respuesta`
    const answerPromises = respuestas.map(respuesta =>
      pool.query('INSERT INTO Encuesta_respuesta (id_usuario, id_pregunta, respuesta) VALUES (?, ?, ?)', [
        id_usuario,
        respuesta.id_pregunta,
        respuesta.respuesta
      ])
    )

    await Promise.all(answerPromises)

    res.json({ success: true, message: 'Survey submitted successfully', role: predictedRole })
  } catch (error) {
    console.error('Error saving survey:', error)
    res.status(500).json({ success: false, message: 'Error submitting survey' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
