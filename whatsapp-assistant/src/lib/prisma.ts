import { PrismaClient } from '@prisma/client'
import { createLogger } from '../utils/logger'

const log = createLogger('prisma')

// Singleton para evitar múltiples instancias en desarrollo con hot-reload
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  })

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}

prisma.$on('error' as never, (e: unknown) => {
  log.error({ e }, 'Prisma error')
})

prisma.$on('warn' as never, (e: unknown) => {
  log.warn({ e }, 'Prisma warn')
})
