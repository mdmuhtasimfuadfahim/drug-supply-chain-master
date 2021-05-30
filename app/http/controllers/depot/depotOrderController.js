const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const moment = require('moment')
const contract = require('../../../models/contract')
const PharmacistOrders = require('../../../models/phrorder')
const PharmacistOrdersTrd = require('../../../models/phrordertrd')
const Phrcomplete = require('../../../models/Phrcomplete')
const CompletedOrders = require('../../../models/Phrcomplete')

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

var abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "orderId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "buyer",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "seller",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fromAdd",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "toAdd",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"name": "logDrugInfo",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "productionId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "secretKey",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "darNumber",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"name": "logQRCodeInfo",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "buyer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productionId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_secretKey",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_darNumber",
				"type": "string"
			}
		],
		"name": "createQR",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOrderDAR",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOrderInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOrderStatusInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productionId",
				"type": "string"
			}
		],
		"name": "getQRInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_orderId",
				"type": "string"
			}
		],
		"name": "getStoreDrugs",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isBuyer_",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isSeller_",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "seller",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_orderId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_productionIdNums",
				"type": "string"
			}
		],
		"name": "setOrderDAR",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_orderId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_email",
				"type": "string"
			}
		],
		"name": "setOrderInfo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_orderId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "setOrderStatusInfo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_orderId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_buyer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_seller",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_fromAdd",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_toAdd",
				"type": "string"
			}
		],
		"name": "storeDrugs",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_orderId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_buyer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_seller",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_fromAdd",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_toAdd",
				"type": "string"
			}
		],
		"name": "storeDrugsAgain",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

var myAccountKey = process.env.privateKeyOf2;

function depotOrderController(){
    return{
        async showOrder(req, res){
			// const PharmaOrders = await PharmacistOrders.find().populate('senderId', '-private_key')
			// console.log(PharmaOrders)
            PharmacistOrders.find({status: { $ne: 'completed'}}, null, { sort: { 'createdAt': -1 } }).
            populate('pharmacistId', '-private_key').populate('senderId', '-private_key').exec((err, PharmacistOrders)=>{
                if(req.xhr){
					
                    res.json(PharmacistOrders)
                }

                else{
                   console.log(PharmacistOrders)
                    return  res.render('depot/pharmacistOrders', {orders: PharmacistOrders})
                }
               
            })
        },
        showStatus(req, res){
            PharmacistOrders.updateOne({_id: req.body.orderId}, {status: req.body.status}, async (err, data)=>{
                if(err){
                    return res.redirect('/api/drug/depot/orders')
                }

                if(req.body.status === 'completed'){
                   //-----------BlockChain Transaction----------
                const _toAdd = "0xd0120064047564b484a0c1d558dbf4b6385e714f";
                const Contract = await contract.find();
                web3.eth.getAccounts().then(async function(accounts){
                    Contract.forEach(async function(contractAdd){
                        const contractGetAddressHere = contractAdd.contractAddress;
                          
                        const _orderId = req.body.orderId;
                        const _status = req.body.status;
                           
                        const myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                        const myContractFunction = myContract.methods.setOrderStatusInfo(_orderId, _status).encodeABI();
              
                    const tx={
                        chainId: 23112,
                        data: myContractFunction,
                        value:web3.utils.toWei('0.1','ether'),
                        to: _toAdd,
                        gas:600000*1.50
                    }
                     web3.eth.accounts.signTransaction(tx, "0x"+ myAccountKey).then(signed =>{
                       web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt',async function(response){
                            // console.log(response)
                            const PhrCompleteData = new Phrcomplete({
                                 orderID: _orderId,
                                 blockHash: encrypt(response.blockHash),
                                 blockNumber: encrypt(response.blockNumber.toString()),
                                 contractAddress: response.contractAddress,
                                 cumulativeGasUsed: encrypt(response.cumulativeGasUsed.toString()),
                                 from: encrypt(response.from.toString()),
                                 gasUsed: encrypt(response.gasUsed.toString()),
                                 logsBloom: encrypt(response.logsBloom),
                                 status: encrypt(response.status.toString()),
                                 to:encrypt(response.to.toString()),
                                 transactionHash: encrypt(response.transactionHash),
                                 transactionIndex: encrypt(response.transactionIndex.toString()),
                                 type: encrypt(response.type.toString()),
                                 orderstatus: encrypt(_status)
                             })

                           const PhrCompleteDataSave = await PhrCompleteData.save();
                           console.log(PhrCompleteDataSave)
                       })                                
                    })	
                })  
               })
                }
                //-------Emit Event--------
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})
                return res.redirect('/api/drug/depot/orders')
            })
        },
        darControl(req, res){
            PharmacistOrders.updateOne({_id: req.body.darNum}, {dar: req.body.dar}, (err, data)=>{
                if(err){
                    //console.log(err)
                    return res.redirect('/api/drug/depot/orders')
                }
                return res.redirect('/api/drug/depot/orders')
            })
        },
        async completedOrder(req, res){
            const ordersCompleted = await PharmacistOrders.find({status: 'completed'}).sort({'createdAt': -1}).populate('pharmacistId', '-private_key').exec((err, orders)=>{
                if(req.xhr){
					
                    res.json(orders)

                }
                else{
                    return  res.render('depot/completed', {orders: orders})
                }
         
            })
        },
		async showBlockchainOrder(req, res){
			const order =  await PharmacistOrdersTrd.find().sort({'createdAt': -1}).populate('orderID', '-private_key').populate('pharmacistId', '-private_key')
			// console.log(blockOrder)
			const showorder = {order: order};
			const orders = []
			order.forEach(function(order){
			 orders.push({
				_id: order._id,
				orderID: order.orderID,
				pharmacistId: order.pharmacistId,
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
				orderstatus: decrypt(order.orderstatus),
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
				__v: order.__v
			})
 
		   
		})
		console.log(orders)  
		  res.render('depot/block/order', {orders: orders, moment: moment})
		},
		async completedOrderBlockchain(req, res){
			const order =  await CompletedOrders.find().sort({'createdAt': -1}).populate('orderID', '-private_key')
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
				orderstatus: decrypt(order.orderstatus),
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
				__v: order.__v
			})
 
		   
		})
		console.log(orders)  
		  res.render('depot/block/complete', {orders: orders, moment: moment})
		}
    }
}



module.exports = depotOrderController