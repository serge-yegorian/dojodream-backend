import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, min: 4, unique: true},
    password: {type: String, required: true, min: 4}
})

export const UserModel = mongoose.model('User', UserSchema);

