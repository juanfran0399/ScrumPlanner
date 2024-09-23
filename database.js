import mysql from 'mysql2'
import dotenv from 'dotenv'
import { identifierToKeywordKind } from 'typescript'
dotenv.config()

// Crea una conexión
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

export default pool

// Ejemplo de input (para prevenir inyección SQL)
// const testId = 1

// Ejemplo de input (para prevenir inyección SQL)
try {
  // const [result] = await pool.query('SELECT * FROM Test WHERE Test = ?', [testId])
  // console.log(result)
} catch (error) {
  // console.error('Error executing query:', error)
}

export async function getIds () {
  const [rows] = await pool.query('SELECT * FROM Test')
  return rows
}

export async function getId (Test) {
  const [rows] = await pool.query('SELECT * FROM Test WHERE Test = ?', [Test])
  return rows
}

export async function addId (name, description) {
  const result = await pool.query('INSERT INTO Equipos (name, description) VALUES (?, ?)', [name, description])
  return result
}

export async function userGet (username, contrasena) {
  const [rows] = await pool.query('SELECT * FROM Usuario WHERE (username, contrasena) = (?, ?)', [username, contrasena])
  return rows
}

export async function addSur (id_usuario, puntaje) {
  const result = await pool.query('INSERT INTO Encuesta (id_usuario, puntaje) VALUES (?, ?)', [id_usuario, puntaje])
  return result
}

const notes = await addId('Test', '135')
console.log(notes)
