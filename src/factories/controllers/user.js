import {
    MongooseCreateUserRepository,
    MongooseGetUserByEmailRepository,
} from '../../repositories/mongoose/index.js'
import { CreateUserUseCase } from '../../use-cases/index.js'
import { CreateUserController } from '../../controller/index.js'

import {
    PasswordHasherAdapter,
    IdGeneratorAdapter,
    TokensGeneratorAdapter,
} from '../../adapters/index.js'

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new MongooseGetUserByEmailRepository()

    const createUserRepository = new MongooseCreateUserRepository()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const generatorIdAdapter = new IdGeneratorAdapter()

    const tokensGeneratorAdapter = new TokensGeneratorAdapter()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        generatorIdAdapter,
        tokensGeneratorAdapter,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}
