const order = require('../../../models/order')
const moment = require('moment')
const Ordertrd = require('../../../models/ordertrd')
const CompletedOrders = require('../../../models/complete')

var crypto = require('crypto'),
    algorithm = process.env.algorithm,
    password = process.env.ENCRYPT_DECRYPT_PASS;


function decrypt(text){
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

function manufacturerOrderController(){
    return{
        index(req, res){
            order.find({status: { $ne: 'completed'}}, null, { sort: { 'createdAt': -1 } }).
            populate('depotId', '-private_key').exec((err, orders)=>{
                if(req.xhr){
                    res.json(orders)
                }
                else{
                    return  res.render('manufacturer/orders')
                }
               
            })  
        },
        async showBlockchainOrder(req, res){
            const order =  await Ordertrd.find().populate('orderID', '-private_key').populate('depotId', '-private_key')
           // console.log(blockOrder)
           const showorder = {order: order};
		   const orders = []
		   order.forEach(function(order){
			orders.push({
			   _id: order._id,
			   orderID: order.orderID,
			   blockHash: decrypt(order.blockHash),
			   blockNumber: decrypt(order.blockNumber),
			   contractAddress: order.contractAddress,
			   cumulativeGasUsed: decrypt(order.cumulativeGasUsed),
			   from: decrypt(order.from),
			   gasUsed: decrypt(order.gasUsed),
			   logsBloom: decrypt(order.logsBloom),
			   status:decrypt(order.status),
			   to:decrypt(order.to),
			   transactionHash:decrypt(order.transactionHash),
			   transactionIndex:decrypt(order.transactionIndex),
			   type:decrypt(order.type),
			   email: decrypt(order.email),
               orderst: decrypt(order.orderst),
			   createdAt: order.createdAt,
			   updatedAt: order.updatedAt,
			   __v: order.__v
		   })

		  
	   })
	   console.log(orders)  
         res.render('manufacturer/block/order', {orders: orders, moment: moment})

        },
        async showCompleted(req, res){
            const ordersCompleted = await order.find({status: 'completed'}).populate('depotId', '-private_key').exec((err, orders)=>{
                if(req.xhr){
                    res.json(orders)
                }
                else{
                    return  res.render('manufacturer/completed')
                }
         //   res.render('manufacturer/completed', {ordersCompleted: ordersCompleted, moment: moment})
            })
        },
        async showBlockChainCompleted(req, res){
            const order =  await CompletedOrders.find().populate('orderID', '-private_key')
           // console.log(blockOrder)
           const showorder = {order: order};
		   const orders = []
		   order.forEach(function(order){
			orders.push({
			   _id: order._id,
			   orderID: order.orderID,
			   blockHash: decrypt(order.blockHash),
			   blockNumber: decrypt(order.blockNumber),
			   contractAddress: order.contractAddress,
			   cumulativeGasUsed: decrypt(order.cumulativeGasUsed),
			   from: decrypt(order.from),
			   gasUsed: decrypt(order.gasUsed),
			   logsBloom: decrypt(order.logsBloom),
			   status:decrypt(order.status),
			   to:decrypt(order.to),
			   transactionHash:decrypt(order.transactionHash),
			   transactionIndex:decrypt(order.transactionIndex),
			   type:decrypt(order.type),
               orderst: decrypt(order.orderst),
			   createdAt: order.createdAt,
			   updatedAt: order.updatedAt,
			   __v: order.__v
		   })

		  
	   })
	   console.log(orders)  
         res.render('manufacturer/block/complete', {orders: orders, moment: moment})
        }
    }
}


module.exports = manufacturerOrderController