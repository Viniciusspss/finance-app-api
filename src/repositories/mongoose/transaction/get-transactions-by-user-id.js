import { TransactionModel } from '../../../models/Transaction.js'
import { toDocument } from '../../../utils/decimal.js'

export class MongooseGetTransactionsByUserIdRepository {
    async execute(userId, from, to) {
        const transactions = await TransactionModel.find({
            user_id: userId,
            date: {
                $gte: new Date(from),
                $lte: new Date(to),
            },
        })

        return transactions.map(toDocument)
    }
}
