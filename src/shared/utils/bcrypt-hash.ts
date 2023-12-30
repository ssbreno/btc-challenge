import { genSaltSync, compareSync } from 'bcryptjs'

export interface IBcryptUtils {
  genSalt(): Promise<string>
  compare(text: string, hash: string): Promise<boolean>
}

export const bcryptUtils: IBcryptUtils = {
  genSalt: async (): Promise<string> => {
    return genSaltSync(10)
  },
  compare: async (text: string, hash: string): Promise<boolean> => {
    return compareSync(text, hash)
  },
}
