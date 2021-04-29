const mongoose = require('mongoose')
const Schema = mongoose.Schema


const storageSchema = new Schema({
    drugId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true
    },
    productionID:{type: String, required: true},
    batchNum: {type: String, required: true},
    darNum: {type: String, required: true},
    production: {type: String, required: true}
},{timestamps: true})

module.exports = mongoose.model('Storage', storageSchema)