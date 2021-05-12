const order = require('../../../models/order')
const moment = require('moment')
const axios = require('axios')
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
			   depotId: order.depotId,
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
        },
		orderDrugFind(req, res){
			if(req.query.id){
                const id = req.query.id
                order.findById(id).then(order =>{
                    if(!order){
                        res.status(404).send({ message: `Not Found Any Drugs with this ${id}`})
                    }else{
                        res.send(order)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving Drugs with this ${id}`})
                })
            }
            else{
                order.find().then(order =>{
                    res.send(order)
                    console.log(order)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Retriving Information from DurgStorage' })
                })
            }
	    },
		updateOrderProduction(req, res){
			axios.get(`${process.env.APP_BASE_URL}/manufacturer/orders/find`, { params : { id : req.query.id }}).then(function(orderDrugData){
                //console.log(drugStoreData.data)
                res.render('manufacturer/upateOrder', { order : orderDrugData.data})
               }).catch(err =>{
                   res.send(err)
               })
		},
		orderDrugUpdate(req, res){
			if(!req.body){
                return res.status(400).send({ message: 'Data to Update can not be Empty'})
            }

            const id = req.params.id
            order.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(order =>{
                if(!order){
                    res.status(404).send({ message: `Cannot Update Order with ${id}. Maybe Order Info not Found`})
                }else{
                    res.send(order)
                }
            }).catch(err =>{
                res.status(500).send({ message: 'Error in Updating Order Info'})
            })
		}
    }
}


module.exports = manufacturerOrderController