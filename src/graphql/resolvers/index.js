import { GraphQLError } from 'graphql'
import { ZodError } from 'zod'
import {
    EmailAlreadyInUseError,
    ForbiddenError,
    InvalidPasswordError,
    UnauthorizedError,
    UserNotFoundError,
} from '../../errors/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import {
    makeCreateTransactionUseCase,
    makeCreateUserUseCase,
    makeDeleteTransactionUseCase,
    makeDeleteUserUseCase,
    makeGetTransactionsByUserIdUseCase,
    makeGetUserBalanceUseCase,
    makeGetUserByIdUseCase,
    makeLoginUserUseCase,
    makeRefreshTokenUseCase,
    makeUpdateTransactionUseCase,
    makeUpdateUserUseCase,
} from '../../factories/controllers/user.js'
import { MongooseGetTransactionByIdRepository } from '../../repositories/mongoose/index.js'
import {
    createUserSchema,
    loginUserSchema,
    refreshTokenSchema,
    updateUserSchema,
} from '../../schemas/user.js'
import {
    createTransactionSchema,
    updateTransactionSchema,
} from '../../schemas/transaction.js'

const requireAuth = (context) => {
    if (!context.userId) {
        throw new GraphQLError('Unauthorized', {
            extensions: { code: 'UNAUTHENTICATED' },
        })
    }

    return context.userId
}

const handleDomainError = (error) => {
    if (error instanceof UserNotFoundError) {
        throw new GraphQLError('User not found', {
            extensions: { code: 'NOT_FOUND' },
        })
    }

    if (error instanceof TransactionNotFoundError) {
        throw new GraphQLError('Transaction not found', {
            extensions: { code: 'NOT_FOUND' },
        })
    }

    if (error instanceof EmailAlreadyInUseError) {
        throw new GraphQLError(error.message, {
            extensions: { code: 'BAD_REQUEST' },
        })
    }

    if (error instanceof InvalidPasswordError) {
        throw new GraphQLError('User unauthorized', {
            extensions: { code: 'UNAUTHORIZED' },
        })
    }

    if (error instanceof ForbiddenError) {
        throw new GraphQLError('Forbidden', {
            extensions: { code: 'FORBIDDEN' },
        })
    }

    if (error instanceof UnauthorizedError) {
        throw new GraphQLError('Unauthorized', {
            extensions: { code: 'UNAUTHENTICATED' },
        })
    }

    console.error(error)
    throw new GraphQLError('Internal server error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
    })
}

const omitPassword = (user) => {
    if (!user) {
        return null
    }

    const { password, ...safeUser } = user
    return safeUser
}

const formatTransaction = (transaction) => {
    if (!transaction) {
        return null
    }

    return {
        ...transaction,
        date: new Date(transaction.date).toISOString(),
    }
}

export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            try {
                const userId = requireAuth(context)
                const user = await makeGetUserByIdUseCase().execute(userId)
                return omitPassword(user)
            } catch (error) {
                handleDomainError(error)
            }
        },
        balance: async (_, { from, to }, context) => {
            try {
                const userId = requireAuth(context)
                return await makeGetUserBalanceUseCase().execute(
                    userId,
                    from,
                    to,
                )
            } catch (error) {
                handleDomainError(error)
            }
        },
        transactions: async (_, { from, to }, context) => {
            try {
                const userId = requireAuth(context)
                const transactions =
                    await makeGetTransactionsByUserIdUseCase().execute(
                        userId,
                        from,
                        to,
                    )

                return transactions.map(formatTransaction)
            } catch (error) {
                handleDomainError(error)
            }
        },
        transaction: async (_, { id }, context) => {
            try {
                const userId = requireAuth(context)
                const getTransactionByIdRepository =
                    new MongooseGetTransactionByIdRepository()
                const transaction =
                    await getTransactionByIdRepository.execute(id)

                if (!transaction) {
                    throw new TransactionNotFoundError(id)
                }

                if (transaction.user_id !== userId) {
                    throw new ForbiddenError()
                }

                return formatTransaction(transaction)
            } catch (error) {
                handleDomainError(error)
            }
        },
    },
    Mutation: {
        register: async (_, { input }) => {
            try {
                await createUserSchema.parseAsync(input)
                const createdUser = await makeCreateUserUseCase().execute(input)

                return {
                    ...omitPassword(createdUser),
                    tokens: createdUser.tokens,
                }
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new GraphQLError(error.errors[0].message, {
                        extensions: { code: 'BAD_REQUEST' },
                    })
                }

                handleDomainError(error)
            }
        },
        login: async (_, { input }) => {
            try {
                await loginUserSchema.parseAsync(input)
                const user = await makeLoginUserUseCase().execute(
                    input.email,
                    input.password,
                )

                return {
                    ...omitPassword(user),
                    tokens: user.tokens,
                }
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new GraphQLError(error.errors[0].message, {
                        extensions: { code: 'BAD_REQUEST' },
                    })
                }

                handleDomainError(error)
            }
        },
        refreshToken: async (_, { input }) => {
            try {
                await refreshTokenSchema.parseAsync({
                    refreshToken: input.refreshToken,
                })

                return makeRefreshTokenUseCase().execute(input.refreshToken)
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new GraphQLError(error.errors[0].message, {
                        extensions: { code: 'BAD_REQUEST' },
                    })
                }

                handleDomainError(error)
            }
        },
        updateUser: async (_, { input }, context) => {
            try {
                const userId = requireAuth(context)
                await updateUserSchema.parseAsync(input)
                const updatedUser = await makeUpdateUserUseCase().execute(
                    userId,
                    input,
                )

                return omitPassword(updatedUser)
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new GraphQLError(error.errors[0].message, {
                        extensions: { code: 'BAD_REQUEST' },
                    })
                }

                handleDomainError(error)
            }
        },
        deleteUser: async (_, __, context) => {
            try {
                const userId = requireAuth(context)
                const deletedUser =
                    await makeDeleteUserUseCase().execute(userId)

                return omitPassword(deletedUser)
            } catch (error) {
                handleDomainError(error)
            }
        },
        createTransaction: async (_, { input }, context) => {
            try {
                const userId = requireAuth(context)

                await createTransactionSchema.parseAsync({
                    ...input,
                    user_id: userId,
                })

                const transaction =
                    await makeCreateTransactionUseCase().execute({
                        ...input,
                        user_id: userId,
                    })

                return formatTransaction(transaction)
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new GraphQLError(error.errors[0].message, {
                        extensions: { code: 'BAD_REQUEST' },
                    })
                }

                handleDomainError(error)
            }
        },
        updateTransaction: async (_, { id, input }, context) => {
            try {
                const userId = requireAuth(context)

                await updateTransactionSchema.parseAsync(input)

                const transaction =
                    await makeUpdateTransactionUseCase().execute(id, {
                        ...input,
                        user_id: userId,
                    })

                return formatTransaction(transaction)
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new GraphQLError(error.errors[0].message, {
                        extensions: { code: 'BAD_REQUEST' },
                    })
                }

                handleDomainError(error)
            }
        },
        deleteTransaction: async (_, { id }, context) => {
            try {
                const userId = requireAuth(context)
                const transaction =
                    await makeDeleteTransactionUseCase().execute(id, userId)

                return formatTransaction(transaction)
            } catch (error) {
                handleDomainError(error)
            }
        },
    },
}
