import supertest from 'supertest'
import { app } from '../app.js'
import { user, transaction } from '../tests/index.js'
import { faker } from '@faker-js/faker'

const graphqlRequest = (query, variables = {}, token) => {
    const request = supertest(app).post('/graphql').send({ query, variables })

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    return request
}

describe('GraphQL E2E Tests', () => {
    const from = '2025-01-01'
    const to = '2025-01-31'

    it('should register and login via GraphQL mutations', async () => {
        const registerMutation = `
            mutation Register($input: RegisterInput!) {
                register(input: $input) {
                    id
                    email
                    tokens {
                        acessToken
                        refreshToken
                    }
                }
            }
        `

        const registerResponse = await graphqlRequest(registerMutation, {
            input: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: faker.internet.email(),
                password: user.password,
            },
        })

        expect(registerResponse.status).toBe(200)
        expect(registerResponse.body.data.register.tokens.acessToken).toBeDefined()

        const loginMutation = `
            mutation Login($input: LoginInput!) {
                login(input: $input) {
                    id
                    tokens {
                        acessToken
                        refreshToken
                    }
                }
            }
        `

        const loginResponse = await graphqlRequest(loginMutation, {
            input: {
                email: registerResponse.body.data.register.email,
                password: user.password,
            },
        })

        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body.data.login.tokens.acessToken).toBeDefined()
    })

    it('should reject protected query without token', async () => {
        const query = `
            query {
                me {
                    id
                    email
                }
            }
        `

        const response = await graphqlRequest(query)

        expect(response.status).toBe(200)
        expect(response.body.errors[0].extensions.code).toBe('UNAUTHENTICATED')
    })

    it('should return authenticated user with valid token', async () => {
        const registerMutation = `
            mutation Register($input: RegisterInput!) {
                register(input: $input) {
                    id
                    email
                    tokens {
                        acessToken
                    }
                }
            }
        `

        const email = faker.internet.email()
        const registerResponse = await graphqlRequest(registerMutation, {
            input: {
                first_name: user.first_name,
                last_name: user.last_name,
                email,
                password: user.password,
            },
        })

        const token =
            registerResponse.body.data.register.tokens.acessToken

        const query = `
            query {
                me {
                    id
                    email
                }
            }
        `

        const response = await graphqlRequest(query, {}, token)

        expect(response.status).toBe(200)
        expect(response.body.data.me.email).toBe(email)
    })

    it('should create and list transactions for authenticated user', async () => {
        const registerMutation = `
            mutation Register($input: RegisterInput!) {
                register(input: $input) {
                    tokens {
                        acessToken
                    }
                }
            }
        `

        const registerResponse = await graphqlRequest(registerMutation, {
            input: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: faker.internet.email(),
                password: user.password,
            },
        })

        const token =
            registerResponse.body.data.register.tokens.acessToken

        const createMutation = `
            mutation CreateTransaction($input: CreateTransactionInput!) {
                createTransaction(input: $input) {
                    id
                    name
                    type
                    amount
                }
            }
        `

        const createResponse = await graphqlRequest(
            createMutation,
            {
                input: {
                    name: transaction.name,
                    date: new Date(from).toISOString(),
                    type: 'EARNING',
                    amount: transaction.amount,
                },
            },
            token,
        )

        expect(createResponse.status).toBe(200)
        expect(createResponse.body.data.createTransaction.type).toBe('EARNING')

        const listQuery = `
            query Transactions($from: String!, $to: String!) {
                transactions(from: $from, to: $to) {
                    id
                    name
                    type
                    amount
                }
            }
        `

        const listResponse = await graphqlRequest(
            listQuery,
            { from, to },
            token,
        )

        expect(listResponse.status).toBe(200)
        expect(listResponse.body.data.transactions.length).toBeGreaterThan(0)
    })

    it('should forbid access to another user transaction', async () => {
        const registerMutation = `
            mutation Register($input: RegisterInput!) {
                register(input: $input) {
                    tokens { acessToken }
                }
            }
        `

        const userOne = await graphqlRequest(registerMutation, {
            input: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: faker.internet.email(),
                password: user.password,
            },
        })

        const userTwo = await graphqlRequest(registerMutation, {
            input: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: faker.internet.email(),
                password: user.password,
            },
        })

        const tokenOne =
            userOne.body.data.register.tokens.acessToken
        const tokenTwo =
            userTwo.body.data.register.tokens.acessToken

        const createMutation = `
            mutation CreateTransaction($input: CreateTransactionInput!) {
                createTransaction(input: $input) {
                    id
                }
            }
        `

        const created = await graphqlRequest(
            createMutation,
            {
                input: {
                    name: transaction.name,
                    date: new Date(from).toISOString(),
                    type: 'EXPENSE',
                    amount: 100,
                },
            },
            tokenOne,
        )

        const transactionId = created.body.data.createTransaction.id

        const query = `
            query Transaction($id: ID!) {
                transaction(id: $id) {
                    id
                }
            }
        `

        const response = await graphqlRequest(
            query,
            { id: transactionId },
            tokenTwo,
        )

        expect(response.status).toBe(200)
        expect(response.body.errors[0].extensions.code).toBe('FORBIDDEN')
    })

    it('should update and delete transaction via GraphQL mutations', async () => {
        const registerMutation = `
            mutation Register($input: RegisterInput!) {
                register(input: $input) {
                    tokens { acessToken }
                }
            }
        `

        const registerResponse = await graphqlRequest(registerMutation, {
            input: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: faker.internet.email(),
                password: user.password,
            },
        })

        const token =
            registerResponse.body.data.register.tokens.acessToken

        const createMutation = `
            mutation CreateTransaction($input: CreateTransactionInput!) {
                createTransaction(input: $input) {
                    id
                }
            }
        `

        const created = await graphqlRequest(
            createMutation,
            {
                input: {
                    name: transaction.name,
                    date: new Date(from).toISOString(),
                    type: 'EXPENSE',
                    amount: 500,
                },
            },
            token,
        )

        const transactionId = created.body.data.createTransaction.id

        const updateMutation = `
            mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
                updateTransaction(id: $id, input: $input) {
                    id
                    name
                    amount
                }
            }
        `

        const updateResponse = await graphqlRequest(
            updateMutation,
            {
                id: transactionId,
                input: {
                    name: 'Updated name',
                    amount: 1000,
                },
            },
            token,
        )

        expect(updateResponse.status).toBe(200)
        expect(updateResponse.body.data.updateTransaction.name).toBe(
            'Updated name',
        )

        const deleteMutation = `
            mutation DeleteTransaction($id: ID!) {
                deleteTransaction(id: $id) {
                    id
                }
            }
        `

        const deleteResponse = await graphqlRequest(
            deleteMutation,
            { id: transactionId },
            token,
        )

        expect(deleteResponse.status).toBe(200)
        expect(deleteResponse.body.data.deleteTransaction.id).toBe(
            transactionId,
        )
    })
})
