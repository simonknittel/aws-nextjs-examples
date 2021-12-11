// @TODO

import { NextApiRequest, NextApiResponse } from "next"

// import nc from 'next-connect'
// import { validateCSRFRequest } from '../../../modules/csrf/utils'
// import { bodyValidation } from '../../../utils/bodyValidation'
// import { notAllowedHandler } from '../../../utils/notAllowedHandler'

// const handler = nc({
//   onNoMatch: notAllowedHandler([ 'PATCH' ])
// })
//   .patch(validateCSRFRequest(), bodyValidation(patchSchema), patchHandler)

// export default handler

const handler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  return res
    .status(501)
    .end()
}

export default handler
