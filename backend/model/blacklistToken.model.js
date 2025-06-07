import { Schema, model } from 'mongoose';
const blackListTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Token will be removed after 1 hour
    }
});


export default model('BlacklistToken', blackListTokenSchema);