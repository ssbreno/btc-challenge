import jwt from 'jsonwebtoken'

export const generateToken = (payload: any, isRefreshToken: boolean) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: !isRefreshToken
      ? process.env.JWT_EXPIRES_IN_ACCESS_TOKEN
      : process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
  })
}
