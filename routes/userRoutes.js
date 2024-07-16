import express from 'express'

import {
  signUp,
  signIn,
  updateAccount,
  deleteAccount,
  getUserAccountData,
  getProfileDataForAnotherUser,
  getAccountsByRecoveryEmail,
  updatePassword,
  forgetPassword,
  resetPassword,
} from '../controllers/userController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.put('/updateAccount', auth, updateAccount)
router.delete('/deleteAccount', auth, deleteAccount)
router.get('/getUserAccountData', auth, getUserAccountData)
router.get('/getProfileDataForAnotherUser', auth, getProfileDataForAnotherUser)
router.get('/getAccountsByRecoveryEmail', auth, getAccountsByRecoveryEmail)
router.put('/updatePassword', auth, updatePassword)
router.post('/forgetPassword', forgetPassword)
router.put('/resetPassword', resetPassword)

export default router
