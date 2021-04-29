const mongoose = require('mongoose')
const Schema = mongoose.Schema


const orderSchema = new Schema({
    depotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    drugs: {type: Object, required: true},
    email:{type: String, required: true},
    private_key: {type: String, required: true},
    address: {type: String, required: true},
    paymentType: {type: String, default: 'COD'},
    status:{type:String, default:'order_placed'},
    dar:{type: String, default: 'Not Selected'},
    role:{type:String, default:'Manufacturer'}
},{timestamps: true})

module.exports = mongoose.model('Order', orderSchema)