import { CreateTransactionController } from '../../controllers/index.js'
import {
    MongooseCreateTransactionRepository,
    MongooseGetUserByIdRepository,
} from '../../repositories/mongoose/index.js'
import { CreateTransactionUseCase } from '../../use-cases/index.js'

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
