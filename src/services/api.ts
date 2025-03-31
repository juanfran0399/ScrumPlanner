import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const obtenerUsuarios = () => {
  return axios.get(`${API_URL}/users`);
};

export const obtenerTareasPorUsuario = (id_usuario: number) => {
  return axios.get(`${API_URL}/users/tareas/${id_usuario}`);
};
