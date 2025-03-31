import React, { useState, useEffect } from 'react'
import { registrarTareasSprint, obtenerTareasPorUsuario, eliminarTareasSprint } from '../services/api'

const SprintForm = ({ usuarios, onTareasRegistradas }) => {
  const [form, setForm] = useState({ usuario_id: '', sprint: 1 })
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [tareasUsuario, setTareasUsuario] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  const resetForm = () => {
    setForm({ usuario_id: '', sprint: 1 })
    setModoEdicion(false)
  }

  const handleUsuarioChange = async (e) => {
    const id = e.target.value
    setForm({ ...form, usuario_id: id })
    if (id) {
      const res = await obtenerTareasPorUsuario(id)
      setTareasUsuario(res.data)
      const siguienteSprint = res.data.length > 0 ? Math.max(...res.data.map(t => t.sprint)) + 1 : 1
      setForm(prev => ({ ...prev, sprint: siguienteSprint }))
      setModoEdicion(false)
    } else {
      setTareasUsuario([])
    }
  }

  const handleSprintChange = (e) => {
    const sprint = parseInt(e.target.value)
    setForm({ ...form, sprint })

    const datosExistentes = tareasUsuario.find(t => t.sprint === sprint)
    if (datosExistentes) {
      setMostrarModal(true)
    } else {
      const nuevoForm = { usuario_id: form.usuario_id, sprint }
      for (let i = 1; i <= 5; i++) {
        nuevoForm[`t${i}_c`] = ''
        nuevoForm[`t${i}_a`] = ''
      }
      setForm(nuevoForm)
      setModoEdicion(false)
    }
  }

  const confirmarEdicionConPassword = () => {
    if (passwordInput !== 'admin123') {
      alert('❌ Contraseña incorrecta')
      setMostrarModal(false)
      setPasswordInput('')
      return
    }

    const sprint = parseInt(form.sprint)
    const datosExistentes = tareasUsuario.find(t => t.sprint === sprint)
    if (datosExistentes) {
      const nuevoForm = { usuario_id: form.usuario_id, sprint }
      for (let i = 1; i <= 5; i++) {
        nuevoForm[`t${i}_c`] = datosExistentes[`t${i}_completadas`]
        nuevoForm[`t${i}_a`] = datosExistentes[`t${i}_asignadas`]
      }
      setForm(nuevoForm)
      setModoEdicion(true)
    }
    setMostrarModal(false)
    setPasswordInput('')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cargando) return
    setMensaje('')
    setCargando(true)

    try {
      const sprintExistente = tareasUsuario.find(t => t.sprint === parseInt(form.sprint))
      if (sprintExistente && !modoEdicion) {
        setMensaje({ tipo: 'error', texto: '❌ Ya existe un registro para este sprint. Usa modo edición.' })
        setCargando(false)
        return
      }

      const data = { ...form }
      for (let i = 1; i <= 5; i++) {
        data[`t${i}_c`] = parseInt(form[`t${i}_c`] || 0)
        data[`t${i}_a`] = parseInt(form[`t${i}_a`] || 0)
      }
      await registrarTareasSprint(data)
      setMensaje({ tipo: 'exito', texto: modoEdicion ? '✅ Tareas actualizadas.' : '✅ Tareas registradas.' })
      onTareasRegistradas()
    } catch (err) {
      setMensaje({ tipo: 'error', texto: '❌ Error al guardar tareas.' })
    } finally {
      setCargando(false)
    }
  }

  const handleEliminar = async () => {
    if (!modoEdicion || !form.usuario_id || !form.sprint) return
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return

    try {
      await eliminarTareasSprint(form.usuario_id, form.sprint)
      setMensaje({ tipo: 'exito', texto: '🗑️ Registro eliminado correctamente.' })
      setForm({ usuario_id: form.usuario_id, sprint: 1 })
      onTareasRegistradas()
    } catch (err) {
      setMensaje({ tipo: 'error', texto: '❌ Error al eliminar el registro.' })
    }
  }

  return (
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.titulo}>{modoEdicion ? 'Editar Tareas del Sprint' : 'Registrar Tareas por Sprint'}</h3>

        <div style={styles.group}>
            <label style={styles.label}>Usuario:</label>
            <select name='usuario_id' value={form.usuario_id} onChange={handleUsuarioChange} required style={styles.input}>
                <option value=''>Seleccionar usuario</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre}</option>
                  ))}
              </select>
          </div>

        <div style={styles.group}>
            <label style={styles.label}>Sprint:</label>
            <input
                name='sprint'
                type='number'
                min='1'
                value={form.sprint}
                onChange={handleSprintChange}
                required
                style={styles.input}
              />
          </div>

        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={styles.group}>
                <label style={styles.label}>Tipo {i}:</label>
                <input
                    name={`t${i}_c`}
                    type='number'
                    placeholder='Completadas'
                    value={form[`t${i}_c`] || ''}
                    onChange={handleChange}
                    style={styles.input}
                  />
                <input
                    name={`t${i}_a`}
                    type='number'
                    placeholder='Asignadas'
                    value={form[`t${i}_a`] || ''}
                    onChange={handleChange}
                    style={styles.input}
                  />
              </div>
          ))}

        <button type='submit' disabled={cargando} style={styles.boton}>
            {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar')}
          </button>

        {modoEdicion && (
            <button type='button' onClick={handleEliminar} style={{ ...styles.boton, backgroundColor: '#e74c3c', marginTop: '10px' }}>
                Eliminar Registro
                </button>
          )}

        {mensaje && (
            <p style={mensaje.tipo === 'exito' ? styles.mensajeExito : styles.mensajeError}>
                {mensaje.texto}
              </p>
          )}

        {mostrarModal && (
            <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                    <h4>🔐 Ingresar contraseña para editar sprint anterior</h4>
                    <input
                        type='password'
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder='Contraseña'
                        style={styles.input}
                      />
                    <button onClick={confirmarEdicionConPassword} style={{ ...styles.boton, marginTop: '10px' }}>
                        Confirmar
                        </button>
                    <button onClick={() => setMostrarModal(false)} style={{ ...styles.boton, backgroundColor: '#aaa', marginTop: '10px' }}>
                        Cancelar
                        </button>
                  </div>
              </div>
          )}
      </form>
  )
}

const styles = {
  form: {
    backgroundColor: '#fefefe',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '2rem auto'
  },
  titulo: {
    marginBottom: '20px',
    fontSize: '1.5em',
    textAlign: 'center',
    color: '#2c3e50'
  },
  group: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '5px'
  },
  boton: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer'
  },
  mensajeExito: {
    color: '#2ecc71',
    marginTop: '10px',
    textAlign: 'center'
  },
  mensajeError: {
    color: '#e74c3c',
    marginTop: '10px',
    textAlign: 'center'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    textAlign: 'center',
    width: '300px'
  }
}

export default SprintForm
