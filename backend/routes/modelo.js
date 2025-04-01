// backend/routes/runSQL.js
import express from 'express'
import pool from '../database.js'

const router = express.Router()

router.post('/carga', (req, res) => {
  const { user_id, sprint_id } = req.body

  if (!user_id || !sprint_id) {
    return res.status(400).json({ error: 'user_id and sprint_id are required' })
  }
  const query = `
    INSERT INTO tareas_sprint (
      usuario_id, sprint,
      t1_completadas, t1_asignadas,
      t2_completadas, t2_asignadas,
      t3_completadas, t3_asignadas,
      t4_completadas, t4_asignadas,
      t5_completadas, t5_asignadas
    )
    SELECT 
      ? AS usuario_id,
      ? AS sprint_id,
      COUNT(CASE WHEN status = 'Terminado' AND complexity = 'Basica' THEN 1 END) AS t1_completadas,
      COUNT(CASE WHEN assignedTo IS NOT NULL AND complexity = 'Basica' THEN 1 END) AS t1_asignadas,
      COUNT(CASE WHEN status = 'Terminado' AND complexity = 'Moderada' THEN 1 END) AS t2_completadas,
      COUNT(CASE WHEN assignedTo IS NOT NULL AND complexity = 'Moderada' THEN 1 END) AS t2_asignadas,
      COUNT(CASE WHEN status = 'Terminado' AND complexity = 'Intermedia' THEN 1 END) AS t3_completadas,
      COUNT(CASE WHEN assignedTo IS NOT NULL AND complexity = 'Intermedia' THEN 1 END) AS t3_asignadas,
      COUNT(CASE WHEN status = 'Terminado' AND complexity = 'Avanzada' THEN 1 END) AS t4_completadas,
      COUNT(CASE WHEN assignedTo IS NOT NULL AND complexity = 'Avanzada' THEN 1 END) AS t4_asignadas,
      COUNT(CASE WHEN status = 'Terminado' AND complexity = 'Epica' THEN 1 END) AS t5_completadas,
      COUNT(CASE WHEN assignedTo IS NOT NULL AND complexity = 'Epica' THEN 1 END) AS t5_asignadas
    FROM tasks
    WHERE sprint_id = ?
    GROUP BY sprint_id
    ON DUPLICATE KEY UPDATE
      t1_completadas = VALUES(t1_completadas),
      t1_asignadas = VALUES(t1_asignadas),
      t2_completadas = VALUES(t2_completadas),
      t2_asignadas = VALUES(t2_asignadas),
      t3_completadas = VALUES(t3_completadas),
      t3_asignadas = VALUES(t3_asignadas),
      t4_completadas = VALUES(t4_completadas),
      t4_asignadas = VALUES(t4_asignadas),
      t5_completadas = VALUES(t5_completadas),
      t5_asignadas = VALUES(t5_asignadas);
  `

  // Execute the query with the user_id and sprint_id as parameters
  pool.query(query, [user_id, sprint_id, sprint_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err)
      return res.status(500).json({ error: 'Failed to insert/update data' })
    }
    res.json({ message: 'Data successfully loaded' })
  })
})
export default router
