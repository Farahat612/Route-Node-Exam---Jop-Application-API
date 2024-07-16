import express from 'express'

import auth from '../middleware/auth.js'
import authorize from '../middleware/authorize.js'

import { addJob } from '../controllers/jobController.js'

const router = express.Router()

router.post('/addJob', auth, authorize('Company_HR'), addJob)

export default router
