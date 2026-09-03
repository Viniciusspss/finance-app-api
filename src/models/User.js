import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        first_name: {
            type: String,
            required: true,
            maxlength: 50,
        },
        last_name: {
            type: String,
            required: true,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxlength: 100,
        },
        password: {
            type: String,
            required: true,
            maxlength: 100,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
)

export const UserModel = mongoose.model('User', userSchema)
