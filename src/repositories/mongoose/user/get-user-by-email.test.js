import { user } from '../../../tests/index.js'
import { MongooseGetUserByEmailRepository } from './get-user-by-email.js'
import { UserModel } from '../../../models/User.js'

describe('Get User By Email Repository', () => {
    it('should get user by email on db', async () => {
        await UserModel.create(user)
        const sut = new MongooseGetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result.email).toBe(user.email)
    })

    it('should call mongoose with correct params', async () => {
        const sut = new MongooseGetUserByEmailRepository()
        const mongooseSpy = import.meta.jest.spyOn(UserModel, 'findOne')

        await sut.execute(user.email)

        expect(mongooseSpy).toHaveBeenCalledWith({ email: user.email })
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseGetUserByEmailRepository()
        import.meta.jest
            .spyOn(UserModel, 'findOne')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.email)

        await expect(promise).rejects.toThrow()
    })
})
