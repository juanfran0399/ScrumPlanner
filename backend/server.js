import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import surveyRoutes from './routes/survey.js'

const app = express()

// Use cors middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/survey', surveyRoutes)
app.use('/api/team', surveyRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
