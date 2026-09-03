import { Router } from 'express'

import {
    makeCreateUserController,
    makeLoginUserController,
    makeRefreshTokenController,
} from '../factories/controllers/user.js'

export const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

usersRouter.post('/auth/login', async (req, res) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(req)

    res.status(statusCode).send(body)
})

usersRouter.post('/auth/refresh-token', async (req, res) => {
    const refreshTokenController = makeRefreshTokenController()

    const { statusCode, body } = await refreshTokenController.execute(req)

    res.status(statusCode).send(body)
})
