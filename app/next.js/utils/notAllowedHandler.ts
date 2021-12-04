import { NextApiRequest, NextApiResponse } from 'next'

export function notAllowedHandler(methods: string[]) {
  return (
    req: NextApiRequest,
    res: NextApiResponse,
  ) => {
    return res
      .status(405)
      .setHeader('Allow', methods.join(', '))
      .end()
  }
}
