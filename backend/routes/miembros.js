import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Check if a user is part of a team and return team_id
router.post('/check2', async (req, res) => {
  const { id_usuario } = req.body

  try {
    const [rows] = await pool.query(
      'SELECT team_id, user_id FROM Miembros WHERE user_id = ? AND active = 1',
      [id_usuario]
    )

    if (rows.length > 0) {
      console.log('User is in a team:', id_usuario, 'Team ID:', rows[0].team_id)
      res.json({ success: true, user_id: rows[0].user_id, team_id: rows[0].team_id })
    } else {
      console.log('User is NOT in a team:', id_usuario)
      res.status(404).json({ success: false, message: 'User is not in an active team' })
    }
  } catch (error) {
    console.error('Error checking team status:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router
