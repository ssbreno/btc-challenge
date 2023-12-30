export interface IRandomNumberUtils {
  generateRandomNumber(): string
}

export const randomNumberUtils: IRandomNumberUtils = {
  generateRandomNumber: (): string => {
    const min = 100000
    const max = 999999
    return String(Math.floor(Math.random() * (max - min + 1)) + min)
  },
}
