import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers/index.js'
import { createGraphQLContext } from './context.js'

export const createApolloServer = async (app) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    })

    await server.start()

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: createGraphQLContext,
        }),
    )
}
