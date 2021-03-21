const mongoose = require('mongoose')
const Schema = mongoose.Schema


const drugSchema = new Schema({
    image:{type: String, required: true},
    categoryName:{type: String, required: true},
    drugName:{type: String, required: true},
    productionDate: {type: String, required: true},
    expirationDate:{type: String, required: true},
    comment:{type: Number, required: true},
    price:{type: Number, required: true},
    genericName:{type: String, required: true},
    brandName:{type: String, required: true},
    description:{type: String, required: true}

})

module.exports = mongoose.model('Drug', drugSchema)
