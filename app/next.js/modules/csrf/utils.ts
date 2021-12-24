import { createHmac } from "crypto";
import { IncomingMessage } from "http";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { NextHandler } from "next-connect";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

type ReqProp = IncomingMessage & { cookies: NextApiRequestCookies };

const SESSION_COOKIE = "_oauth2_proxy";
const CSRF_TOKEN_HEADER = "x-csrf-token";
// @TODO: Find fix to CSRF token not updating when using client-side navigation
const CSRF_MAX_AGE = 1000 * 60 * 15; // 15 minutes

export function generateCSRFToken(req: ReqProp) {
  if (!process.env.CSRF_SECRET || !req.cookies[SESSION_COOKIE]) return null;

  const timestamp = Date.now();

  const payload = `${timestamp}; ${req.cookies[SESSION_COOKIE]}`;
  const hmac = generateHmac(payload);

  return `${timestamp}; ${hmac}`;
}

export function validateCSRFRequest() {
  return (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    if (!process.env.CSRF_SECRET) return next();

    // Check if required cookies and headers are available
    if (!req.cookies[SESSION_COOKIE])
      return res
        .status(403)
        .json({
          error: {
            message: "Missing session cookie during CSRF token validation",
          },
        });
    if (!req.headers[CSRF_TOKEN_HEADER])
      return res.status(403).json({ error: { message: "Missing CSRF token" } });

    // Retrieve and prepare transmitted CSRF token
    let rawTransmittedTimestamp: string;
    let rawTransmittedHmac: string;
    if (typeof req.headers[CSRF_TOKEN_HEADER] === "string") {
      [rawTransmittedTimestamp, rawTransmittedHmac] = (
        req.headers[CSRF_TOKEN_HEADER] as string
      ).split(";"); // @TODO: Not sure why this assertion is necessary
    } else {
      [rawTransmittedTimestamp, rawTransmittedHmac] = (
        req.headers[CSRF_TOKEN_HEADER]!.at(-1) as string
      ).split(";"); // @TODO: Not sure why this assertion is necessary
    }
    const transmittedTimestamp = parseInt(rawTransmittedTimestamp);
    const transmittedHmac = rawTransmittedHmac.trim();

    // Check if CSRF token is expired
    const now = Date.now();
    if (now - transmittedTimestamp > CSRF_MAX_AGE)
      return res.status(403).json({ error: { message: "Expired CSRF token" } });

    // Check if CSRF token has been manipulated
    const correctPayload = `${transmittedTimestamp}; ${req.cookies[SESSION_COOKIE]}`;
    const correctHmac = generateHmac(correctPayload);
    if (correctHmac !== transmittedHmac)
      return res.status(403).json({ error: { message: "Invalid CSRF token" } });

    return next();
  };
}

function generateHmac(payload: string) {
  return createHmac("sha512", process.env.CSRF_SECRET as string)
    .update(payload)
    .digest("hex");
}

export const withCSRFToken = (
  handler: (
    context: GetServerSidePropsContext
  ) =>
    | GetServerSidePropsResult<{ [key: string]: any }>
    | Promise<GetServerSidePropsResult<{ [key: string]: any }>>
) => {
  return async (context: GetServerSidePropsContext) => {
    const result = await handler(context);

    const csrfToken = generateCSRFToken(context.req);
    // @TODO: Fix types
    if (csrfToken) {
      // @ts-ignore
      if (!result.props) result.props = {};
      // @ts-ignore
      result.props.csrfToken = csrfToken;
    }

    return result;
  };
};
