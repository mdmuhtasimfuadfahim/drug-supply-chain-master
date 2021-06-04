
const ORDER = require('../../../models/ordertrd')
const COMPLETE_ORDER = require('../../../models/complete')
const TRANSACTION = require('../../../models/transaction')
const moment = require('moment')
var crypto = require('crypto'),
    algorithm = process.env.algorithm,
    password = process.env.ENCRYPT_DECRYPT_PASS;


function encrypt(text){
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


function newController(){
    return{
        showControl(req, res){
            res.render('depot/search/search')
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
            const decryptNumber = req.body.blockNumber
            console.log(decryptNumber)
            const blockNumber = encrypt(decryptNumber.toString())
            console.log(blockNumber)

            const findModel = await COMPLETE_ORDER.findOne({blockNumber})
            const data = []

            data.push({
                _id: findModel.orderID,
                blockNumber: decrypt(findModel.blockNumber),
                cumulativeGasUsed : decrypt(findModel.cumulativeGasUsed),
                from: decrypt(findModel.from),
                to: decrypt(findModel.to),
                blockHash: decrypt(findModel.blockHash),
				transactionHash:decrypt(findModel.transactionHash),
                orderst: decrypt(findModel.orderst),
                status : decrypt(findModel.status)
               
            })
            
            console.log(data)

            res.status(200).send(data)
        }

    }
}


module.exports = newController