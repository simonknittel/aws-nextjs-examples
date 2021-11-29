import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../../services/user'
import nc from 'next-connect'
import { validateCSRFRequest } from '../../../utils/csrf'
import { bodyValidation } from '../../../utils/bodyValidation'

const patchSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  minProperties: 1,
  additionalProperties: false,
}

const handler = nc({
  onNoMatch: notAllowed
})
  .patch(validateCSRFRequest(), bodyValidation(patchSchema), patchHandler)
  .delete(validateCSRFRequest(), deleteHandler)

export default handler

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
