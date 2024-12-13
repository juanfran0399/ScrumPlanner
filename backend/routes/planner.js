import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Route to fetch all tasks
router.get('/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks')
    res.status(200).json({ tasks: rows })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'An error occurred while fetching tasks.' })
  }
})

// Route to fetch a single task by ID
router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json({ task: rows[0] })
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'An error occurred while fetching the task.' })
  }
})

// Route to add a new task
router.post('/tasks', async (req, res) => {
  const { title, description, status, assignedTo, complexity } = req.body

  if (!title || !description || !status || !complexity) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, status, assignedTo, complexity) VALUES (?, ?, ?, ?, ?)',
      [title, description, status, assignedTo || 'No asignado', complexity]
    )

    res.status(201).json({ message: 'Task added successfully', taskId: result.insertId })
  } catch (error) {
    console.error('Error adding task:', error)
    res.status(500).json({ error: 'An error occurred while adding the task.' })
  }
})

router.put('/tasks', async (req, res) => {
  console.log('Received request body:', req.body) // Log the incoming request body to see if both fields are present

  const { id, status } = req.body

  if (!id || !status) {
    return res.status(400).json({ error: 'Missing required fields (id or status)' })
  }

  try {
    const [result] = await pool.query(
      'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json({ message: 'Task status updated successfully' })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'An error occurred while updating the task.' })
  }
})

// Route to delete a task
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'An error occurred while deleting the task.' })
  }
})

export default router
