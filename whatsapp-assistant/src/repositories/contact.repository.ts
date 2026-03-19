import { prisma } from '../lib/prisma'
import { createLogger } from '../utils/logger'

const log = createLogger('contact-repository')

export const contactRepository = {
  /**
   * Busca o crea un contacto por su número de teléfono.
   * Actualiza el nombre si cambia.
   */
  async upsert(phone: string, name?: string) {
    try {
      return await prisma.contact.upsert({
        where: { phone },
        create: { phone, name },
        update: { name: name ?? undefined, updatedAt: new Date() },
      })
    } catch (err) {
      log.error({ err, phone }, 'Error en upsert de contacto')
      throw err
    }
  },

  async findByPhone(phone: string) {
    return prisma.contact.findUnique({ where: { phone } })
  },

  async findAll() {
    return prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
  },
}
