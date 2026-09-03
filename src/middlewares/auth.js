import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const authorization = req.headers?.authorization
        const acessToken = authorization?.startsWith('Bearer ')
            ? authorization.slice(7)
            : null
        if (!acessToken) {
            return res.status(401).send({ message: 'Unauthorized' })
        }
        const decodedToken = jwt.verify(
            acessToken,
            process.env.JWT_ACESS_TOKEN_SECRET,
        )

        if (!decodedToken) {
            return res.status(401).send({ message: 'Unauthorized' })
        }
        req.userId = decodedToken.userId
        next()
    } catch {
        return res.status(401).send({ message: 'Unauthorized' })
    }
}
