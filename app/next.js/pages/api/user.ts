// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../services/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    // @TODO: Validate req.body

    // @TODO: Handle response
    await userService.create([ req.body ])

    return res
      .status(204)
      .end()
  }

  return res
    .status(405)
    .setHeader('Allow', 'PUT')
    .end()
}
