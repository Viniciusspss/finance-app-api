import { transaction, user } from '../../../tests/index.js'
import { MongooseCreateTransactionRepository } from './create-transaction.js'
import { UserModel } from '../../../models/User.js'
import { TransactionModel } from '../../../models/Transaction.js'
import { formatAmount } from '../../../utils/decimal.js'

describe('Create Transaction Repository', () => {
    it('should create a transaction on db', async () => {
        await UserModel.create(user)
        const sut = new MongooseCreateTransactionRepository()

        const result = await sut.execute(transaction)

        expect(result.id).toBe(transaction.id)
        expect(result.user_id).toBe(transaction.user_id)
    })

    it('should call mongoose with correct params', async () => {
        const sut = new MongooseCreateTransactionRepository()
        const mongooseSpy = import.meta.jest.spyOn(TransactionModel, 'create')

        await sut.execute(transaction)

        expect(mongooseSpy).toHaveBeenCalledWith({
            id: transaction.id,
            user_id: transaction.user_id,
            name: transaction.name,
            date: new Date(transaction.date),
            amount: formatAmount(transaction.amount),
            type: transaction.type,
        })
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseCreateTransactionRepository()
        import.meta.jest
            .spyOn(TransactionModel, 'create')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow()
    })
})
