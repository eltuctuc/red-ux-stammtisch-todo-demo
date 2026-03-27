export default defineEventHandler((event) => {
  deleteCookie(event, 'auth-session', { path: '/' })
  return { ok: true }
})
