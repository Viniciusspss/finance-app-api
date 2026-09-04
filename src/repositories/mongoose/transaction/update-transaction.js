import { TransactionModel } from '../../models/Transaction.js'
import { TransactionNotFoundError } from '../../../errors/index.js'
import { formatAmount, toDocument } from '../../../utils/decimal.js'

export class MongooseUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        const data = { ...updateTransactionParams }

        if (data.date) {
            data.date = new Date(data.date)
        }

        if (data.amount !== undefined) {
            data.amount = formatAmount(data.amount)
        }

        delete data.user_id

        const transaction = await TransactionModel.findOneAndUpdate(
            { id: transactionId },
            { $set: data },
            { new: true },
        )

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        return toDocument(transaction)
    }
}
