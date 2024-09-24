import express from 'express'
import pool from '../database.js'

const router = express.Router()

// New route to add a team directly using addId
router.post('/add', async (req, res) => {
  const { name, description, pass } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO Equipos (name, description, pass) VALUES (?, ?, ?)', [name, description, pass]
    )
    console.log('Insert result:', result) // Debug log
    const insertId = result[0].insertId

    res.status(201).json({ message: 'Team added successfully', teamId: insertId })
  } catch (error) {
    console.error('Error adding team:', error)
    res.status(500).json({ error: 'An error occurred while adding the team.' })
  }
})

// Route to join a team
router.post('/join', async (req, res) => {
  console.log('Joining team with:', req.body)
  const { team_id, user_id, pass, active } = req.body

  try {
    // Check if the user is already a member of the team
    const [existingMember] = await pool.query(
      'SELECT * FROM Miembros WHERE team_id = ? AND user_id = ? AND active = "?"',
      [team_id, user_id, active]
    )

    if (existingMember.length > 0) {
      return res.status(400).json({ message: 'User is already a member of this team.' })
    }

    const [team] = await pool.query(
      'SELECT * FROM Equipos WHERE team_id = ? AND password = ?',
      [team_id, pass]
    )

    if (team.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid team ID or password.' })
    }
    // If the team exists, insert the user into the Miembros table
    await pool.query(
      'INSERT INTO Miembros (team_id, user_id, active) VALUES (?, ?, ?)',
      [team_id, user_id, active]
    )

    return res.json({ success: true, message: 'Successfully joined the team!' })
  } catch (error) {
    console.error('Error joining team:', error)
    return res.status(500).json({ success: false, message: 'An error occurred while joining the team.' })
  }
})

// Route to get all available teams
router.get('/all', async (req, res) => {
  try {
    const [teams] = await pool.query('SELECT * FROM Equipos')
    console.log('Teams from database:', teams) // Log the fetched teams
    res.status(200).json({ teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    res.status(500).json({ error: 'An error occurred while fetching the teams.' })
  }
})

// New route to get team members' names
router.get('/members/:teamId', async (req, res) => {
  const { teamId } = req.params

  try {
    const [members] = await pool.query(`
      SELECT U.nombre
      FROM Miembros M
      JOIN Usuario U ON M.user_id = U.id_usuario
      WHERE M.team_id = ?`, [teamId]
    )

    console.log('Team members:', members) // Debug log
    res.status(200).json({ members })
  } catch (error) {
    console.error('Error fetching team members:', error)
    res.status(500).json({ error: 'An error occurred while fetching team members.' })
  }
})

// Route to exit a team
router.post('/exit', async (req, res) => {
  const { team_id, user_id } = req.body

  try {
    const result = await pool.query(
      'DELETE FROM Miembros WHERE team_id = ? AND user_id = ?',
      [team_id, user_id]
    )

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'User is not a member of this team.' })
    }

    console.log('Exit team result:', result) // Debug log
    res.status(200).json({ message: 'User exited the team successfully' })
  } catch (error) {
    console.error('Error exiting team:', error)
    res.status(500).json({ error: 'An error occurred while exiting the team.' })
  }
})

export default router
