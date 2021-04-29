const mongoose = require('mongoose')
const Schema = mongoose.Schema


const phrtransactionSchema = new Schema({
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
    cumulativeGasUsed: String,
    contractAddress: String,
    from: String,
    gasUsed: String,
    logsBloom: String,
    status: String,
    to:String,
    transactionHash:String,
    transactionIndex:String,
    type: String,
    transaction: String
},{timestamps: true})

module.exports = mongoose.model('Phrtransaction', phrtransactionSchema)