import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import surveyRoutes from './routes/survey.js'
import teamRoutes from './routes/team.js'
import sprintRoutes from './routes/sprint.js'
import plannerRoutes from './routes/planner.js'
import miembrosRoutes from './routes/miembros.js'
import pool from './database.js'
import KNN from 'ml-knn'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/survey', surveyRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/sprint', sprintRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/miembros', miembrosRoutes)

// Sample Training Data for KNN (Replace with actual dataset)
const trainingData = [
  { responses: [4, 3, 4, 4, 3, 4, 2, 4, 4, 3, 4, 4, 4], role: 'Scrum Owner' },
  { responses: [3, 2, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 3], role: 'Scrum Master' },
  { responses: [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2], role: 'Developer' }
]

// Convert training data into features and labels
const trainingFeatures = trainingData.map(data => data.responses)
const trainingLabels = trainingData.map(data => data.role)

// Debugging: Check data format
console.log('Training Features:', trainingFeatures)
console.log('Training Labels:', trainingLabels)

// Initialize and train KNN classifier
const knn = new KNN(trainingFeatures, trainingLabels)

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
