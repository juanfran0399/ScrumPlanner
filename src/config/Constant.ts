const HOST = import.meta.env.VITE_HOST as string
const API = `http://${HOST}:3053`

const ALL: string = '/all'
const ID: string = '/id'
const PROYECTS: string = '/proyects'

export { API, PROYECTS, ALL, ID }
