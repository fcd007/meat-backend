import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import { validateCPF } from './../../Validators/cpfValidator';
import { environment } from '../../common/environment';

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
        enum: ['Male', 'Female', 'Other']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
})

const hasPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
        .then(hash =>{
            obj.password = hash
            next()
        }).catch(next)
}

const saveMiddleware =  function(next){
    const user = (this as User)
    
    if(!user.isModified('password')){
        next()
    }else{
        hasPassword(user, next)
    }
}

const updateMiddleware = function(next){
    
    if(!this.getUpdate().password){
        next()
    }else{
        hasPassword(this.getUpdate(), next)
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('update', updateMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)

export const User = mongoose.model<User>('User', userSchema)