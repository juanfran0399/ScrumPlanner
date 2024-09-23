import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Insert new survey data (POST)
router.post('/survey', async (req, res) => {
  const { id_usuario, puntaje } = req.body

  try {
    // Execute the query to insert the survey data
    const [result] = await pool.query(
      'INSERT INTO Encuesta (id_usuario, puntaje) VALUES (?, ?)', [id_usuario, puntaje]
    )

    // Check if any rows were affected
    if (result.affectedRows > 0) {
      res.json({ success: true, id_usuario, puntaje })
    } else {
      res.status(400).json({ success: false, message: 'Failed to insert survey data' })
    }
  } catch (error) {
    console.error('Error inserting survey data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Check if survey exists (POST)
router.post('/chek', async (req, res) => {
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

router.post('/team', async (req, res) => {
  const { name, description } = req.body

  try {
    // Execute the query to insert the survey data
    const [result] = await pool.query(
      'INSERT INTO Equipos (name, description) VALUES (?, ?)', [name, description]
    )

    // Check if any rows were affected
    if (result.affectedRows > 0) {
      res.json({ success: true, name, description })
    } else {
      res.status(400).json({ success: false, message: 'Failed to insert survey data' })
    }
  } catch (error) {
    console.error('Error inserting survey data:', error)
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
