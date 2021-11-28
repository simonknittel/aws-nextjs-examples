import Ajv from 'ajv'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../../services/user'
import nc from 'next-connect'
import { validateCSRFRequest } from '../../../utils/csrf'

const handler = nc({
  onNoMatch: notAllowed
})
  .patch(validateCSRFRequest, patchHandler)
  .delete(validateCSRFRequest, deleteHandler)

export default handler

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

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
