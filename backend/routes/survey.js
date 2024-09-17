import express from 'express'
import pool from '../database.js'

const router = express.Router()

// New survey data
router.post('/survey', async (req, res) => {
  const { id_usuario, puntaje } = req.body

  try {
    // Execute the query to insert the survey data
    const [result] = await pool.query(
      'INSERT INTO Encuesta (id_usuario, puntaje) VALUES (?, ?)', [id_usuario, puntaje]
    )

    // Check if any rows were affected
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Survey data added successfully' })
    } else {
      res.status(400).json({ success: false, message: 'Failed to insert survey data' })
    }
  } catch (error) {
    console.error('Error inserting survey data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router
