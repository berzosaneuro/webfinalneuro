import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendIgDM } from '@/lib/instagram'
import type { WebhookPayload } from '@/types'

// ─── GET: verificación del webhook por Meta ────────────────────────────────────
export async function GET(req: Request) {
  const url = new URL(req.url)
  const mode      = url.searchParams.get('hub.mode')
  const token     = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// ─── POST: mensajes y eventos entrantes ──────────────────────────────────────
export async function POST(req: Request) {
  // Meta espera 200 OK inmediato
  const body: WebhookPayload = await req.json()

  // Procesar en background sin bloquear la respuesta
  processWebhook(body).catch(console.error)

  return NextResponse.json({ status: 'ok' })
}

async function processWebhook(payload: WebhookPayload) {
  if (payload.object !== 'instagram') return

  for (const entry of payload.entry) {
    // Mensajes directos
    if (entry.messaging) {
      for (const event of entry.messaging) {
        if (!event.message?.text) continue
        await handleDM({
          igAccountId: entry.id,
          senderId:    event.sender.id,
          text:        event.message.text,
        })
      }
    }

    // Comentarios en posts
    if (entry.changes) {
      for (const change of entry.changes) {
        if (change.field === 'comments') {
          await handleComment({
            igAccountId: entry.id,
            value:       change.value,
          })
        }
      }
    }
  }
}

async function handleDM(params: { igAccountId: string; senderId: string; text: string }) {
  const { igAccountId, senderId, text } = params

  const account = await prisma.instagramAccount.findUnique({ where: { igUserId: igAccountId } })
  if (!account) return

  // Buscar flujos activos de tipo DM para esta cuenta
  const flows = await prisma.flow.findMany({
    where: { accountId: account.id, isActive: true, triggerType: 'dm_keyword' },
  })

  for (const flow of flows) {
    const config = flow.triggerConfig as any
    const keywords: string[] = config?.keywords ?? []

    const matches = keywords.length === 0
      || keywords.some((kw: string) => text.toLowerCase().includes(kw.toLowerCase()))

    if (!matches) continue

    // Obtener o crear contacto
    let contact = await prisma.contact.findFirst({
      where: { accountId: account.id, igUserId: senderId },
    })

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          userId:    account.userId,
          accountId: account.id,
          igUserId:  senderId,
          lastContactAt: new Date(),
        },
      })
    }

    // Ejecutar el primer nodo de respuesta del flujo
    const nodes = (flow.nodes as any[]) ?? []
    const firstMessage = nodes.find((n: any) => n.type === 'send_dm' || n.type === 'send_message')

    if (firstMessage?.data?.message) {
      await sendIgDM({
        igUserId:    igAccountId,
        recipientId: senderId,
        message:     firstMessage.data.message,
        accessToken: account.accessToken,
      })

      // Incrementar stats
      await prisma.flowStats.upsert({
        where: { flowId: flow.id },
        create: { flowId: flow.id, triggered: 1, replied: 1 },
        update: { triggered: { increment: 1 }, replied: { increment: 1 } },
      })
    }

    break // Solo ejecutar el primer flujo que hace match
  }
}

async function handleComment(params: { igAccountId: string; value: unknown }) {
  // Flujos de tipo comment_keyword — lógica similar a handleDM
  // Expandible para responder comentarios o enviar DM al comentarista
  console.log('Comment event received:', params.igAccountId)
}
