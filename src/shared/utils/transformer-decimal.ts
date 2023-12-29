import Decimal from 'decimal.js'

export const toDecimal = (
  value: string | number | null | undefined,
): Decimal => {
  return new Decimal(value || 0)
}
