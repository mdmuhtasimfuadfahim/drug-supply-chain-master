const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Phrcomplete = new Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Phrorder',
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
    orderstatus: String
},{timestamps: true})

module.exports = mongoose.model('Phrcomplete', Phrcomplete)