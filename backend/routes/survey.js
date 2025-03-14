import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Insert new survey data (POST)
router.post('/save', async (req, res) => {
  const { id_usuario, puntaje, respuestas } = req.body

  try {
    // Save total score
    await pool.query('INSERT INTO Encuesta (id_usuario, puntaje) VALUES (?, ?)', [id_usuario, puntaje])

    // Save individual responses
    const answerPromises = respuestas.map(respuesta =>
      pool.query('INSERT INTO Encuesta_respuesta (id_usuario, id_pregunta, respuesta) VALUES (?, ?, ?)', [
        id_usuario,
        respuesta.id_pregunta,
        respuesta.respuesta
      ])
    )

    await Promise.all(answerPromises)

    res.json({ success: true, message: 'Survey submitted successfully' })
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
