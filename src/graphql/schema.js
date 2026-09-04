export const typeDefs = `#graphql
    enum TransactionType {
        EARNING
        EXPENSE
        INVESTMENT
    }

    type User {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
    }

    type Tokens {
        acessToken: String!
        refreshToken: String!
    }

    type UserWithTokens {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        tokens: Tokens!
    }

    type AuthPayload {
        acessToken: String!
        refreshToken: String!
    }

    type Transaction {
        id: ID!
        user_id: ID!
        name: String!
        date: String!
        amount: String!
        type: TransactionType!
    }

    type Balance {
        earnings: String!
        expenses: String!
        investments: String!
        earningPercentage: String!
        expensePercentage: String!
        investmentPercentage: String!
        balance: String!
    }

    input RegisterInput {
        first_name: String!
        last_name: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input RefreshTokenInput {
        refreshToken: String!
    }

    input UpdateUserInput {
        first_name: String
        last_name: String
        email: String
        password: String
    }

    input CreateTransactionInput {
        name: String!
        date: String!
        type: TransactionType!
        amount: Float!
    }

    input UpdateTransactionInput {
        name: String
        date: String
        type: TransactionType
        amount: Float
    }

    type Query {
        me: User
        balance(from: String!, to: String!): Balance
        transactions(from: String!, to: String!): [Transaction!]!
        transaction(id: ID!): Transaction
    }

    type Mutation {
        register(input: RegisterInput!): UserWithTokens!
        login(input: LoginInput!): UserWithTokens!
        refreshToken(input: RefreshTokenInput!): AuthPayload!
        updateUser(input: UpdateUserInput!): User!
        deleteUser: User!
        createTransaction(input: CreateTransactionInput!): Transaction!
        updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
        deleteTransaction(id: ID!): Transaction!
    }
`
