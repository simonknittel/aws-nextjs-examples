import { createHmac } from 'crypto'
import { IncomingMessage } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

type ReqProp = IncomingMessage & { cookies: NextApiRequestCookies }

/**
 * Export the header separately so we can import it in the client bundle without
 * having the whole service imported which contains server-side secrets.
 */

class CsrfService {
  SESSION_COOKIE = '_oauth2_proxy'
  CSRF_TOKEN_HEADER = 'x-csrf-token'
  CSRF_MAX_AGE = 1000 * 60 * 5 // 5 minutes

  public generateToken(req: ReqProp) {
    if (!process.env.CSRF_SECRET || !req.cookies[this.SESSION_COOKIE]) return null

    const timestamp = Date.now()

    const payload = `${ timestamp }; ${ req.cookies[this.SESSION_COOKIE] }`
    const hmac = this.generateHmac(payload)

    return `${ timestamp }; ${ hmac }`
  }

  public validateRequest(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (!process.env.CSRF_SECRET) return true

    // Check if required cookies and headers are available
    if (!req.cookies[this.SESSION_COOKIE]) return res.status(403).json({ error: { message: 'Missing session cookie during CSRF token validation' } })
    if (!req.headers[this.CSRF_TOKEN_HEADER]) return res.status(403).json({ error: { message: 'Missing CSRF token' } })

    // Retrieve and prepare transmitted CSRF token
    let rawTransmittedTimestamp: string
    let rawTransmittedHmac: string
    if (typeof req.headers[this.CSRF_TOKEN_HEADER] === 'string') {
      [ rawTransmittedTimestamp, rawTransmittedHmac ] = (req.headers[this.CSRF_TOKEN_HEADER] as string).split(';') // @TODO: Not sure why this assertion is necessary
    } else {
      [ rawTransmittedTimestamp, rawTransmittedHmac ] = (req.headers[this.CSRF_TOKEN_HEADER]!.at(-1) as string).split(';') // @TODO: Not sure why this assertion is necessary
    }
    const transmittedTimestamp = parseInt(rawTransmittedTimestamp)
    const transmittedHmac = rawTransmittedHmac.trim()

    // Check if CSRF token is expired
    const now = Date.now()
    if (now - transmittedTimestamp > this.CSRF_MAX_AGE) return res.status(403).json({ error: { message: 'Expired CSRF token' } })

    // Check if CSRF token has been manipulated
    const correctPayload = `${ transmittedTimestamp }; ${req.cookies[this.SESSION_COOKIE]}`
    const correctHmac = this.generateHmac(correctPayload)
    if (correctHmac !== transmittedHmac) return res.status(403).json({ error: { message: 'Invalid CSRF token' } })

    return true
  }

  private generateHmac(payload: string) {
    return createHmac('sha512', process.env.CSRF_SECRET as string)
      .update(payload)
      .digest('hex')
  }
}

const csrfService = new CsrfService()
export { csrfService }
