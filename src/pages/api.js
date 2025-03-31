import axios from 'axios'

const API = 'http://localhost:4000/api/users'

export const crearUsuario = (nombre) =>
  axios.post(`${API}/register`, { nombre })

export const obtenerUsuarios = () =>
  axios.get(`${API}`)

export const registrarTareasSprint = (data) =>
  axios.post(`${API}/tareas`, data)

export const obtenerTareasPorUsuario = (usuario_id) =>
  axios.get(`${API}/tareas/${usuario_id}`)

export const eliminarTareasSprint = async (usuario_id, sprint) => {
  const res = await fetch(`http://localhost:4000/api/users/tareas/${usuario_id}/${sprint}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error al eliminar tareas del sprint')
}
