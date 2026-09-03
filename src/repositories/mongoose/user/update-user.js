import { UserModel } from '../../../models/User.js'
import { UserNotFoundError } from '../../../errors/user.js'
import { EmailAlreadyInUseError } from '../../../errors/user.js'
import { isDuplicateKeyError, toDocument } from '../../../utils/decimal.js'

export class MongooseUpdateUserRepository {
    async execute(userId, updateUserParams) {
        try {
            const user = await UserModel.findOneAndUpdate(
                { id: userId },
                { $set: updateUserParams },
                { new: true },
            )

            if (!user) {
                throw new UserNotFoundError(userId)
            }

            return toDocument(user)
        } catch (error) {
            if (isDuplicateKeyError(error)) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }

            throw error
        }
    }
}
