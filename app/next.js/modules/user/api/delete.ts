import { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../service'

export async function deleteHandler(
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
