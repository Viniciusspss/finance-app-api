import { Router } from 'express'

import { makeCreateUserController } from '../factories/controllers/user.js'

export const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})
