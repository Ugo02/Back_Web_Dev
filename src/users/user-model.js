import mongoose from 'mongoose';
import { compareHash } from '../utils/crypto.js';

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required :true,
        trim : true,
        unique : true,
    },
    email : {
        type : String,
        required :true,
        trim : true,
        unique : true,
    },
    password : {
        type : String,
        required:true,
        trim : true,
    }
},{
    timestamp:true
})

userSchema.set('toJSON', {
    transform (doc, ret){
        delete ret.password
        return ret
    }
})

userSchema.methods.comparePassword = function(candidatePassword) {
    return compareHash(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema)