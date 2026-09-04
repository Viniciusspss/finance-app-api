import { TransactionModel } from '../../../models/Transaction.js'
import { toDocument } from '../../../utils/decimal.js'

export class MongooseGetTransactionByIdRepository {
    async execute(transactionId) {
        const transaction = await TransactionModel.findOne({ id: transactionId })

        return toDocument(transaction)
    }
}
