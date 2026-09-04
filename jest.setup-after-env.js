import mongoose from 'mongoose'
import { connectDatabase } from './src/database/mongoose.js'
import { TransactionModel } from './src/models/Transaction.js'
import { UserModel } from './src/models/User.js'

beforeAll(async () => {
    await connectDatabase()
})

beforeEach(async () => {
    await TransactionModel.deleteMany({})
    await UserModel.deleteMany({})
})

afterAll(async () => {
    await mongoose.disconnect()
})
