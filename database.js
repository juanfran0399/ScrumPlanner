import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

// Crea una conexión
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

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

export async function addId (Test) {
  const result = await pool.query('INSERT INTO Test (Test) VALUES (?)', [Test])
  return result
}

const notes = await getIds()
console.log(notes)
