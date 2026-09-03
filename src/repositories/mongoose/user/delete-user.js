import { UserModel } from '../../../models/User.js'
import { TransactionModel } from '../../../models/Transaction.js'
import { UserNotFoundError } from '../../../errors/user.js'
import { toDocument } from '../../../utils/decimal.js'

export class MongooseDeleteUserRepository {
    async execute(userId) {
        const user = await UserModel.findOne({ id: userId })

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        await TransactionModel.deleteMany({ user: user._id })
        await UserModel.deleteOne({ _id: user._id })

        return toDocument(user)
    }
}
