import { Request } from 'express'
import { asString } from './dataHelper'

export function checkAuthorizationHeader (req: Request): string | null {
  const authorizationHeader: string = asString(req.headers.authorization)
  // This is the regex to match UUID's - for matching JWT's a different must be used
  const regex: RegExp = new RegExp('^Bearer\\s[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
  const isBearer = regex.test(authorizationHeader)
  if (!isBearer) {
    return null
  }
  return authorizationHeader.split(' ')[1]
}