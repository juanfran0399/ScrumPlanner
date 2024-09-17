import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Authentication route
router.post('/login', async (req, res) => {
  const { username, contrasena } = req.body

  try {
    const [rows] = await pool.query(
      'SELECT user_id FROM Usuario WHERE username = ? AND contrasena = ?',
      [username, contrasena]
    )

    if (rows.length > 0) {
      const user_id = rows[0].user_id
      res.json({ success: true, user_id }) // Ensure the response contains user_id
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router
