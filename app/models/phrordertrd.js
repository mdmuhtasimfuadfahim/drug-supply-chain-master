const mongoose = require('mongoose')
const Schema = mongoose.Schema


const phrordertrdSchema = new Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Phrorder',
        required: true
    },
    pharmacistId: {
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
    orderstatus: String
},{timestamps: true})

module.exports = mongoose.model('Phrordertrd', phrordertrdSchema)