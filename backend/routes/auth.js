import express from 'express'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
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

// Forgot Password: Send Email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  const [user] = await pool.query('SELECT id_usuario FROM Usuario WHERE email = ?', [email])

  if (!user.length) {
    return res.status(400).json({ success: false, message: 'Email no registrado' })
  }

  const token = crypto.randomBytes(20).toString('hex')
  const expiration = new Date(Date.now() + 3600000) // 1 hour expiry

  await pool.query('UPDATE Usuario SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', [token, expiration, email])

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'scrunplanner4@gmail.com',
      pass: 'Redpj1998'
    }
  })

  const resetUrl = `http://localhost:5173/reset-password/${token}`

  const mailOptions = {
    from: 'scrumplanner4@gmail.com',
    to: email,
    subject: 'Restablecimiento de contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ success: true, message: 'Correo enviado con éxito' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error enviando el correo' })
  }
})

// Reset Password: Update in Database
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body

  const [user] = await pool.query('SELECT id_usuario FROM Usuario WHERE reset_token = ? AND reset_token_expiry > NOW()', [token])

  if (!user.length) {
    return res.status(400).json({ success: false, message: 'Token inválido o expirado' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await pool.query('UPDATE Usuario SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?', [hashedPassword, token])

  res.json({ success: true, message: 'Contraseña actualizada con éxito' })
})

export default router
