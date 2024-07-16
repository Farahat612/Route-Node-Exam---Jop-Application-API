import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.email',
  port: 587,
  secure: false,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
