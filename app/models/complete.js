const mongoose = require('mongoose')
const Schema = mongoose.Schema


const completeSchema = new Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
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
    orderst: String
},{timestamps: true})

module.exports = mongoose.model('Complete', completeSchema)