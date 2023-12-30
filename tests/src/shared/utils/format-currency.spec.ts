import { currencyFormatter } from '../../../../src/shared/utils/format-currency'

describe('CurrencyFormatter', () => {
  it('should correctly format the balance in Brazilian Real (BRL)', () => {
    const balance = 1234.56
    const formattedBalance = currencyFormatter.formatBalanceInBRL(balance)
    expect(formattedBalance).toBe('R$ 1.234,56')
  })

  it('should handle decimal rounding correctly', () => {
    const balance = 1234.567
    const formattedBalance = currencyFormatter.formatBalanceInBRL(balance)
    expect(formattedBalance).toBe('R$ 1.234,57')
  })

  it('should handle zero and negative values correctly', () => {
    expect(currencyFormatter.formatBalanceInBRL(0)).toBe('R$ 0,00')
    expect(currencyFormatter.formatBalanceInBRL(-1234.56)).toBe('-R$ 1.234,56')
  })
})
