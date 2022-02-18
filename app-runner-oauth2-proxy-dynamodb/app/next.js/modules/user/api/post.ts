import { NextApiRequest, NextApiResponse } from "next";
import { userService } from "../service";

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @TODO: Pass creator from cookie
    await userService.create([req.body]);
  } catch (error) {
    return res.status(500).end();
  }

  return res.status(204).end();
}
