import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import surveyRoutes from './routes/survey.js'
import teamRoutes from './routes/team.js'
import sprintRoutes from './routes/sprint.js'

const app = express()

// Use cors middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/survey', surveyRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/sprint', sprintRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
