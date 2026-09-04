import jwt from 'jsonwebtoken'

export const createGraphQLContext = async ({ req }) => {
    const authorization = req.headers?.authorization
    const token = authorization?.split('Bearer ')[1]

    if (!token) {
        return { userId: null }
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_ACESS_TOKEN_SECRET,
        )

        return {
            userId: decodedToken.userId ?? null,
        }
    } catch {
        return { userId: null }
    }
}
