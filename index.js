import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

import errorHandler from './middleware/errorHandler.js'

import userRoutes from './routes/userRoutes.js'

// Load env vars
dotenv.config()
// Connect to database
connectDB()
// Initialize express app
const app = express()
// Middleware
app.use(express.json())
// Routes
app.use('/api/users', userRoutes)

// Error handler middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
