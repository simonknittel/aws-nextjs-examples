import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import { validate, version } from 'uuid';

export function uuidValidation() {
  return (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    let uuid

    if (typeof req.query.id === 'string') {
      uuid = req.query.id
    } else {
      uuid = req.query.id[0]
    }

    if (validate(uuid) === false || version(uuid) !== 4) {
      return res
        .status(400)
        .json({ error: { message: 'Invalid UUID' }})
    }

    return next()
  }
}
