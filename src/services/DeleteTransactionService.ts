import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const findTransactionExists = await transactionsRepository.findOne({
      where: { id },
    });

    if (!findTransactionExists) {
      throw new AppError('Transaction not found.');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
