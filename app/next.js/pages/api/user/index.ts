import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../../services/user'
import nc from 'next-connect'
import { validateCSRFRequest } from '../../../modules/csrf/utils'
import { bodyValidation } from '../../../utils/bodyValidation'

const postSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: [ 'name' ],
  additionalProperties: false,
}

const handler = nc({
  onNoMatch: notAllowed
})
  .get(getHandler)
  .post(validateCSRFRequest(), bodyValidation(postSchema), postHandler)

export default handler

async function getHandler(
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

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  res: NextApiResponse,
) {
  return res
    .status(405)
    .setHeader('Allow', 'GET, POST')
    .end()
}
