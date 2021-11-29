import Ajv from 'ajv'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'

const ajv = new Ajv()

export function bodyValidation(schema: any) {
  const validate = ajv.compile(schema)

  return (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    const valid = validate(req.body)
    if (!valid) {
      return res
        .status(400)
        .end()
    }

    return next()
  }
}
