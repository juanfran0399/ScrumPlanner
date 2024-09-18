import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Get all teams and user data (GET)
router.get('/', async (req, res) => {
  const { user_id } = req.query

  try {
    const [teams] = await pool.query('SELECT * FROM teams')

    if (users.length > 0) {
      res.json({ teams, user: users[0] })
    } else {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    console.error('Error fetching teams and user data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Join a team (POST)
router.post('/join', async (req, res) => {
  const { userId, teamId } = req.body

  try {
    const [team] = await pool.query('SELECT * FROM teams WHERE id = ?', [teamId])
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])

    if (team.length > 0 && user.length > 0) {
      await pool.query('UPDATE users SET team_id = ? WHERE id = ?', [teamId, userId])
      await pool.query('UPDATE teams SET members_count = members_count + 1 WHERE id = ?', [teamId])
      res.json({ success: true, message: 'User joined team' })
    } else {
      res.status(404).json({ success: false, message: 'User or team not found' })
    }
  } catch (error) {
    console.error('Error joining team:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Leave a team (POST)
router.post('/leave', async (req, res) => {
  const { userId } = req.body

  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])

    if (user.length > 0 && user[0].team_id) {
      const teamId = user[0].team_id
      await pool.query('UPDATE users SET team_id = NULL WHERE id = ?', [userId])
      await pool.query('UPDATE teams SET members_count = members_count - 1 WHERE id = ?', [teamId])
      res.json({ success: true, message: 'User left team' })
    } else {
      res.status(404).json({ success: false, message: 'User not found or not in a team' })
    }
  } catch (error) {
    console.error('Error leaving team:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Delete a team (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])

    if (user.length > 0 && user[0].team_id == id) {
      await pool.query('UPDATE users SET team_id = NULL WHERE id = ?', [userId])
    }

    const [result] = await pool.query('DELETE FROM teams WHERE id = ?', [id])

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Team deleted' })
    } else {
      res.status(404).json({ success: false, message: 'Team not found' })
    }
  } catch (error) {
    console.error('Error deleting team:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// Create a team (POST)
router.post('/create', async (req, res) => {
  const { userId, name } = req.body

  try {
    const [result] = await pool.query('INSERT INTO teams (name, members_count) VALUES (?, ?)', [name, 1])

    if (result.affectedRows > 0) {
      await pool.query('UPDATE users SET team_id = ? WHERE id = ?', [result.insertId, userId])
      res.status(201).json({ success: true, message: 'Team created' })
    } else {
      res.status(400).json({ success: false, message: 'Failed to create team' })
    }
  } catch (error) {
    console.error('Error creating team:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router
