const mongoose = require('mongoose')
const Schema = mongoose.Schema


const phrorderSchema = new Schema({
    pharmacistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    drugs: {type: Object, required: true},
    address: {type: String, required: true},
    paymentType: {type: String, default: 'COD'},
    status:{type:String, default:'order_placed'},
    dar:{type: String, default: 'Not Selected'},
    role:{type:String, default:'Depot In-charge'}
},{timestamps: true})

module.exports = mongoose.model('Phrorder', phrorderSchema)