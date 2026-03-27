import { createHmac } from 'node:crypto'
import { z } from 'zod'

const bodySchema = z.object({
  pin: z.string().length(6).regex(/^\d{6}$/),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readValidatedBody(event, bodySchema.parse)

  if (body.pin !== config.authPin) {
    throw createError({ statusCode: 401, statusMessage: 'Falscher PIN' })
  }

  const sessionToken = createHmac('sha256', config.sessionSecret)
    .update(config.authPin)
    .digest('hex')

  setCookie(event, 'auth-session', sessionToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
  })

  return { ok: true }
})
