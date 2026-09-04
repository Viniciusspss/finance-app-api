import { faker } from '@faker-js/faker'
import { user } from '../../../tests/index.js'
import { MongooseDeleteUserRepository } from './delete-user.js'
import { UserModel } from '../../../models/User.js'
import { TransactionModel } from '../../../models/Transaction.js'
import { UserNotFoundError } from '../../../errors/user.js'

describe('Delete User Repository', () => {
    it('should delete user on db', async () => {
        await UserModel.create(user)
        const sut = new MongooseDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result.id).toBe(user.id)
    })

    it('should delete user transactions on cascade', async () => {
        const createdUser = await UserModel.create(user)
        await TransactionModel.create({
            id: faker.string.uuid(),
            user_id: createdUser.id,
            name: 'Test',
            date: new Date(),
            amount: '100',
            type: 'EXPENSE',
        })
        const sut = new MongooseDeleteUserRepository()

        await sut.execute(user.id)

        const transactions = await TransactionModel.find({
            user_id: createdUser.id,
        })
        expect(transactions).toHaveLength(0)
    })

    it('should call mongoose with correct params', async () => {
        await UserModel.create(user)
        const sut = new MongooseDeleteUserRepository()
        const mongooseSpy = import.meta.jest.spyOn(UserModel, 'deleteOne')

        await sut.execute(user.id)

        expect(mongooseSpy).toHaveBeenCalledWith({ _id: expect.anything() })
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        const sut = new MongooseDeleteUserRepository()

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow(UserNotFoundError)
    })
})
