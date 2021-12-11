import { NextApiRequest, NextApiResponse } from 'next'
import { identityProviderConnectionService } from '../../identityProviderConnection/service'
import { userService } from '../service'

export async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = typeof req.query.id === 'string' ? req.query.id : req.query.id[0]

    await userService.delete([ { id } ])

    const identityProviderConnection = await identityProviderConnectionService.findByUserId(id)

    const items = identityProviderConnection.map(item => ({ provider: item.provider, providerId: item.providerId }))
    await identityProviderConnectionService.delete(items)
  } catch (error) {
    return res
      .status(500)
      .end()
  }

  return res
    .status(204)
    .end()
}
