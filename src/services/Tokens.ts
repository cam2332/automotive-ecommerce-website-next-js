import User from '../DAO/models/User'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import { NextApiResponse } from 'next'
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils'
import { IncomingMessage } from 'http'
import { IUser } from '../DAO/documents/User'
import { fromUserDocument } from '../utils/MongoConverter'

const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY || 'ultra-secure-secret-key'

const cookieOptions = {
  httpOnly: true,
  maxAge: 3600 * 24 * 60 * 60,
  path: '/',
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
}

function setCookie(
  res: any,
  name: string,
  value: string,
  options: Record<string, unknown> = {}
): void {
  const stringValue =
    typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value)

  res.setHeader('Set-Cookie', serialize(name, String(stringValue)))
}

export function authenticateUser(res: NextApiResponse, user: IUser): void {
  if (!user) return

  const token = jwt.sign({ email: user.email }, JWT_TOKEN_KEY, {
    expiresIn: '1d',
  })

  setCookie(res, 'auth', token, cookieOptions)
}

export function clearUser(res: NextApiResponse): void {
  setCookie(res, 'auth', '0', {
    ...cookieOptions,
    path: '/',
    maxAge: 1,
  })
}

export async function userFromRequest(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<IUser | undefined> {
  const { auth: token } = req.cookies

  if (!token) return undefined

  try {
    const data = jwt.verify(token, JWT_TOKEN_KEY)

    if (!data) return undefined

    const user = await User.findUserByEmail((data as any).email)

    return fromUserDocument(user)
  } catch (err) {
    return undefined
  }
}
