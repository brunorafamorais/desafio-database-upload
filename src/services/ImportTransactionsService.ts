import path from 'path';
import csv from 'csvtojson';
import fs from 'fs';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(csvFilename: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const csvFilePath = path.join(uploadConfig.directory, csvFilename);

    const csvTransactions: CSVTransaction[] = await (
      await csv().fromFile(csvFilePath)
    ).map(transaction => ({
      ...transaction,
      value: Number(transaction.value),
    }));

    async function processCsvArray(
      csvArrayTransactions: CSVTransaction[],
    ): Promise<Transaction[]> {
      const responses = await Promise.all(csvArrayTransactions);
      const importedTransactions = [] as Transaction[];

      for (const t of responses) {
        const transaction = await createTransaction.execute(t);

        importedTransactions.push(transaction);
      }

      return importedTransactions;
    }

    const transactions = await processCsvArray(csvTransactions);

    const csvFileExists = await fs.promises.stat(csvFilePath);

    if (csvFileExists) {
      await fs.promises.unlink(csvFilePath);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
