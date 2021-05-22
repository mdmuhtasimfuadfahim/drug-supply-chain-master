const mongoose = require('mongoose')
const Schema = mongoose.Schema


const qrCodeSchema = new Schema({
    proId: {type: String, required: true},
    dar: {type: String, required: true},
    secret_key:{type: String, required: true, unique: true}
},{timestamps: true})


module.exports = mongoose.model('QRCODE', qrCodeSchema)