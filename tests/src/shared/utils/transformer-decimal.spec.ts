import { Decimal } from 'decimal.js'
import { decimalUtils } from '../../../../src/shared/utils/transformer-decimal'

describe('DecimalUtils', () => {
  it('should convert a number to Decimal', () => {
    const result = decimalUtils.toDecimal(123)
    expect(result.equals(new Decimal(123))).toBeTruthy()
  })

  it('should convert a string to Decimal', () => {
    const result = decimalUtils.toDecimal('456')
    expect(result.equals(new Decimal(456))).toBeTruthy()
  })

  it('should handle null values by returning Decimal(0)', () => {
    const result = decimalUtils.toDecimal(null)
    expect(result.equals(new Decimal(0))).toBeTruthy()
  })

  it('should handle undefined values by returning Decimal(0)', () => {
    const result = decimalUtils.toDecimal(undefined)
    expect(result.equals(new Decimal(0))).toBeTruthy()
  })
})
