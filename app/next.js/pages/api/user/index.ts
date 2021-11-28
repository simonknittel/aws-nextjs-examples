import Ajv from 'ajv'
import type { NextApiRequest, NextApiResponse } from 'next'
import { csrfService } from '../../../services/csrfService'
import { userService } from '../../../services/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET': return get(req, res)
    case 'POST': return post(req, res)
    default: return notAllowed(req, res)
  }
}

async function get(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await userService.findAll()
    return res.json(users)
  } catch (error) {
    return res
      .status(500)
      .end()
  }
}

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: [ 'name' ],
  additionalProperties: false,
}

const ajv = new Ajv()
const validate = ajv.compile(schema)

async function post(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (csrfService.validateRequest(req, res) !== true) return

  const valid = validate(req.body)
  if (!valid) {
    return res
      .status(400)
      .end()
  }

  try {
    // @TODO: Pass creator from cookie
    await userService.create([ req.body ])
  } catch (error) {
    return res
      .status(500)
      .end()
  }

  return res
    .status(204)
    .end()
}

async function notAllowed(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res
    .status(405)
    .setHeader('Allow', 'GET, POST')
    .end()
}