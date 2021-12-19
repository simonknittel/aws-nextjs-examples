import { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../service'

export async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = typeof req.query.id === 'string' ? req.query.id : req.query.id[0]

    const foundUsers = await userService.findById([ id ])

    return res
      .status(200)
      .json(foundUsers[0])
  } catch (error) {
    return res
      .status(500)
      .end()
  }
}
