import nc from "next-connect";
import { validateCSRFRequest } from "../../../../modules/csrf/utils";
import { bodyValidation } from "../../../../utils/bodyValidation";
import { uuidValidation } from "../../../../utils/uuidValidation";
import {
  deleteHandler,
  getHandler,
  patchHandler,
  patchSchema,
} from "../../../../modules/user/server";
import { notAllowedHandler } from "../../../../utils/notAllowedHandler";

const handler = nc({
  onNoMatch: notAllowedHandler(["GET", "PATCH", "DELETE"]),
})
  .use(uuidValidation())
  .get(getHandler)
  .patch(validateCSRFRequest(), bodyValidation(patchSchema), patchHandler)
  .delete(validateCSRFRequest(), deleteHandler);

export default handler;
