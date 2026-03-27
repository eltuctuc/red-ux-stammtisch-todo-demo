import { createHmac } from 'node:crypto'

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/logout', '/api/cron/cleanup-trash']

export default defineEventHandler(async (event) => {
  const path = event.path

  // Only protect /api routes (not auth endpoints themselves)
  if (!path.startsWith('/api/') || PUBLIC_PATHS.includes(path)) return

  const config = useRuntimeConfig()
  const sessionCookie = getCookie(event, 'auth-session')

  if (!sessionCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const expectedToken = createHmac('sha256', config.sessionSecret)
    .update(config.authPin)
    .digest('hex')

  if (sessionCookie !== expectedToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
