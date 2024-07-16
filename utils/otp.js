const otpStore = new Map()

export const generateOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  otpStore.set(email, otp)
  setTimeout(() => otpStore.delete(email), 300000) // OTP expires in 5 minutes
  return otp
}

export const verifyOTP = (email, otp) => {
  const storedOtp = otpStore.get(email)
  return storedOtp === otp
}
