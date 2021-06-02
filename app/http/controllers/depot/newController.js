
const ORDER = require('../../../models/ordertrd')
const COMPLETE_ORDER = require('../../../models/complete')
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
        async newControl(req, res){
            const decryptNumber = req.body.blockNumber
            console.log(decryptNumber)
            const blockNumber = encrypt(decryptNumber.toString())
            console.log(blockNumber)

            const findModel = await ORDER.findOne({blockNumber})
            const data = []

            data.push({
                _id: findModel.orderID,
                status : decrypt(findModel.status),
                cumulativeGasUsed : decrypt(findModel.cumulativeGasUsed),
                from: decrypt(findModel.from),
                to: decrypt(findModel.to),
                blockHash: decrypt(findModel.blockHash),
				transactionHash:decrypt(findModel.transactionHash),
                email: decrypt(findModel.email),
                orderst: decrypt(findModel.orderst),
                blockNumber: decrypt(findModel.blockNumber)
            })
            
            console.log(data)

            res.status(200).send(data)

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
                status : decrypt(findModel.status),
                cumulativeGasUsed : decrypt(findModel.cumulativeGasUsed),
                from: decrypt(findModel.from),
                to: decrypt(findModel.to),
                blockHash: decrypt(findModel.blockHash),
				transactionHash:decrypt(findModel.transactionHash),
                orderst: decrypt(findModel.orderst),
                blockNumber: decrypt(findModel.blockNumber)
            })
            
            console.log(data)

            res.status(200).send(data)
        }

    }
}


module.exports = newController