import { faker } from '@faker-js/faker'
import { transaction, user } from '../../../tests/index.js'
import { MongooseDeleteTransactionRepository } from './delete-transaction.js'
import { UserModel } from '../../../models/User.js'
import { TransactionModel } from '../../../models/Transaction.js'
import { TransactionNotFoundError } from '../../../errors/index.js'

describe('Delete Transaction Repository', () => {
    it('should delete transaction on db', async () => {
        await UserModel.create(user)
        await TransactionModel.create(transaction)
        const sut = new MongooseDeleteTransactionRepository()

        const result = await sut.execute(transaction.id)

        expect(result.id).toBe(transaction.id)
    })

    it('should call mongoose with correct params', async () => {
        await UserModel.create(user)
        await TransactionModel.create(transaction)
        const sut = new MongooseDeleteTransactionRepository()
        const mongooseSpy = import.meta.jest.spyOn(
            TransactionModel,
            'findOneAndDelete',
        )

        await sut.execute(transaction.id)

        expect(mongooseSpy).toHaveBeenCalledWith({ id: transaction.id })
    })

    it('should throw generic error if mongoose throws generic error', async () => {
        const sut = new MongooseDeleteTransactionRepository()
        import.meta.jest
            .spyOn(TransactionModel, 'findOneAndDelete')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if transaction is not found', async () => {
        const sut = new MongooseDeleteTransactionRepository()

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow(TransactionNotFoundError)
    })
})
