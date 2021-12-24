import { NextApiRequest, NextApiResponse } from "next";
import { userService } from "../service";

export async function archiveHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    if (typeof id === "string") {
      await userService.update(id, { archivedDate: Date.now().toString() });
    } else {
      await userService.update(id[0], { archivedDate: Date.now().toString() });
    }
  } catch (error) {
    return res.status(500).end();
  }

  return res.status(204).end();
}
