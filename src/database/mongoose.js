import mongoose from 'mongoose'

export const connectDatabase = async () => {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined')
    }
    try {
        await mongoose.connect(uri)
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message)
        throw error
    }
}

export const disconnectDatabase = async () => {
    await mongoose.disconnect()
}
