import express from 'express'
import pool from '../database.js'

const router = express.Router()

router.post('/add-sprint', async (req, res) => {
  const { user_id, team_id, title, start_date, end_date } = req.body

  // Debug log for the request body
  console.log('Request body:', req.body)

  try {
    const result = await pool.query(
      'INSERT INTO Sprint (user_id, team_id, title, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [user_id, team_id, title, start_date, end_date] // Include user_id
    )

    console.log('Insert result:', result) // Debug log
    const insertId = result.insertId

    res.status(201).json({ message: 'Sprint added successfully', sprintId: insertId })
  } catch (error) {
    console.error('Error adding sprint:', error.message) // Log detailed error
    res.status(500).json({ error: 'An error occurred while adding the sprint.' })
  }
})

// Route to modify sprint objectives
router.put('/update-objective', async (req, res) => {
  const { sprint_id, objectives } = req.body
  console.log('Updating Sprint ID:', sprint_id, 'with Objectives:', objectives)

  // Ensure that sprint_id and objectives are provided
  if (!sprint_id) {
    return res.status(400).json({ error: 'Sprint ID is required' })
  }

  try {
    // Step 1: Check if the objectives field is empty
    if (!objectives) {
      return res.status(400).json({ error: 'Objectives cannot be empty' })
    }

    // Step 2: Try updating the objectives field first
    const updateResult = await pool.query(
      'UPDATE Sprint SET objectives = ? WHERE sprint_id = ?',
      [objectives, sprint_id]
    )

    console.log('Update result:', updateResult) // Debug log

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Sprint not found or no changes made' })
    }

    res.status(200).json({ message: 'Sprint objective updated successfully' })
  } catch (error) {
    console.error('Error updating sprint objective:', error)
    res.status(500).json({ error: 'An error occurred while updating the sprint objective.' })
  }
})

// Route to add a task to a sprint
router.post('/add-task', async (req, res) => {
  const { sprint_id, task, user_id, status, active } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO Sprint_backlog (sprint_id, task, user_id, status, active) VALUES (?, ?, ?, ?, ?)',
      [sprint_id, task, user_id, status, active]
    )
    console.log('Insert result:', result) // Debug log
    const insertId = result.insertId

    res.status(201).json({ message: 'Task added successfully', taskId: insertId })
  } catch (error) {
    console.error('Error adding task:', error)
    res.status(500).json({ error: 'An error occurred while adding the task.' })
  }
})

// Route to show all tasks across all sprints
router.get('/all-tasks', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Sprint_backlog'
    )

    res.status(200).json({ tasks: rows })
  } catch (error) {
    console.error('Error fetching all tasks:', error)
    res.status(500).json({ error: 'An error occurred while fetching all tasks.' })
  }
})

// Route to show all sprints for a team
router.get('/all-sprints/:team_id', async (req, res) => {
  const { team_id } = req.params

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Sprint WHERE team_id = ?',
      [team_id]
    )

    res.status(200).json({ sprints: rows })
  } catch (error) {
    console.error('Error fetching sprints:', error)
    res.status(500).json({ error: 'An error occurred while fetching the sprints.' })
  }
})

// Route to get team_id by user_id with active = 1
router.get('/team/:user_id', async (req, res) => {
  const { user_id } = req.params

  try {
    const [rows] = await pool.query(
      'SELECT team_id FROM Miembros WHERE user_id = ? AND active = 1',
      [user_id]
    )

    if (rows.length > 0) {
      res.status(200).json({ team_id: rows[0].team_id })
    } else {
      res.status(404).json({ message: 'No active team found for this user.' })
    }
  } catch (error) {
    console.error('Error fetching team_id:', error)
    res.status(500).json({ error: 'An error occurred while fetching the team_id.' })
  }
})

export default router
