import React, { useEffect, useState } from 'react'
import UserRegister from './components/UserRegister'
import SprintForm from './components/SprintForm'
import SprintAudit from './components/SprintAudit'
import { obtenerUsuarios } from './services/api'

const App = () => {
  const [usuarios, setUsuarios] = useState([])

  const cargarUsuarios = async () => {
    const res = await obtenerUsuarios()
    setUsuarios(res.data)
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>📅 ScrumPlanner</h1>

      <div style={styles.grid}>
          <div style={styles.card}>
            <UserRegister onUsuarioCreado={cargarUsuarios} />
            <SprintAudit />
          </div>
          <div style={styles.card}>
            <SprintForm usuarios={usuarios} onTareasRegistradas={cargarUsuarios} />
          </div>
        </div>
    </div>
  )
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    padding: '2rem',
    backgroundColor: '#f2f4f8',
    minHeight: '100vh'
  },
  titulo: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    color: '#333'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: '1rem'
  },
  auditoria: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: '1.5rem'
  }
}

export default App
