import { faker } from '@faker-js/faker'
import { transaction, user } from '../../../tests/index.js'
import { MongooseUpdateTransactionRepository } from './update-transaction.js'
import { UserModel } from '../../../models/User.js'
import { TransactionModel } from '../../../models/Transaction.js'
import { TransactionNotFoundError } from '../../../errors/index.js'

describe('Update Transaction Repository', () => {
    it('should update transaction on db', async () => {
        await UserModel.create(user)
        await TransactionModel.create(transaction)
        const sut = new MongooseUpdateTransactionRepository()
        const updateParams = { name: faker.commerce.productName() }

        const result = await sut.execute(transaction.id, updateParams)

        expect(result.name).toBe(updateParams.name)
    })

    it('should call mongoose with correct params', async () => {
        await UserModel.create(user)
        await TransactionModel.create(transaction)
        const sut = new MongooseUpdateTransactionRepository()
        const mongooseSpy = import.meta.jest.spyOn(
            TransactionModel,
            'findOneAndUpdate',
        )
        const updateParams = { name: faker.commerce.productName() }

        await sut.execute(transaction.id, updateParams)

        expect(mongooseSpy).toHaveBeenCalledWith(
            { id: transaction.id },
            { $set: updateParams },
            { new: true },
        )
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseUpdateTransactionRepository()
        import.meta.jest
            .spyOn(TransactionModel, 'findOneAndUpdate')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, { name: 'Test' })

        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if transaction is not found', async () => {
        const sut = new MongooseUpdateTransactionRepository()

        const promise = sut.execute(faker.string.uuid(), { name: 'Test' })

        await expect(promise).rejects.toThrow(TransactionNotFoundError)
    })
})
