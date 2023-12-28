import { hashSync } from 'bcryptjs'
import { genSalt } from './bcrypt-hash'

export const generateRandomPassword = async (randomString: string) => {
  const password = hashSync(randomString, await genSalt())
  return password
}
