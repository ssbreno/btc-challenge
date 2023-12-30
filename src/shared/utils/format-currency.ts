interface ICurrencyFormatter {
  formatBalanceInBRL(balance: number): string
}

export const currencyFormatter: ICurrencyFormatter = {
  formatBalanceInBRL: (balance: number): string => {
    return balance.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  },
}
