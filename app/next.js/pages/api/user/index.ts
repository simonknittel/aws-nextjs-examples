import nc from 'next-connect'
import { validateCSRFRequest } from '../../../modules/csrf/utils'
import { bodyValidation } from '../../../utils/bodyValidation'
import { getAllHandler, postHandler, postSchema } from '../../../modules/user'
import { notAllowedHandler } from '../../../utils/notAllowedHandler'

const handler = nc({
  onNoMatch: notAllowedHandler([ 'GET', 'POST' ])
})
  .get(getAllHandler)
  .post(validateCSRFRequest(), bodyValidation(postSchema), postHandler)

export default handler
