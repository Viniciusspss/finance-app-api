import { UserModel } from '../../../models/User.js'
import { toDocument } from '../../../utils/decimal.js'

export class MongooseGetUserByEmailRepository {
    async execute(email) {
        const user = await UserModel.findOne({ email })

        return toDocument(user)
    }
}
