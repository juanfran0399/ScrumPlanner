import express from 'express'
import pool from '../database.js'

const router = express.Router()

// Obtener todos los usuarios (usando id_usuario y nombre)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_usuario, nombre FROM Usuario')
    res.json(rows)
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

// Obtener tareas de todos los sprints de un usuario
router.get('/tareas/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tareas_sprint WHERE usuario_id = ? ORDER BY sprint ASC',
      [usuario_id]
    )
    res.json(rows)
  } catch (err) {
    console.error('Error al obtener tareas del usuario:', err)
    res.status(500).json({ error: 'Error al obtener tareas del usuario' })
  }
})

export default router
