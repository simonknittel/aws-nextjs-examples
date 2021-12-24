import { NextApiRequest, NextApiResponse } from "next";
import { userService } from "../service";

export async function getAllHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await userService.findAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).end();
  }
}
