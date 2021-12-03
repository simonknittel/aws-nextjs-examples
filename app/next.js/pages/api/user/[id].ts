import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../../services/user'
import nc from 'next-connect'
import { validateCSRFRequest } from '../../../modules/csrf/utils'
import { bodyValidation } from '../../../utils/bodyValidation'
import { patchSchema } from './schemas'
import { uuidValidation } from '../../../utils/uuidValidation'

const handler = nc({
  onNoMatch: notAllowed
})
  .use(uuidValidation())
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
