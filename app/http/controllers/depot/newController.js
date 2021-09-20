const ORDER = require('../../../models/ordertrd')
const COMPLETE_ORDER = require('../../../models/complete')
const TRANSACTION = require('../../../models/transaction')
const ORDER_PHR = require('../../../models/phrordertrd')
const COMPLETE_ORDER_PHR = require('../../../models/Phrcomplete')
const TRANSACTION_PHR = require('../../../models/phrtransaction')
const moment = require('moment')
const decryption = require('../../../config/encrptDecrypt')
var decrypt = decryption.decryption


function newController(){
    return{
        showControl(req, res){
            res.render('depot/search/search')
        },
        showControl2(req, res){
            res.render('depot/search/search2')
        },
        async newControl(req, res){
            const orderID = req.body.orderID
    
            //-----------------Order Database-------------
            const findModel = await ORDER.findOne({orderID}).populate('orderID', '-private_key')
            const data = []
            data.push({
                _id: findModel._id,
                orderID: findModel.orderID,
                blockNumber: decrypt(findModel.blockNumber),
                cumulativeGasUsed : decrypt(findModel.cumulativeGasUsed),
                from: decrypt(findModel.from),
                to: decrypt(findModel.to),
                blockHash: decrypt(findModel.blockHash),
				transactionHash:decrypt(findModel.transactionHash),
                email: decrypt(findModel.email),
                orderst: decrypt(findModel.orderst),
                status : decrypt(findModel.status),
                createdAt: findModel.createdAt,
                updatedAt: findModel.updatedAt
                
            })
            
            //---------------Completed Order Database------------
            const findModel2 = await COMPLETE_ORDER.findOne({orderID}).populate('orderID', '-private_key')
            const data2 = []
            data2.push({
                _id: findModel2._id,
                orderID: findModel2.orderID,
                blockNumber: decrypt(findModel2.blockNumber),
                cumulativeGasUsed : decrypt(findModel2.cumulativeGasUsed),
                from: decrypt(findModel2.from),
                to: decrypt(findModel2.to),
                blockHash: decrypt(findModel2.blockHash),
				transactionHash:decrypt(findModel2.transactionHash),
                orderst: decrypt(findModel2.orderst),
                status : decrypt(findModel2.status),
                createdAt: findModel2.createdAt,
                updatedAt: findModel2.updatedAt
               
            })
            
            //----------------Transaction Database---------------
            const findModel3 = await TRANSACTION.findOne({orderID}).populate('orderID', '-private_key')
            const data3 = []
            data3.push({
                _id: findModel3._id,
                orderID: findModel3.orderID,
                blockNumber: decrypt(findModel3.blockNumber),
                cumulativeGasUsed : decrypt(findModel3.cumulativeGasUsed),
                from: decrypt(findModel3.from),
                to: decrypt(findModel3.to),
                blockHash: decrypt(findModel3.blockHash),
				transactionHash:decrypt(findModel3.transactionHash),
                transaction: findModel3.transaction,
                status : decrypt(findModel3.status),
                createdAt: findModel3.createdAt,
                updatedAt: findModel3.updatedAt
               
            })
            console.log(data, + '\n' + data2 + '\n' + data3)
            res.render('depot/search/result', {data: data, data2: data2, data3: data3, moment: moment})

        },
        async newControl2(req, res){
            const orderID = req.body.orderID
            //-----------------Order Database-------------
            const findModel = await ORDER_PHR.findOne({orderID}).populate('orderID', '-private_key')
            const data = []
            data.push({
                _id: findModel._id,
                orderID: findModel.orderID,
                blockNumber: decrypt(findModel.blockNumber),
                cumulativeGasUsed : decrypt(findModel.cumulativeGasUsed),
                from: decrypt(findModel.from),
                to: decrypt(findModel.to),
                blockHash: decrypt(findModel.blockHash),
				transactionHash:decrypt(findModel.transactionHash),
                email: decrypt(findModel.email),
                orderstatus: decrypt(findModel.orderstatus),
                status : decrypt(findModel.status),
                createdAt: findModel.createdAt,
                updatedAt: findModel.updatedAt    
            })
            
            //---------------Completed Order Database------------
            const findModel2 = await COMPLETE_ORDER_PHR.findOne({orderID}).populate('orderID', '-private_key')
            const data2 = []
            data2.push({
                _id: findModel2._id,
                orderID: findModel2.orderID,
                blockNumber: decrypt(findModel2.blockNumber),
                cumulativeGasUsed : decrypt(findModel2.cumulativeGasUsed),
                from: decrypt(findModel2.from),
                to: decrypt(findModel2.to),
                blockHash: decrypt(findModel2.blockHash),
				transactionHash:decrypt(findModel2.transactionHash),
                orderstatus: decrypt(findModel2.orderstatus),
                status : decrypt(findModel2.status),
                createdAt: findModel2.createdAt,
                updatedAt: findModel2.updatedAt
               
            })
            
            //----------------Transaction Database---------------
            const findModel3 = await TRANSACTION_PHR.findOne({orderID}).populate('orderID', '-private_key')
            const data3 = []
            data3.push({
                _id: findModel3._id,
                orderID: findModel3.orderID,
                blockNumber: decrypt(findModel3.blockNumber),
                cumulativeGasUsed : decrypt(findModel3.cumulativeGasUsed),
                from: decrypt(findModel3.from),
                to: decrypt(findModel3.to),
                blockHash: decrypt(findModel3.blockHash),
				transactionHash:decrypt(findModel3.transactionHash),
                transaction: findModel3.transaction,
                status : decrypt(findModel3.status),
                createdAt: findModel3.createdAt,
                updatedAt: findModel3.updatedAt
               
            })
            console.log(data, + '\n' + data2 + '\n' + data3)
            res.render('depot/search/result2', {data: data, data2: data2, data3: data3, moment: moment})

            // res.status(200).send({data: data, data2: data2, data3: data3, moment: moment})
        }

    }
}


module.exports = newController