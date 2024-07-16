import express from 'express'

import { signUp, signIn, updateAccount, deleteAccount, getUserAccountData } from '../controllers/userController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.put('/updateAccount', auth, updateAccount)
router.delete('/deleteAccount', auth, deleteAccount)
router.get('/getUserAccountData', auth, getUserAccountData)

export default router
