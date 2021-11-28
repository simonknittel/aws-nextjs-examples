import Ajv from 'ajv'
import type { NextApiRequest, NextApiResponse } from 'next'
import { csrfService } from '../../../services/csrfService'
import { userService } from '../../../services/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PATCH': return patch(req, res)
    case 'DELETE': return deleteMethod(req, res)
    default: return notAllowed(req, res)
  }
}

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  minProperties: 1,
  additionalProperties: false,
}

const ajv = new Ajv()
const validate = ajv.compile(schema)

async function patch(
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

  const { id } = req.query

  try {
    if (typeof id === 'string') {
      await userService.update(id, req.body)
    } else {
      await userService.update(id[0], req.body)
    }
  } catch (error) {
    return res
      .status(500)
      .end()
  }

  return res
    .status(204)
    .end()
}

async function deleteMethod(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (csrfService.validateRequest(req, res) !== true) return

  const { id } = req.query

  try {
    if (typeof id === 'string') {
      await userService.delete([ { id } ])
    } else {
      await userService.delete([ { id: id[0] } ])
    }
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
    .setHeader('Allow', 'PATCH, DELETE')
    .end()
}
