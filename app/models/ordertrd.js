const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ordertrdSchema = new Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    depotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blockHash: String,
    blockNumber: String,
    contractAddress: String,
    cumulativeGasUsed: String,
    from: String,
    gasUsed: String,
    logsBloom: String,
    status: String,
    to:String,
    transactionHash:String,
    transactionIndex:String,
    type: String,
    email: String,
    orderst: String
},{timestamps: true})

module.exports = mongoose.model('Ordertrd', ordertrdSchema)