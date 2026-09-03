import {
    MongooseCreateUserRepository,
    MongooseGetUserByEmailRepository,
} from '../../repositories/mongoose/index.js'
import {
    CreateUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
} from '../../use-cases/index.js'
import { CreateUserController } from '../../controller/index.js'

import {
    PasswordHasherAdapter,
    IdGeneratorAdapter,
    TokensGeneratorAdapter,
    PasswordComparatorAdapter,
    TokenVerifierAdapter,
} from '../../adapters/index.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new MongooseGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new MongooseDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    return deleteUserController
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new MongooseGetUserByEmailRepository()

    const updateUserRepository = new MongooseUpdateUserRepository()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    )
    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}

export const makeUpdateUserUseCase = () => {
    const getUserByEmailRepository = new MongooseGetUserByEmailRepository()
    const updateUserRepository = new MongooseUpdateUserRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()

    return new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    )
}

export const makeDeleteUserUseCase = () => {
    const deleteUserRepository = new MongooseDeleteUserRepository()
    return new DeleteUserUseCase(deleteUserRepository)
}

export const makeGetUserByIdUseCase = () => {
    const getUserByIdRepository = new MongooseGetUserByIdRepository()
    return new GetUserByIdUseCase(getUserByIdRepository)
}

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

export const makeLoginUserUseCase = () => {
    const getUserByEmailRepository = new MongooseGetUserByEmailRepository()
    const passwordComparatorAdapter = new PasswordComparatorAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()

    return new LoginUserUseCase(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    )
}

export const makeRefreshTokenUseCase = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const tokenVerifierAdapter = new TokenVerifierAdapter()

    return new RefreshTokenUseCase(tokensGeneratorAdapter, tokenVerifierAdapter)
}

export const makeLoginUserController = () => {
    const getUserByEmailRepository = new MongooseGetUserByEmailRepository()
    const passwordComparatorAdapter = new PasswordComparatorAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const loginUserUseCase = new LoginUserUseCase(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    )

    const loginUserController = new LoginUserController(loginUserUseCase)

    return loginUserController
}

export const makeRefreshTokenController = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const tokenVerifierAdapter = new TokenVerifierAdapter()
    const refreshTokenUseCase = new RefreshTokenUseCase(
        tokensGeneratorAdapter,
        tokenVerifierAdapter,
    )

    const refreshTokenController = new RefreshTokenController(
        refreshTokenUseCase,
    )

    return refreshTokenController
}
