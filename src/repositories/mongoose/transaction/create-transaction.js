import { TransactionModel } from '../../models/Transaction.js'
import { formatAmount, toDocument } from '../../utils/decimal.js'

export class MongooseCreateTransactionRepository {
    async execute(createTransactionParams) {
        const transaction = await TransactionModel.create({
            id: createTransactionParams.id,
            user_id: createTransactionParams.user_id,
            name: createTransactionParams.name,
            date: new Date(createTransactionParams.date),
            amount: formatAmount(createTransactionParams.amount),
            type: createTransactionParams.type,
        })

        return toDocument(transaction)
    }
}
