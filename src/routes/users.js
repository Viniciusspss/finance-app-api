import { Router } from 'express'

import {
    makeCreateUserController,
    makeLoginUserController,
    makeRefreshTokenController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'

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

usersRouter.get('/me', auth, async (req, res) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    })

    res.status(statusCode).send(body)
})

usersRouter.delete('/me', auth, async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    })

    res.status(statusCode).send(body)
})

usersRouter.patch('/me', auth, async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    })

    res.status(statusCode).send(body)
})
