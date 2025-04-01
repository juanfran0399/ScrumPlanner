import express from 'express'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import db from '../database.js' // Make sure this file has the .js extension
import pool from '../database.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, contrasena } = req.body

  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, username FROM Usuario WHERE username = ? AND contrasena = ?',
      [username, contrasena]
    )

    // Check if id_usuario is being selected
    if (rows.length > 0) {
      console.log('Backend id_usuario:', rows[0].id_usuario) // Debug log
      res.json({ success: true, id_usuario: rows[0].id_usuario, username: rows[0].username })
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

router.post('/register', async (req, res) => {
  const { name, email, username, password } = req.body

  if (!name || !email || !username || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' })
  }

  try {
    // Check if username or email already exists
    const [existingUser] = await pool.query(
      'SELECT id_usuario FROM Usuario WHERE username = ? OR email = ?',
      [username, email]
    )
    if (existingUser.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already exists' })
    }

    // Insert new user
    await pool.query(
      'INSERT INTO Usuario (nombre, email, username, contrasena) VALUES (?, ?, ?, ?)',
      [name, email, username, password]
    )

    res.json({ success: true, message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router
