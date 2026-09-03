import { UserModel } from '../../../models/User.js'
import { EmailAlreadyInUseError } from '../../../errors/user.js'
import { isDuplicateKeyError, toDocument } from '../../../utils/decimal.js'

export class MongooseCreateUserRepository {
    async execute(createUsersParams) {
        try {
            const user = await UserModel.create({
                id: createUsersParams.id,
                first_name: createUsersParams.first_name,
                last_name: createUsersParams.last_name,
                email: createUsersParams.email,
                password: createUsersParams.password,
            })
            return toDocument(user)
        } catch (error) {
            if (isDuplicateKeyError(error)) {
                throw new EmailAlreadyInUseError(createUsersParams.email)
            }
            throw error
        }
    }
}
