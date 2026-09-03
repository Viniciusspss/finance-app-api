import { UserModel } from '../../../models/User.js'
import { toDocument } from '../../../utils/decimal.js'

export class MongooseGetUserByIdRepository {
    async execute(userId) {
        const user = await UserModel.findOne({ id: userId })

        return toDocument(user)
    }
}
