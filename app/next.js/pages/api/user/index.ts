import Ajv from 'ajv'
import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../../services/user'
import nc from 'next-connect'
import { validateCSRFRequest } from '../../../utils/csrf'

const handler = nc({
  onNoMatch: notAllowed
})
  .get(getHandler)
  .post(validateCSRFRequest, postHandler)

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

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  res: NextApiResponse,
) {
  return res
    .status(405)
    .setHeader('Allow', 'GET, POST')
    .end()
}
