import { Router } from 'express'

import { makeCreateTransactionController } from '../factories/controllers/transaction.js'
import { auth } from '../middlewares/auth.js'

export const transactionsRouter = Router()

transactionsRouter.post('/me', auth, async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute({
        ...req,
        body: {
            ...req.body,
            user_id: req.userId,
        },
    })

    res.status(statusCode).send(body)
})

transactionsRouter.delete('/me/:transactionId', auth, async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } = await deleteTransactionController.execute({
        params: {
            transactionId: req.params.transactionId,
            user_id: req.userId,
        },
    })

    res.status(statusCode).send(body)
})
