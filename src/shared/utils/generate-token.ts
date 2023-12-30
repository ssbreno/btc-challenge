import jwt from 'jsonwebtoken'
interface ITokenGenerator {
  generateToken(payload: any, isRefreshToken: boolean): string
}

export const tokenGenerator: ITokenGenerator = {
  generateToken: (payload: any, isRefreshToken: boolean): string => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: !isRefreshToken
        ? process.env.JWT_EXPIRES_IN_ACCESS_TOKEN
        : process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
    })
  },
}
