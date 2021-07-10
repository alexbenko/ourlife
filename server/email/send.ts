import nodemailer from 'nodemailer'
import log from '../lib/log'
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
})

const sendEmail = function (subject = 'No Subject Set', text = 'No Text Set') {
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.MY_EMAIL,
    subject: subject,
    text: text
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      log.error('Error Sending Email: ' + error)
    } else {
      log.info('Email sent: ' + info.response)
    }
  })
}

export default sendEmail
