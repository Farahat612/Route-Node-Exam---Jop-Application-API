import express from 'express'

import auth from '../middleware/auth.js'
import authorize from '../middleware/authorize.js'

import { addJob, updateJob, deleteJob } from '../controllers/jobController.js'

const router = express.Router()

router.post('/addJob', auth, authorize('Company_HR'), addJob)
router.put('/updateJob/:jobId', auth, authorize('Company_HR'), updateJob)
router.delete('/deleteJob/:jobId', auth, authorize('Company_HR'), deleteJob)

export default router
