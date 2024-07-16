import express from 'express'

import { signUp, signIn } from '../controllers/userController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)

export default router
