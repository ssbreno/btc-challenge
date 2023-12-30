import { randomNumberUtils } from '../../../../src/shared/utils/generate-random-number'

describe('RandomNumberUtils', () => {
  it('should generate a random number string of length 6', () => {
    const randomNumber = randomNumberUtils.generateRandomNumber()
    expect(randomNumber).toHaveLength(6)
    expect(parseInt(randomNumber)).toBeGreaterThanOrEqual(100000)
    expect(parseInt(randomNumber)).toBeLessThanOrEqual(999999)
  })

  it('should generate different random numbers on consecutive calls', () => {
    const randomNumber1 = randomNumberUtils.generateRandomNumber()
    const randomNumber2 = randomNumberUtils.generateRandomNumber()
    expect(randomNumber1).not.toEqual(randomNumber2)
  })
})
