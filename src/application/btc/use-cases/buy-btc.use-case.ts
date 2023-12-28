import { Account } from "../../../domain/entities/account.entity";
import { TransactionTypeEnum } from "../../../domain/enums/transaction-type.enum";
import { sendEmail } from "../../../infrastructure/email/use-case/email.use-case";
import { logger } from "../../../shared/loggers/logger";
import { formatBalanceInBRL } from "../../../shared/utils/format-currency";
import { FindAccountUseCase } from "../../account/use-cases/find-account.use-case";
import { UpdateAccountUseCase } from "../../account/use-cases/update-account.use-case";
import { CreateTransactionsUseCase } from "../../transactions/use-cases/create-transactions.use-case";
import { BTCMarketUseCase } from "./find-btc.use-case";

export class BuyBTCUseCase {
  private findAccountUseCase = new FindAccountUseCase();
  private bTCMarketUseCase = new BTCMarketUseCase();
  private createTransactionsUseCase = new CreateTransactionsUseCase();
  private updateAccountUseCase = new UpdateAccountUseCase();


  async execute(req: any, body: any): Promise<any> {
    try {
        const account = await this.checkAccountBalance(req);
        const btcPrice = await this.fetchBTCPrice();
        const btcAmount = await this.calculateBTCAmount(body.amount, btcPrice);
        await this.createBTCTransaction(body.amount, btcPrice, btcAmount, account);
        await this.updateAccountBalance(body, req);
        await this.sendConfirmationEmail(req.name, body.amount, btcAmount);

        return { account: account, btcPrice: btcPrice, btcAmount: btcAmount}
    } catch (error) {
      logger.error('Error in buying BTC', error);
      throw error;
    }
  }

  private async checkAccountBalance(req: any): Promise<any> {
    const account = await this.findAccountUseCase.getAccount(req);
    logger.warn('Account', account);
    return account;
  }

  private async fetchBTCPrice(): Promise<any> {
    const btcPrice = await this.bTCMarketUseCase.execute();
    logger.warn('BTC Price', btcPrice);
    return btcPrice.ticker.last;
  }

  private calculateBTCAmount(amountBRL: number, btcPrice: number): number {
    return amountBRL / btcPrice;
  }

  private async createBTCTransaction(amountBRL: number, btcPrice: number, btcAmount: number, account: Account): Promise<any> {
    const createTransactionsDTO = {
      type: TransactionTypeEnum.BUY,
      amount: amountBRL,
      btcPriceAtTransaction: btcPrice,
      btcAmount: btcAmount,
      account: account,
    };
    const createTransactions = await this.createTransactionsUseCase.createTransactions(createTransactionsDTO, account);
    logger.warn('Create Transactions', createTransactions);
    return createTransactions;
  }

  private async updateAccountBalance(dto: any, req: any): Promise<any> {
    const account = await this.updateAccountUseCase.updateAccount(dto, req);
    logger.warn('Update Account', account);
    return account
  }

  private async sendConfirmationEmail(userName: string, amountBRL: number, btcAmount: number): Promise<void> {
    const formattedBalance = formatBalanceInBRL(amountBRL);
    await sendEmail('ssobralbreno@gmail.com', 'BTC Order', 'buy-btc', { user: userName, amountBRL: formattedBalance, btcBought: btcAmount });
  }
}
