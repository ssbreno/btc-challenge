import { hashSync } from 'bcryptjs'
import { bcryptUtils } from './bcrypt-hash'
export interface IPasswordUtils {
  generateRandomPassword(randomString: string): Promise<string>
}

export const passwordUtils: IPasswordUtils = {
  generateRandomPassword: async (randomString: string): Promise<string> => {
    const password = hashSync(randomString, await bcryptUtils.genSalt())
    return password
  },
}
