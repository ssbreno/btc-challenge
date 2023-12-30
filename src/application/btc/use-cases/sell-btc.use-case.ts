import { Account } from '../../../domain/entities/account.entity'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type.enum'
import { sendEmail } from '../../../infrastructure/email/use-case/email.use-case'
import { logger } from '../../../shared/loggers/logger'
import { currencyFormatter } from '../../../shared/utils/format-currency'
import { FindAccountUseCase } from '../../account/use-cases/find-account.use-case'
import { UpdateAccountUseCase } from '../../account/use-cases/update-account.use-case'
import { CreateTransactionsUseCase } from '../../transactions/use-cases/create-transactions.use-case'
import { FindTransactionsUseCase } from '../../transactions/use-cases/find-transactions.use-case'
import { BTCMarketUseCase } from './find-btc.use-case'

export class SellBTCUseCase {
  private findAccountUseCase = new FindAccountUseCase()
  private bTCMarketUseCase = new BTCMarketUseCase()
  private createTransactionsUseCase = new CreateTransactionsUseCase()
  private updateAccountUseCase = new UpdateAccountUseCase()
  private findTransactionsUseCase = new FindTransactionsUseCase()

  async execute(req: any, body: any): Promise<any> {
    try {
      await this.findAccountUseCase.checkAccountBTCBalance(req, body)
      if (body.amount < 0) throw new Error('Negative amount')
      const [account, btcPrice] = await Promise.all([
        this.findAccountUseCase.getAccount(req),
        this.fetchBTCPrice(),
      ])

      const { btcAmountToSell, totalBRLReceived } =
        await this.processSellTransactions(account, btcPrice, body.amount, req)

      await this.updateAccountBalance(
        totalBRLReceived,
        req,
        TransactionTypeEnum.SELL,
      )
      await this.sendConfirmationEmail(
        req.name,
        totalBRLReceived,
        btcAmountToSell,
      )

      return { totalBRLReceived, btcAmountToSell }
    } catch (error) {
      logger.error('Error in selling BTC', error)
      throw error
    }
  }

  private async processSellTransactions(account, btcPrice, amountBRL, req) {
    const buyTransactions =
      await this.findTransactionsUseCase.findLatestTransaction(req, [
        TransactionTypeEnum.BUY,
      ])
    let btcAmountSold = 0
    let totalBRLReceived = 0
    const btcAmountToSell = this.calculateBRLAmountFromBTC(amountBRL, btcPrice)
    for (const transaction of buyTransactions) {
      if (btcAmountSold >= btcAmountToSell) break
      let amountToSell = Math.min(
        transaction.btcAmount,
        btcAmountToSell - btcAmountSold,
      )
      btcAmountSold += amountToSell
      totalBRLReceived += amountToSell * transaction.btcPriceAtTransaction
      await this.createSellTransaction(
        amountBRL,
        btcAmountToSell,
        btcPrice,
        account,
      )
      await this.updateAccountBalance(
        btcAmountToSell,
        req,
        TransactionTypeEnum.PARCIAL_SELL,
      )
    }

    if (btcAmountSold < btcAmountToSell) {
      const residualBTC = btcAmountToSell - btcAmountSold
      await this.createBTCTransaction(amountBRL, btcPrice, residualBTC, account)
    }

    return { btcAmountToSell: btcAmountSold, totalBRLReceived }
  }

  private calculateBRLAmountFromBTC(
    btcAmountToSell: number,
    btcPrice: number,
  ): number {
    return btcAmountToSell / btcPrice
  }

  private async updateAccountBalance(
    dto: any,
    req: any,
    type: TransactionTypeEnum,
  ): Promise<any> {
    const account = await this.updateAccountUseCase.updateAccountToSell(
      dto,
      req,
      type,
    )
    logger.warn('Update Account', account)
    return account
  }

  private async createSellTransaction(
    amountBRL: number,
    btcAmountToSell: number,
    btcPrice: number,
    account: Account,
  ): Promise<any> {
    const createTransactionsDTO = {
      type: TransactionTypeEnum.SELL,
      amount: amountBRL,
      btcPriceAtTransaction: btcPrice,
      btcAmount: btcAmountToSell,
    }
    const createTransactions =
      await this.createTransactionsUseCase.createTransactions(
        createTransactionsDTO,
        account,
      )
    logger.warn('Create Transactions', createTransactions)
    return createTransactions
  }

  private async createBTCTransaction(
    amountBRL: number,
    btcPrice: number,
    btcAmount: number,
    account: Account,
  ): Promise<any> {
    const createTransactionsDTO = {
      type: TransactionTypeEnum.BUY,
      amount: amountBRL,
      btcPriceAtTransaction: btcPrice,
      btcAmount: btcAmount,
    }
    const createTransactions =
      await this.createTransactionsUseCase.createTransactions(
        createTransactionsDTO,
        account,
      )
    logger.warn('Create Transactions', createTransactions)
    return createTransactions
  }

  private async fetchBTCPrice(): Promise<any> {
    const btcPrice = await this.bTCMarketUseCase.execute()
    logger.warn('Checking BTC Price', btcPrice)
    return btcPrice.ticker.sell
  }

  private async sendConfirmationEmail(
    userName: string,
    amountBRL: number,
    btcAmount: number,
  ): Promise<void> {
    const formattedBalance = currencyFormatter.formatBalanceInBRL(amountBRL)
    logger.warn('Sending Sell BTC Email')
    await sendEmail('ssobralbreno@gmail.com', 'BTC SELL', 'sell-btc', {
      user: userName,
      amountBRL: formattedBalance,
      btcSell: btcAmount,
    })
  }
}
