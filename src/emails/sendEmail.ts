import nodemailer from 'nodemailer'
import { log, removeHtml } from '../lib'
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
})

const sendEmail = async function (subject = 'No Subject Set', text = 'No Text Set', html = '<p>None</p>', recipient = process.env.MY_EMAIL) {
  console.log(removeHtml(text))
  const mailOptions = {
    from: 'Our Life Server',
    to: recipient,
    subject: subject,
    text: removeHtml(text),
    html: html
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      log.error('Error Sending Email: ' + error)
      throw error
    } else {
      log.info('Email sent: ' + info.response)
    }
  })
}

export default sendEmail
