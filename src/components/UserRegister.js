import React, { useState, useEffect } from 'react'
import { crearUsuario, obtenerUsuarios } from '../services/api'

const UserRegister = ({ onUsuarioCreado }) => {
  const [nombre, setNombre] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    obtenerUsuarios().then(res => setUsuarios(res.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return

    const usuarioExistente = usuarios.find(
      u => u.nombre.toLowerCase() === nombre.toLowerCase()
    )

    if (usuarioExistente) {
      setMensaje({ tipo: 'error', texto: '❌ El usuario ya existe.' })
      return
    }

    try {
      setCargando(true)
      await crearUsuario(nombre)
      setNombre('')
      setMensaje({ tipo: 'exito', texto: '✅ Usuario registrado correctamente.' })
      onUsuarioCreado()
      const res = await obtenerUsuarios()
      setUsuarios(res.data)
    } catch (error) {
      setMensaje({ tipo: 'error', texto: '❌ Error al registrar usuario.' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.titulo}>Registrar Usuario</h3>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder='Nombre'
        required
        style={styles.input}
      />
      <button type='submit' disabled={cargando} style={styles.boton}>
        {cargando ? 'Guardando...' : 'Guardar'}
      </button>
      {mensaje && (
        <p style={mensaje.tipo === 'exito' ? styles.mensajeExito : styles.mensajeError}>
          {mensaje.texto}
        </p>
      )}
    </form>
  )
}

const styles = {
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: 'auto'
  },
  titulo: {
    marginBottom: '15px',
    fontSize: '1.5em',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  boton: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer'
  },
  mensajeExito: {
    color: '#4CAF50',
    marginTop: '10px'
  },
  mensajeError: {
    color: '#F44336',
    marginTop: '10px'
  }
}

export default UserRegister
