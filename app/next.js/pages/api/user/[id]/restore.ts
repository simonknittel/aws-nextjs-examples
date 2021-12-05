import nc from 'next-connect'
import { validateCSRFRequest } from '../../../../modules/csrf'
import { restoreHandler } from '../../../../modules/user/server'
import { notAllowedHandler } from '../../../../utils/notAllowedHandler'
import { uuidValidation } from '../../../../utils/uuidValidation'

const handler = nc({
  onNoMatch: notAllowedHandler([ 'PATCH' ])
})
  .patch(uuidValidation(), validateCSRFRequest(), restoreHandler)

export default handler
