import { transaction, user } from '../../../tests/index.js'
import { MongooseGetTransactionsByUserIdRepository } from './get-transactions-by-user-id.js'
import { UserModel } from '../../../models/User.js'
import { TransactionModel } from '../../../models/Transaction.js'

describe('Get Transactions By User Id Repository', () => {
    const from = '2025-05-19'
    const to = '2025-05-30'

    it('should get transactions by user id on db', async () => {
        await UserModel.create(user)
        await TransactionModel.create({
            ...transaction,
            user_id: user.id,
            date: new Date(from),
        })
        const sut = new MongooseGetTransactionsByUserIdRepository()

        const result = await sut.execute(user.id, from, to)

        expect(result).toHaveLength(1)
        expect(result[0].user_id).toBe(user.id)
    })

    it('should call mongoose with correct params', async () => {
        const sut = new MongooseGetTransactionsByUserIdRepository()
        const mongooseSpy = import.meta.jest.spyOn(TransactionModel, 'find')

        await sut.execute(user.id, from, to)

        expect(mongooseSpy).toHaveBeenCalledWith({
            user_id: user.id,
            date: {
                $gte: new Date(from),
                $lte: new Date(to),
            },
        })
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseGetTransactionsByUserIdRepository()
        import.meta.jest
            .spyOn(TransactionModel, 'find')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id, from, to)

        await expect(promise).rejects.toThrow()
    })
})
