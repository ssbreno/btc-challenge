import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

export const setupPassport = (passport: passport.Authenticator) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false,
  }

  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      done(null, jwt_payload)
    }),
  )
}
