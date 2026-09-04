import {
    CreateTransactionController,
    DeleteTransactionController,
    UpdateTransactionController,
} from '../../controller/index.js'
import {
    MongooseCreateTransactionRepository,
    MongooseGetUserByIdRepository,
    MongooseDeleteTransactionRepository,
    MongooseGetTransactionByIdRepository,
    MongooseUpdateTransactionRepository,
} from '../../repositories/mongoose/index.js'
import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js'

import { IdGeneratorAdapter } from '../../adapters/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new MongooseCreateTransactionRepository()

    const getUserByIdRepository = new MongooseGetUserByIdRepository()

    const idGeneratorAdapter = new IdGeneratorAdapter()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new MongooseDeleteTransactionRepository()

    const getTransactionByIdRepository =
        new MongooseGetTransactionByIdRepository()

    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
        getTransactionByIdRepository,
    )

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    )

    return deleteTransactionController
}

export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new MongooseUpdateTransactionRepository()

    const getTransactionByIdRepository =
        new MongooseGetTransactionByIdRepository()

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
        getTransactionByIdRepository,
    )

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    return updateTransactionController
}
