import { faker } from '@faker-js/faker'
import { user } from '../../../tests/index.js'
import { MongooseUpdateUserRepository } from './update-user.js'
import { UserModel } from '../../../models/User.js'
import { UserNotFoundError } from '../../../errors/user.js'

describe('Update User Repository', () => {
    it('should update user on db', async () => {
        await UserModel.create(user)
        const sut = new MongooseUpdateUserRepository()
        const updateParams = {
            first_name: faker.person.firstName(),
        }

        const result = await sut.execute(user.id, updateParams)

        expect(result.first_name).toBe(updateParams.first_name)
    })

    it('should call mongoose with correct params', async () => {
        await UserModel.create(user)
        const sut = new MongooseUpdateUserRepository()
        const mongooseSpy = import.meta.jest.spyOn(
            UserModel,
            'findOneAndUpdate',
        )
        const updateParams = { first_name: faker.person.firstName() }

        await sut.execute(user.id, updateParams)

        expect(mongooseSpy).toHaveBeenCalledWith(
            { id: user.id },
            { $set: updateParams },
            { new: true },
        )
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseUpdateUserRepository()
        import.meta.jest
            .spyOn(UserModel, 'findOneAndUpdate')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id, { first_name: 'Test' })

        await expect(promise).rejects.toThrow()
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        const sut = new MongooseUpdateUserRepository()

        const promise = sut.execute(faker.string.uuid(), {
            first_name: 'Test',
        })

        await expect(promise).rejects.toThrow(UserNotFoundError)
    })
})
