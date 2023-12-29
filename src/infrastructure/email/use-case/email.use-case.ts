import { promises as fs } from 'fs'
import path from 'path'
import mailjet from 'node-mailjet'
import Handlebars from 'handlebars'

const mailjetConfig = {
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
}

const mailjetClient = mailjet.apiConnect(
  mailjetConfig.apiKey,
  mailjetConfig.apiSecret,
)

async function getTemplate(templateName) {
  const templatePath = path.join(
    __dirname,
    '..',
    'templates',
    `${templateName}.hbs`,
  )
  try {
    return await fs.readFile(templatePath, 'utf-8')
  } catch (error) {
    console.error('Error reading email template:', error)
    throw error
  }
}

export const sendEmail = async (toEmail, subject, template, data) => {
  const templateSource = await getTemplate(template)
  const templateCompile = Handlebars.compile(templateSource)
  const htmlPart = templateCompile(data)
  await mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'ssobralbreno@gmail.com',
          Name: 'BTC Company',
        },
        To: [
          {
            Email: toEmail,
          },
        ],
        Subject: subject,
        HTMLPart: htmlPart,
      },
    ],
  })
}
