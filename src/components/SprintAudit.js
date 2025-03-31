import React, { useState, useEffect } from 'react'
import { obtenerUsuarios, obtenerTareasPorUsuario } from '../services/api'
import { calcularIndices, obtenerTipoRecomendado } from '../services/predictor'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const tiposNombre = ['Básicas', 'Moderadas', 'Intermedias', 'Avanzadas', 'Épicas']

const tablaPesos = [
  { tipo: 'Básicas', extra: '10%' },
  { tipo: 'Moderadas', extra: '15%' },
  { tipo: 'Intermedias', extra: '20%' },
  { tipo: 'Avanzadas', extra: '25%' },
  { tipo: 'Épicas', extra: '30%' }
]

const SprintAudit = () => {
  const [usuarios, setUsuarios] = useState([])
  const [seleccionado, setSeleccionado] = useState('')
  const [tareas, setTareas] = useState([])
  const [sprintSeleccionado, setSprintSeleccionado] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    obtenerUsuarios().then(res => setUsuarios(res.data))
  }, [])

  const handleSeleccionar = async (id) => {
    setSeleccionado(id)
    setSprintSeleccionado('')
    const res = await obtenerTareasPorUsuario(id)
    setTareas(res.data)
  };

  const tareasDelSprint = tareas.find(t => t.sprint === parseInt(sprintSeleccionado))
  const indicesSprint = tareasDelSprint ? calcularIndices([tareasDelSprint]) : []
  const indicesGlobales = calcularIndices(tareas)

  const tipoRecomendadoGlobal = obtenerTipoRecomendado(indicesGlobales)
  const tipoRecomendadoSprint = obtenerTipoRecomendado(indicesSprint)

  const chartGlobal = indicesGlobales.map((val, i) => {
    const completadas = tareas.reduce((sum, t) => sum + t[`t${i + 1}_completadas`], 0)
    const asignadas = tareas.reduce((sum, t) => sum + t[`t${i + 1}_asignadas`], 0)
    const porcentajeSinExtra = asignadas > 0 ? (completadas * 100) / asignadas : 0
    return {
      tipo: tiposNombre[i] || `Tipo ${i + 1}`,
      porcentaje: porcentajeSinExtra,
      porcentajePonderado: val,
      completadas,
      asignadas
    }
  })

  const chartSprint = indicesSprint.map((val, i) => {
    const completadas = tareasDelSprint[`t${i + 1}_completadas`]
    const asignadas = tareasDelSprint[`t${i + 1}_asignadas`]
    const porcentajeSinExtra = asignadas > 0 ? (completadas * 100) / asignadas : 0
    return {
      tipo: tiposNombre[i] || `Tipo ${i + 1}`,
      porcentaje: porcentajeSinExtra,
      porcentajePonderado: val,
      completadas,
      asignadas
    }
  })

  return (
    <div>
      <h2>📊 Auditoría de Sprints por Usuario
        <button onClick={() => setMostrarModal(true)}>ℹ️</button>
      </h2>

      {mostrarModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>🧠 Cómo se calculan los porcentajes</h3>
            <p>El sistema aplica un porcentaje adicional a cada tipo de tarea una vez completadas. Esto representa la dificultad progresiva según el tipo:</p>
            <ul>
              {tablaPesos.map((p, i) => (
                <li key={i}>{p.tipo} → <strong>{p.extra} extra</strong> sobre el % de cumplimiento.</li>
              ))}
            </ul>
            <p>Ejemplo: Si completas 6 de 6 tareas del tipo 4 (100%), se le suma un 25% adicional, resultando en 125%.</p>
            <button onClick={() => setMostrarModal(false)} style={styles.closeButton}>Cerrar</button>
          </div>
        </div>
      )}

      <div>
        <label>Selecciona un usuario:</label>
        <select onChange={(e) => handleSeleccionar(e.target.value)} value={seleccionado}>
          <option value=''>-- Usuario --</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
      </div>

      {tareas.length > 0 && (
        <div>
          <label>Selecciona un sprint:</label>
          <select value={sprintSeleccionado} onChange={(e) => setSprintSeleccionado(e.target.value)}>
            <option value=''>-- Sprint --</option>
            {tareas.map(t => (
              <option key={t.id} value={t.sprint}>Sprint {t.sprint}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ flex: 1 }}>
              <h4>🔵 Global Acumulado — Tipo de tarea recomendado: <strong>{tipoRecomendadoGlobal}</strong></h4>
              <ul>
                {chartGlobal.map((d, i) => (
                  <li key={i}>
                    {d.tipo}: <strong>{d.porcentaje.toFixed(2)}%</strong> (Ponderado: {d.porcentajePonderado.toFixed(2)}%) — Completadas: {d.completadas} / Asignadas: {d.asignadas}
                  </li>
                ))}
              </ul>
              <ResponsiveContainer width='100%' height={250}>
                <BarChart data={chartGlobal}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='tipo' />
                  <YAxis domain={[0, 150]} />
                  <Tooltip />
                  <Bar dataKey='porcentaje' fill='#3498db' />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {sprintSeleccionado && tareasDelSprint && (
              <div style={{ flex: 1 }}>
                <h4>🟢 Sprint {tareasDelSprint.sprint} — Tipo de tarea recomendado: <strong>{tipoRecomendadoSprint}</strong></h4>
                <ul>
                  {chartSprint.map((d, i) => (
                    <li key={i}>
                      {d.tipo}: <strong>{d.porcentaje.toFixed(2)}%</strong> (Ponderado: {d.porcentajePonderado.toFixed(2)}%) — Completadas: {d.completadas} / Asignadas: {d.asignadas}
                    </li>
                  ))}
                </ul>
                <ResponsiveContainer width='100%' height={250}>
                  <BarChart data={chartSprint}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='tipo' />
                    <YAxis domain={[0, 150]} />
                    <Tooltip />
                    <Bar dataKey='porcentaje' fill='#2ecc71' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  closeButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer'
  }
}

export default SprintAudit
