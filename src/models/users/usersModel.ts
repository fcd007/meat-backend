import * as mongoose from 'mongoose';

export interface User extends mongoose.Document{
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 128
    },
    email: {
        type: String,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        required: true,
        minlength: 5,
        maxlength: 128
    },
    password: {
        type: String,
        select: false,
        required: true,
        minlength: 8,
        maxlength: 256
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Famale', 'Other']
    },

})

export const User = mongoose.model<User>('User', userSchema)