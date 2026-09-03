import { user } from '../../../tests/index.js'
import { MongooseCreateUserRepository } from './create-user.js'
import { UserModel } from '../../../models/User.js'

describe('Create User Repository', () => {
    it('should create a user on db', async () => {
        const sut = new MongooseCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    it('should call mongoose with correct params', async () => {
        const sut = new MongooseCreateUserRepository()
        const mongooseSpy = import.meta.jest.spyOn(UserModel, 'create')

        await sut.execute(user)

        expect(mongooseSpy).toHaveBeenCalledWith({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        })
    })

    it('should throw if mongoose throws', async () => {
        const sut = new MongooseCreateUserRepository()
        import.meta.jest
            .spyOn(UserModel, 'create')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})
