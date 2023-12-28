import pino from 'pino'
import pretty from 'pino-pretty'

const prettyStream = pretty({
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname',
})

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  prettyStream,
)
