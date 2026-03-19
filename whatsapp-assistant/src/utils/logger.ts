import pino from 'pino'
import { env } from '../config/env'

// Logger singleton para toda la aplicación
export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' } }
      : undefined,
})

// Logger hijos por módulo para trazabilidad
export const createLogger = (module: string) => logger.child({ module })
