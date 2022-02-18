import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { identityProviderConnectionService } from "../modules/identityProviderConnection/service";
import { userService } from "../modules/user/service";
import { generateRandomName } from "./generateRandomName";

interface Options {
  redirect: string;
}

export const withAuthentication = (
  handler: (
    context: GetServerSidePropsContext
  ) =>
    | GetServerSidePropsResult<{ [key: string]: any }>
    | Promise<GetServerSidePropsResult<{ [key: string]: any }>>,
  options: Options
) => {
  return async (context: GetServerSidePropsContext) => {
    let providerId;
    if (typeof context.req.headers["x-forwarded-user"] === "string") {
      providerId = context.req.headers["x-forwarded-user"];
    } else {
      providerId = context.req.headers["x-forwarded-user"]!.at(-1)!;
    }

    let user;
    let identityProviderConnection;

    const existingIdentityProviderConnection =
      await identityProviderConnectionService.findByProviderId(
        "google",
        providerId
      );

    if (existingIdentityProviderConnection) {
      const foundUsers = await userService.findById([
        existingIdentityProviderConnection.userId,
      ]);
      user = foundUsers[0];

      identityProviderConnection = existingIdentityProviderConnection;
    } else {
      const createdUsers = await userService.create([
        {
          name: generateRandomName(),
        },
      ]);
      user = createdUsers[0];

      const createdIdentityProviderConnections =
        await identityProviderConnectionService.create([
          {
            userId: user.id,
            provider: "google",
            providerId: providerId,
          },
        ]);
      identityProviderConnection = createdIdentityProviderConnections[0];

      return {
        redirect: {
          destination: `/account/profile?redirect=${options.redirect}`,
          permanent: false,
        },
      };
    }

    const result = await handler(context);

    // @ts-ignore
    if (!result.props) result.props = {};
    // @ts-ignore
    result.props.me = {
      user,
      identityProviderConnection,
    };

    return result;
  };
};
