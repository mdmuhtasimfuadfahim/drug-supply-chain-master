const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const abiDecoder = require('abi-decoder')
const order = require('../../../models/phrorder')
const contract = require('../../../models/contract')

const transactionDb = require('../../../models/phrtransaction')
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3fequee92hd';


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
		"constant": true,
		"inputs": [],
		"name": "seller",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_orderId",
				"type": "string"
			}
		],
		"name": "getStoreDrugs",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "depotId",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isSeller_",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_orderId",
				"type": "string"
			},
			{
				"name": "_depotId",
				"type": "string"
			},
			{
				"name": "_seller",
				"type": "string"
			},
			{
				"name": "_fromAdd",
				"type": "string"
			},
			{
				"name": "_toAdd",
				"type": "string"
			}
		],
		"name": "storeDrugs",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isDepotId_",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "orderId",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "depotId",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "seller",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "fromAdd",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "toAdd",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "role",
				"type": "string"
			}
		],
		"name": "logDrugInfo",
		"type": "event"
	}
];

var myAccountKey = "bb46b4d971ef39c128d3aec1a264aeadc625032290e731f5946ace20d9525417";

function locationPharmacist(){
    return{
        locationControlPharma(req, res){
            const updatedOrder = order.updateOne({_id: req.body.orderLID}, {role: req.body.role}, async (err, data)=>{
				             
                const populateOrder = await updatedOrder.find({_id: req.body.orderLID}).populate('pharmacistId', '-private-key').populate('senderId', '-private_key');
                const retunPopulateOrder = {populateOrder : populateOrder}
                populateOrder.forEach(async function (populateOrder){
                    const Contract = await contract.find();
                 
                    const ContractGetData = {Contract: Contract}
					web3.eth.getAccounts().then(async function(accounts){
                        Contract.forEach(async function(contractAdd){
                             // console.log(contractAdd.contractAddress)
                            const contractGetAddressHere = contractAdd.contractAddress;

							//console.log(contractGetAddressHere)
							
                            var _orderId = populateOrder._id.toString();
							// console.log(orderGetId) 
							var _pharmacistId = populateOrder.pharmacistId.name;
							var _seller = populateOrder.senderId.name;
                            var _toAdd = populateOrder.pharmacistId.accountAddress;    
                            var _fromAdd = populateOrder.senderId.accountAddress;

                            const myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                            const myContractFunction = myContract.methods.storeDrugs(_orderId, _pharmacistId, _seller, _toAdd, _fromAdd).encodeABI();
							const tx={
								chainId: 23112,
								data: myContractFunction,
								to: _toAdd,
                                value:web3.utils.toWei('0.1','ether'),
                                gas:600000*1.50
							}
							web3.eth.accounts.signTransaction(tx, "0x"+ myAccountKey).then(signed =>{
								web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt',async function(response){
									//console.log(response)

									const transactionData = new transactionDb({
										orderID: _orderId,
										pharmacistId: populateOrder.pharmacistId,
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
										transaction: "successful"
				                     })

				                   const transactionSave = await transactionData.save();
				                   console.log(transactionSave)	

								   
								//    const getAllDatas = await myContract.methods.getStoreDrugs(_orderId).call().then(function(result){
								// 	console.log(result);
								//  })
								})
									
							})	
                        })  
					})
                })
                //-------Emit Event--------
                // const eventEmitter = req.app.get('eventEmitter')
                // eventEmitter.emit('locationUpdate', {id: req.body.orderLID, role: req.body.role})   
                return res.send(updatedOrder) 
               
            })
        }

    }
}


module.exports = locationPharmacist