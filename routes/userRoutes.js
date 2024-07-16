import express from 'express'

import { signUp, signIn, updateAccount } from '../controllers/userController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.put('/updateAccount', auth, updateAccount)

export default router
