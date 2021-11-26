import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../../services/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'DELETE': return deleteMethod(req, res)
    default: return notAllowed(req, res)
  }
}

async function deleteMethod(
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
    console.error(error)
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
    .setHeader('Allow', 'GET, POST, DELETE')
    .end()
}
