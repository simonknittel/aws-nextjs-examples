import { NextApiRequest, NextApiResponse } from "next";
import { userService } from "../service";

export async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (typeof id === "string") {
      await userService.update(id, req.body);
    } else {
      await userService.update(id[0], req.body);
    }
  } catch (error) {
    return res.status(500).end();
  }

  /**
   * For some reason a 204 response to a PATCH request causes Chrome to log
   * "Fetch failed loading: PATCH {PH3}." even though the request is successful.
   * See https://stackoverflow.com/questions/57477805/why-do-i-get-fetch-failed-loading-when-it-actually-worked
   */
  return res.status(204).end();
}
