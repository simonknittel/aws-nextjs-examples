import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { generateCSRFToken } from "./csrf";

export const withCSRFToken = (
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<{ [key: string]: any }> | Promise<GetServerSidePropsResult<{ [key: string]: any }>>
) => {
  return async (context: GetServerSidePropsContext) => {
    const result = await handler(context)

    const csrfToken = generateCSRFToken(context.req)
    // @TODO: Fix types
    if (csrfToken) {
      // @ts-ignore
      if (!result.props) result.props = {}
      // @ts-ignore
      result.props.csrfToken = csrfToken
    }

    return result
  }
}
