import express from 'express'

import auth from '../middleware/auth.js'
import authorize from '../middleware/authorize.js'

import {
  addJob,
  updateJob,
  deleteJob,
  getAllJobsWithCompanies,
  getJobsForCompany
} from '../controllers/jobController.js'

const router = express.Router()

router.post('/addJob', auth, authorize('Company_HR'), addJob)
router.put('/updateJob/:jobId', auth, authorize('Company_HR'), updateJob)
router.delete('/deleteJob/:jobId', auth, authorize('Company_HR'), deleteJob)
router.get('', auth, authorize('Company_HR', 'User'), getAllJobsWithCompanies)
router.get('/companyJobs', auth, authorize('Company_HR', 'User'), getJobsForCompany)

export default router
