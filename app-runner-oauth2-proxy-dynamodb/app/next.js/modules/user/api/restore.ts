import { NextApiRequest, NextApiResponse } from "next";
import { userService } from "../service";

export async function restoreHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    if (typeof id === "string") {
      await userService.update(id, { archivedDate: null });
    } else {
      await userService.update(id[0], { archivedDate: null });
    }
  } catch (error) {
    return res.status(500).end();
  }

  return res.status(204).end();
}
