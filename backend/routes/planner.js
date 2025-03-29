import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Route to fetch all tasks (with optional pagination)
router.get('/tasks', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  try {
    const [rows] = await pool.query('SELECT * FROM tasks LIMIT ? OFFSET ?', [limit, offset])
    res.status(200).json({ tasks: rows })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'An error occurred while fetching tasks.' })
  }
})

// Route to fetch a single task by ID
router.get('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' })
  }

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
      'INSERT INTO tasks (title, description, status, assignedTo, complexity, compleated) VALUES (?, ?, ?, ?, ?, 0)',
      [title, description, status, assignedTo || null, complexity]
    )

    res.status(201).json({ message: 'Task added successfully', taskId: result.insertId })
  } catch (error) {
    console.error('Error adding task:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Task title must be unique' })
    }
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

export default router
