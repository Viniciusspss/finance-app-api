import express from 'express'

import { usersRouter } from './routes/index.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

export { app }
