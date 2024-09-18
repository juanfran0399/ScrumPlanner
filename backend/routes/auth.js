import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Authentication route
router.post('/login', async (req, res) => {
  const { username, contrasena } = req.body

  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, username FROM Usuario WHERE username = ? AND contrasena = ?',
      [username, contrasena]
    )

    // Check if id_usuario is being selected
    if (rows.length > 0) {
      console.log('Backend id_usuario:', rows[0].id_usuario) // Debug log
      res.json({ success: true, id_usuario: rows[0].id_usuario, username: rows[0].username })
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router
