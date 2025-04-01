import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Route to fetch all tasks (with optional pagination)
router.get('/tasks/:teamId', async (req, res) => {
  console.log('Received params:', req.params) // Debugging log

  const teamId = parseInt(req.params.teamId, 10)
  const limit = parseInt(req.query.limit, 10) || 100
  const offset = parseInt(req.query.offset, 10) || 0

  if (isNaN(teamId)) {
    return res.status(400).json({ error: 'Invalid or missing team_id parameter' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE proyecto = ? LIMIT ? OFFSET ?',
      [teamId, limit, offset]
    )

    if (!rows.length) {
      return res.status(404).json({ error: 'No tasks found' })
    }

    res.status(200).json({ tasks: rows })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'An error occurred while fetching tasks.' })
  }
})

// Route to add a new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, assignedTo, complexity, sprint, proyecto } = req.body

    if (!title || !description || !proyecto) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const query = 'INSERT INTO tasks (title, description, status, assignedTo, complexity, sprint_id, compleated, proyecto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    const values = [title, description, status, assignedTo, complexity, sprint, 0, proyecto]

    const [result] = await pool.execute(query, values)
    res.status(201).json({ taskId: result.insertId })
  } catch (error) {
    console.error('Error adding task:', error)
    res.status(500).json({ error: 'An error occurred while adding the task.' })
  }
})

// Route to update task status
router.put('/tasks', async (req, res) => {
  console.log('Received request body:', req.body) // Debugging

  const { id, status } = req.body
  const taskId = Number(id)

  // Validate that id is provided and is a valid number
  if (!id || isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid or missing task ID' })
  }

  if (!status) {
    return res.status(400).json({ error: 'Missing status field' })
  }

  try {
    const [result] = await pool.query(
      'UPDATE tasks SET status = ? WHERE id_serial = ?',
      [status, taskId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json({ message: 'Task status updated successfully', updatedTask: { id: taskId, status } })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'An error occurred while updating the task.' })
  }
})

// Route to delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' })
  }

  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id_serial = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'An error occurred while deleting the task.' })
  }
})

router.put('/tasks/complete', async (req, res) => {
  const { id } = req.body
  const taskId = Number(id)

  // Validate that id is provided and is a valid number
  if (!id || isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid or missing task ID' })
  }

  try {
    const [result] = await pool.query(
      'UPDATE tasks SET compleated = 1 WHERE id_serial = ? AND compleated = 0',
      [taskId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or already completed' })
    }

    res.status(200).json({ message: 'Task marked as completed successfully', taskId })
  } catch (error) {
    console.error('Error marking task as completed:', error)
    res.status(500).json({ error: 'An error occurred while updating the task completion.' })
  }
})

export default router
