const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    name:{type: String, required: true},
    image:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    phone:{type: String, required: true, unique: true},
    role: String, 
    address:{type: String, required: true},
    private_key: {type: String, required: true},
    public_key: {type: String, required: true},
    accountAddress: {type: String, required: true}
},{timestamps: true})

module.exports = mongoose.model('User', userSchema)