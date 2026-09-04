import { faker } from '@faker-js/faker'
import { user as fakeUser } from '../../../tests/index.js'
import { MongooseGetUserBalanceRepository } from './get-user-balance.js'
import { UserModel } from '../../../models/User.js'
import { TransactionModel } from '../../../models/Transaction.js'

describe('Get User Balance Repository', () => {
    const from = '2025-01-01'
    const to = '2025-01-31'

    it('should get user balance on db', async () => {
        await UserModel.create(fakeUser)

        await TransactionModel.create([
            {
                id: faker.string.uuid(),
                name: faker.string.sample(),
                user_id: fakeUser.id,
                date: new Date(from),
                amount: '10000',
                type: 'EARNING',
            },
            {
                id: faker.string.uuid(),
                name: faker.string.sample(),
                user_id: fakeUser.id,
                date: new Date(to),
                amount: '2000',
                type: 'EXPENSE',
            },
            {
                id: faker.string.uuid(),
                name: faker.string.sample(),
                date: new Date(to),
                user_id: fakeUser.id,
                amount: '2000',
                type: 'INVESTMENT',
            },
        ])

        const sut = new MongooseGetUserBalanceRepository()
        const result = await sut.execute(fakeUser.id, from, to)

        expect(result.earnings).toBe('10000')
        expect(result.expenses).toBe('2000')
        expect(result.investments).toBe('2000')
        expect(result.balance).toBe('6000')
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseGetUserBalanceRepository()
        import.meta.jest
            .spyOn(TransactionModel, 'find')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser.id, from, to)

        await expect(promise).rejects.toThrow()
    })
})
