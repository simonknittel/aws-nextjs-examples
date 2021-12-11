import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { identityProviderConnectionService } from '../modules/identityProviderConnection/service'
import { userService } from '../modules/user/service'
import { generateRandomName } from './generateRandomName'

interface Options {
  redirect: string;
}

export const withAuthentication = (
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<{ [key: string]: any }> | Promise<GetServerSidePropsResult<{ [key: string]: any }>>,
  options: Options,
) => {
  return async (context: GetServerSidePropsContext) => {
    console.log(context.req.headers['x-forwarded-user'], context.req.headers['x-forwarded-email'])

    let providerId
    if (typeof context.req.headers['x-forwarded-user'] === 'string') {
      providerId = context.req.headers['x-forwarded-user']
    } else {
      // @TODO: Do something if x-forwarded-user doesn't exist and then remove the !
      providerId = context.req.headers['x-forwarded-user']!.at(-1)!
    }

    const existingUser = await identityProviderConnectionService.findByProviderId([{
      provider: 'google',
      providerId: providerId,
    }])

    if (existingUser.length === 0) {
      const createdUser = await userService.create([{
        name: generateRandomName(),
      }])

      await identityProviderConnectionService.create([{
        userId: createdUser[0].id,
        provider: 'google',
        providerId: providerId,
      }])

      return { redirect: {
        destination: `/welcome?redirect=${ options.redirect }`,
        permanent: false,
      } }
    }

    return handler(context)
  }
}
