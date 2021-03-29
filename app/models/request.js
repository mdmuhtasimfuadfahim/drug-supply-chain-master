const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestSchema = new Schema({
    image:{type: String, required: true},
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    phone:{type: String, required: true, unique: true},
    role: String, 
    address:{type: String, required: true},
},{timestamps: true})

module.exports = mongoose.model('Request', requestSchema)