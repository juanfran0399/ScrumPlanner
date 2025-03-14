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

// Route to check if a user is a member of a team and return team details
router.get('/ismember', async (req, res) => {
  const { user_id } = req.body

  try {
    // Check if the user is already a member of a team
    const [existingMember] = await pool.query(
      'SELECT team_id FROM Miembros WHERE user_id = ? AND active = 1',
      [user_id]
    )

    if (existingMember.length === 0) {
      return res.status(400).json({ message: 'User is not a member of any team.' })
    }

    const teamId = existingMember[0].team_id

    // Get team details
    const [team] = await pool.query(
      'SELECT name, description FROM Equipos WHERE team_id = ?',
      [teamId]
    )

    if (team.length === 0) {
      return res.status(400).json({ message: 'Team not found.' })
    }

    // Get team members
    const [members] = await pool.query(
      `SELECT U.nombre FROM Miembros M 
      JOIN Usuario U ON M.user_id = U.id_usuario 
      WHERE M.team_id = ? AND M.active = 1`,
      [teamId]
    )

    return res.json({
      success: true,
      message: 'User is a member of the team.',
      team: {
        team_id: teamId,
        name: team[0].name,
        description: team[0].description,
        members
      }
    })
  } catch (error) {
    console.error('Error checking team membership:', error)
    return res.status(500).json({ success: false, message: 'An error occurred while checking membership.' })
  }
})

// Route to join a team
router.post('/join', async (req, res) => {
  console.log('Joining team with:', req.body)
  const { team_id, user_id, pass } = req.body

  try {
    // Check if the user is already a member of the team
    const [existingMember] = await pool.query(
      'SELECT * FROM Miembros WHERE team_id = ? AND user_id = ? AND active = "1"',
      [team_id, user_id]
    )

    if (existingMember.length > 0) {
      return res.status(400).json({ message: 'User is already a member of this team.' })
    }

    const [team] = await pool.query(
      'SELECT * FROM Equipos WHERE team_id = ? AND pass = ?',
      [team_id, pass]
    )

    if (team.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid team ID or password.' })
    }
    // If the team exists, insert the user into the Miembros table
    await pool.query(
      'INSERT INTO Miembros (team_id, user_id, active) VALUES (?, ?, 1)',
      [team_id, user_id]
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
      WHERE M.team_id = ? AND M.active = 1`, [teamId]
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
    // Check if the user is currently an active member of the team
    const [existingMember] = await pool.query(
      'SELECT * FROM Miembros WHERE team_id = ? AND user_id = ? AND active = 1',
      [team_id, user_id]
    )

    if (existingMember.length === 0) {
      return res.status(400).json({ message: 'User is already not an active member of this team.' })
    }

    // Set active to 0, marking the user as inactive in the team
    await pool.query(
      'UPDATE Miembros SET active = 0 WHERE team_id = ? AND user_id = ?',
      [team_id, user_id]
    )

    return res.json({ success: true, message: 'Successfully left the team!' })
  } catch (error) {
    console.error('Error leaving the team:', error)
    return res.status(500).json({ success: false, message: 'An error occurred while leaving the team.' })
  }
})

export default router
