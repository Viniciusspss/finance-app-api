import { user } from '../../../tests/index.js'
import { MongooseGetUserByIdRepository } from './get-user-by-id.js'
import { UserModel } from '../../../models/User.js'

describe('Get User By Id Repository', () => {
    it('should get user by id on db', async () => {
        await UserModel.create(user)
        const sut = new MongooseGetUserByIdRepository()

        const result = await sut.execute(user.id)

        expect(result.id).toBe(user.id)
    })

    it('should call mongoose with correct params', async () => {
        const sut = new MongooseGetUserByIdRepository()
        const mongooseSpy = import.meta.jest.spyOn(UserModel, 'findOne')

        await sut.execute(user.id)

        expect(mongooseSpy).toHaveBeenCalledWith({ id: user.id })
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseGetUserByIdRepository()
        import.meta.jest
            .spyOn(UserModel, 'findOne')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow()
    })
})
