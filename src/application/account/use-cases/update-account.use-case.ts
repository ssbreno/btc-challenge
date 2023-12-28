import dataSource from '../../../config/datasource.config';
import { UpdateAccountDTO } from '../../../domain/dtos/account/update-account.dto';
import { Account } from '../../../domain/entities/account.entity';
import { FindTransactionsUseCase } from '../../transactions/use-cases/find-transactions.use-case';
import { FindAccountUseCase } from './find-account.use-case';

export class UpdateAccountUseCase {
  private accountRepository = dataSource.getRepository(Account);
  private findAccountUseCase = new FindAccountUseCase();
  private findTransactionsUseCase = new FindTransactionsUseCase();

  async updateAccount(dto: UpdateAccountDTO, req: any): Promise<Pick<Account, 'balance'>> {
    await this.findAccountUseCase.checkAccountBalance(req, dto);
    const lastTransactions = await this.findTransactionsUseCase.findLatestBuyTransaction(req);
    const account = await this.findAccountUseCase.getAccount(req);
    const totalAmount = this.calculateTotalAmount(account.balance, lastTransactions);
    const updatedAccount = await this.updateAccountBalance(account, totalAmount);
    return { balance: updatedAccount.balance };
  }

  private calculateTotalAmount(currentBalance: number, lastTransaction: any): number {
    if (!lastTransaction) {
        throw new Error('No recent transaction found');
    }
    const totalAmount = currentBalance - Number(lastTransaction.amount);
    return totalAmount;
}

  private async updateAccountBalance(account: Account, newBalance: number): Promise<Account> {
    const updatedAccount = { ...account, balance: newBalance };
    return this.accountRepository.save(updatedAccount);
  }
}
