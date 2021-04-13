const mongoose = require('mongoose')
const Schema = mongoose.Schema


const transactionSchema = new Schema({
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
    type: String
},{timestamps: true})

module.exports = mongoose.model('Transaction', transactionSchema)