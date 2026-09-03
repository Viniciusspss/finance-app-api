import mongoose from 'mongoose'
import { TransactionModel } from './src/models/Transaction.js'
import { UserModel } from './src/models/User.js'

beforeEach(async () => {
    await TransactionModel.deleteMany({})
    await UserModel.deleteMany({})
})

afterAll(async () => {
    await mongoose.disconnect()
})
