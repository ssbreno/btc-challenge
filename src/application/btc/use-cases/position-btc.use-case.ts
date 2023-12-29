import Decimal from 'decimal.js'
import dataSource from '../../../config/datasource.config'
import { Transaction } from '../../../domain/entities/transactions.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { logger } from '../../../shared/loggers/logger'
import { toDecimal } from '../../../shared/utils/transformer-decimal'
import { BTCMarketUseCase } from './find-btc.use-case'

export class PositionBTCUseCase {
  private transactionsRepository = dataSource.getRepository(Transaction)
  private bTCMarketUseCase = new BTCMarketUseCase()

  async execute(req: any): Promise<any> {
    const transactions = await this.fetchTransactions(req)
    const currentBtcPrice = toDecimal(await this.fetchBTCPrice())
    const totalInvested = this.calculateTotalInvested(transactions)
    const accountBalance = toDecimal(transactions[0]?.account.balance)
    const investmentPercentage = this.calculateInvestmentPercentage(
      totalInvested,
      accountBalance,
    )
    const totalBtc = this.calculateTotalBTC(transactions)
    const currentInvestmentValue = totalBtc.mul(currentBtcPrice)
    const investmentDetails = this.calculateInvestmentDetails(
      transactions,
      currentBtcPrice,
    )

    return {
      totalInvested: totalInvested.toFixed(2),
      investmentPercentage: investmentPercentage.toFixed(2),
      currentInvestmentValue: currentInvestmentValue.toFixed(2),
      investmentDetails,
    }
  }

  private async fetchTransactions(req: any): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { account: { id: req.account.id }, type: TransactionTypeEnum.BUY },
      relations: ['account'],
    })
  }

  private calculateTotalInvested(transactions: Transaction[]): Decimal {
    return transactions.reduce(
      (acc, t) => acc.plus(toDecimal(t.amount)),
      toDecimal(0),
    )
  }

  private calculateInvestmentPercentage(
    totalInvested: Decimal,
    accountBalance: Decimal,
  ): Decimal {
    return accountBalance.isZero()
      ? toDecimal(0)
      : totalInvested.div(accountBalance).mul(100)
  }

  private calculateTotalBTC(transactions: Transaction[]): Decimal {
    return transactions.reduce(
      (acc, t) => acc.plus(toDecimal(t.btcAmount || 0)),
      toDecimal(0),
    )
  }

  private calculateInvestmentDetails(
    transactions: Transaction[],
    currentBtcPrice: Decimal,
  ) {
    return transactions.map((t) => {
      const btcPriceAtTransaction = toDecimal(t.btcPriceAtTransaction || 0)
      const priceVariation = btcPriceAtTransaction.isZero()
        ? toDecimal(0)
        : currentBtcPrice
            .sub(btcPriceAtTransaction)
            .div(btcPriceAtTransaction)
            .mul(100)
      return {
        purchaseDate: t.createdAt,
        investedAmount: t.amount,
        btcPriceAtPurchase: t.btcPriceAtTransaction,
        priceVariationPercentage: priceVariation.toFixed(2),
      }
    })
  }

  private async fetchBTCPrice(): Promise<any> {
    const btcPrice = await this.bTCMarketUseCase.execute()
    logger.warn('BTC Price', btcPrice)
    return btcPrice.ticker.last
  }
}
