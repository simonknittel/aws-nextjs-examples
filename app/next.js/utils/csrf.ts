import { createHmac } from 'crypto'
import { IncomingMessage } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

type ReqProp = IncomingMessage & { cookies: NextApiRequestCookies }

const SESSION_COOKIE = '_oauth2_proxy'
const CSRF_TOKEN_HEADER = 'x-csrf-token'
const CSRF_MAX_AGE = 1000 * 60 * 5 // 5 minutes

export function generateCSRFToken(req: ReqProp) {
  if (!process.env.CSRF_SECRET || !req.cookies[SESSION_COOKIE]) return null

  const timestamp = Date.now()

  const payload = `${ timestamp }; ${ req.cookies[SESSION_COOKIE] }`
  const hmac = generateHmac(payload)

  return `${ timestamp }; ${ hmac }`
}

export function validateCSRFRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  if (!process.env.CSRF_SECRET) return next()

  // Check if required cookies and headers are available
  if (!req.cookies[SESSION_COOKIE]) return res.status(403).json({ error: { message: 'Missing session cookie during CSRF token validation' } })
  if (!req.headers[CSRF_TOKEN_HEADER]) return res.status(403).json({ error: { message: 'Missing CSRF token' } })

  // Retrieve and prepare transmitted CSRF token
  let rawTransmittedTimestamp: string
  let rawTransmittedHmac: string
  if (typeof req.headers[CSRF_TOKEN_HEADER] === 'string') {
    [ rawTransmittedTimestamp, rawTransmittedHmac ] = (req.headers[CSRF_TOKEN_HEADER] as string).split(';') // @TODO: Not sure why this assertion is necessary
  } else {
    [ rawTransmittedTimestamp, rawTransmittedHmac ] = (req.headers[CSRF_TOKEN_HEADER]!.at(-1) as string).split(';') // @TODO: Not sure why this assertion is necessary
  }
  const transmittedTimestamp = parseInt(rawTransmittedTimestamp)
  const transmittedHmac = rawTransmittedHmac.trim()

  // Check if CSRF token is expired
  const now = Date.now()
  if (now - transmittedTimestamp > CSRF_MAX_AGE) return res.status(403).json({ error: { message: 'Expired CSRF token' } })

  // Check if CSRF token has been manipulated
  const correctPayload = `${ transmittedTimestamp }; ${req.cookies[SESSION_COOKIE]}`
  const correctHmac = generateHmac(correctPayload)
  if (correctHmac !== transmittedHmac) return res.status(403).json({ error: { message: 'Invalid CSRF token' } })

  return next()
}

function generateHmac(payload: string) {
  return createHmac('sha512', process.env.CSRF_SECRET as string)
    .update(payload)
    .digest('hex')
}
