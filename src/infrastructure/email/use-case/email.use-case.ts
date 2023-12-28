import sgMail from '@sendgrid/mail'
import { logger } from '../../../shared/loggers/logger'

const sendEmail = async ({ to, from, subject, text, html }) => {
  const msg = { to, from, subject, text, html }
  try {
    await sgMail.send(msg)
    logger.info('Email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

export default sendEmail
