const mongoose = require('mongoose')
const Schema = mongoose.Schema


const qrCodeTransactionScheme = new Schema({
    QRCodeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Phrorder',
        required: true
    },
    blockHash: String,
    blockNumber: String,
    cumulativeGasUsed: String,
    from: String,
    gasUsed: String,
    logsBloom: String,
    status: String,
    transactionHash:String,
    transactionIndex:String,
    type: String,
},{timestamps: true})

module.exports = mongoose.model('QRCodeTransaction', qrCodeTransactionScheme)