import express from 'express'

import auth from '../middleware/auth.js'
import authorize from '../middleware/authorize.js'

import {
  addCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController.js'

const router = express.Router()

router.post('/addCompany', auth, authorize('Company_HR'), addCompany)
router.put(
  '/updateCompany/:companyId',
  auth,
  authorize('Company_HR'),
  updateCompany
)
router.delete(
  '/deleteCompany/:companyId',
  auth,
  authorize('Company_HR'),
  deleteCompany
)

export default router
