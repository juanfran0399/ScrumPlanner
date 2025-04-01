import express from 'express'
import pool from '../database.js'
import KNN from 'ml-knn'

const router = express.Router()

// Training data for KNN
const trainingData = [
  { responses: [4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 3, 4], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2], role: 'Developer' },
  { responses: [4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4], role: 'Scrum Owner' },
  { responses: [3, 3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3], role: 'Scrum Master' },
  { responses: [2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2], role: 'Developer' },
  { responses: [4, 3, 4, 4, 4, 3, 4, 3, 4, 4, 3, 4, 4], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 2, 3, 3, 2, 3, 3, 2], role: 'Scrum Master' },
  { responses: [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1], role: 'Developer' },
  { responses: [4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 3, 4], role: 'Scrum Owner' },
  { responses: [3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2], role: 'Developer' },
  { responses: [4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 3, 4, 3], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1], role: 'Developer' },
  { responses: [4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4], role: 'Scrum Owner' },
  { responses: [3, 3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3], role: 'Scrum Master' },
  { responses: [2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2], role: 'Developer' },
  { responses: [4, 3, 4, 4, 4, 3, 4, 3, 4, 4, 3, 4, 4], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 2, 3, 3, 2, 3, 3, 2], role: 'Scrum Master' },
  { responses: [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1], role: 'Developer' },
  { responses: [4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 3, 4], role: 'Scrum Owner' },
  { responses: [3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2], role: 'Developer' },
  { responses: [2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2], role: 'Developer' },
  { responses: [4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 3, 4], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4], role: 'Scrum Owner' },
  { responses: [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2], role: 'Developer' },
  { responses: [3, 3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3], role: 'Scrum Master' },
  { responses: [4, 3, 4, 4, 4, 3, 4, 3, 4, 4, 3, 4, 4], role: 'Scrum Owner' },
  { responses: [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1], role: 'Developer' },
  { responses: [3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 3, 4], role: 'Scrum Owner' },
  { responses: [2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2], role: 'Developer' },
  { responses: [3, 2, 3, 3, 2, 3, 2, 3, 3, 2, 3, 3, 2], role: 'Scrum Master' },
  { responses: [4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 3, 4], role: 'Scrum Owner' },
  { responses: [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1], role: 'Developer' },
  { responses: [3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 2, 3], role: 'Scrum Master' },
  { responses: [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2], role: 'Developer' },
  { responses: [4, 3, 4, 4, 4, 3, 4, 3, 4, 4, 3, 4, 4], role: 'Scrum Owner' },
  { responses: [3, 3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3], role: 'Scrum Master' },
  { responses: [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1], role: 'Developer' },
  { responses: [4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 3, 4], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 2, 3, 3, 2, 3, 3, 2], role: 'Scrum Master' },
  { responses: [2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2], role: 'Developer' }
]

const trainingFeatures = trainingData.map(data => data.responses)
const trainingLabels = trainingData.map(data => data.role)
const knn = new KNN(trainingFeatures, trainingLabels)

// Insert new survey data (POST)
router.post('/save', async (req, res) => {
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

    // Save total score and predicted role
    await pool.query(
      'INSERT INTO Encuesta (id_usuario, puntaje, role) VALUES (?, ?, ?)',
      [id_usuario, puntaje, predictedRole]
    )

    // Save individual responses
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

// Check if survey exists (POST)
router.post('/check', async (req, res) => {
  const { id_usuario } = req.body

  try {
    console.log('Checking survey for id_usuario:', id_usuario)
    const [rows] = await pool.query(
      'SELECT id_usuario FROM Encuesta WHERE id_usuario = ?', [id_usuario]
    )

    if (rows.length > 0) {
      console.log('Survey found for id_usuario:', id_usuario)
      res.json({ success: true, id_usuario: rows[0].id_usuario })
    } else {
      console.log('Survey not found for id_usuario:', id_usuario)
      res.status(404).json({ success: false, message: 'Survey not found' })
    }
  } catch (error) {
    console.error('Error checking survey existence:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

router.post('/check2', async (req, res) => {
  const { id_usuario } = req.body

  try {
    console.log('Checking survey for user_id:', user_id)
    const [rows] = await pool.query(
      'SELECT user_id FROM Miembros WHERE user_id = ?', [user_id]
    )

    if (rows.length > 0) {
      console.log('Survey found for user_id:', user_id)
      res.json({ success: true, user_id: rows[0].user_id })
    } else {
      console.log('Survey not found for user_id:', user_id)
      res.status(404).json({ success: false, message: 'Survey not found' })
    }
  } catch (error) {
    console.error('Error checking survey existence:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Insert new team data (POST)
router.post('/team', async (req, res) => {
  const { name, description } = req.body

  try {
    // Execute the query to insert the team data
    const [result] = await pool.query(
      'INSERT INTO Equipos (name, description) VALUES (?, ?)', [name, description]
    )

    // Check if any rows were affected
    if (result.affectedRows > 0) {
      res.json({ success: true, name, description })
    } else {
      res.status(400).json({ success: false, message: 'Failed to insert team data' })
    }
  } catch (error) {
    console.error('Error inserting team data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Fetch survey data by id_usuario (GET)
router.get('/survey/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params

  try {
    // Execute the query to fetch the survey data by user ID
    const [rows] = await pool.query(
      'SELECT * FROM Encuesta WHERE id_usuario = ?', [id_usuario]
    )

    if (rows.length > 0) {
      res.json({ success: true, data: rows })
    } else {
      res.status(404).json({ success: false, message: 'No survey data found for this user' })
    }
  } catch (error) {
    console.error('Error fetching survey data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router
