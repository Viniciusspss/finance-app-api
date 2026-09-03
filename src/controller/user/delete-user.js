import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    userNotFoundResponse,
    sanitizeUser,
} from '../helpers/index.js'

import { UserNotFoundError } from '../../errors/index.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            return ok(sanitizeUser(deletedUser))
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
