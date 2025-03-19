import mongoose from 'mongoose'

export function connect(){
    return mongoose.connect(process.env.MONGODB_URL)
}