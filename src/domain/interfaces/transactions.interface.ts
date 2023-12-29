export interface ITransaction {
  id: string
  type: string
  amount: number
  btcAmount: number | null
  btcPriceAtTransaction: number | null
  createdAt: string
  account: {
    id: string
    balance: number
    accountNumber: string
  }
}
