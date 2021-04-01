const mongoose = require('mongoose')
const Schema = mongoose.Schema


const locationSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    drugs: {type: Object, required: true},
    role:{type:String, default:'Manufacturer'}
},{timestamps: true})

module.exports = mongoose.model('Location', locationSchema)