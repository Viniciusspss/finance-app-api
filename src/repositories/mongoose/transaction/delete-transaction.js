import { TransactionModel } from '../../models/Transaction.js'
import { TransactionNotFoundError } from '../../../errors/index.js'
import { toDocument } from '../../../utils/decimal.js'

export class MongooseDeleteTransactionRepository {
    async execute(transactionId) {
        const transaction = await TransactionModel.findOneAndDelete({
            id: transactionId,
        })

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        return toDocument(transaction)
    }
}
