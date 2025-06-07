import express from 'express';
import { Schema, model } from 'mongoose';
// const { emit } = require('../app');
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken'; // ✅ import full module
const { sign } = jwt;

const userSchema = new Schema({
    fullname:{
     firstname:  { type: String,
        required: true,
        minlength:[3 , 'Fullname must be at least 3 characters long']},
    
         lastname:{
        type: String,
      
        minlength:[3 , 'Lastname must be at least 3 characters long'],
    },
    },
   
    email:{
        type: String,
        required: true,
        unique: true,
     minlength:[5 , 'Email must be at least 5 characters long'],
    },
    password:{
        type: String,
        required: true,
        select: false,
       
    },
    socketId: {
        type: String,
        default: null
    },
})

userSchema.methods.genterateAuthToken = function() {
    const token = sign({ _id: this._id }, process.env.JWT_SECRET , {expiresIn: '24h'});
    return token;
}
userSchema.methods.comparePassword = async function(password) {
    return await compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await hash(password, 10);
}


const userModel = model('user', userSchema);
export default userModel;