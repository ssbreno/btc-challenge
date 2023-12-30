import Decimal from 'decimal.js'

export interface IDecimalUtils {
  toDecimal(value: string | number | null | undefined): Decimal
}

export const decimalUtils: IDecimalUtils = {
  toDecimal: (value: string | number | null | undefined): Decimal => {
    return new Decimal(value || 0)
  },
}
