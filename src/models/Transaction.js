import mongoose from 'mongoose'

const TRANSACTION_TYPES = ['EARNING', 'EXPENSE', 'INVESTMENT']

const transactionSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        user_id: {
            type: String,
            required: true,
            index: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
            maxlength: 50,
        },
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: TRANSACTION_TYPES,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
)

export const TransactionModel = mongoose.model('Transaction', transactionSchema)
