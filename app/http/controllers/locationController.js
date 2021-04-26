const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const abiDecoder = require('abi-decoder')
const order = require('../../models/order')
const contract = require('../../models/contract')

const transactionDb = require('../../models/transaction')
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

var accoutOrpaKey = "63486cf0332b231a768b8cb4e1683f352532a22e37f5c778e61f016f3a314038";
function locationController(){
    return{
        
       async location(req, res){   
    
       
        const orders = await order.find({_id: req.params.id}).populate('depotId', '-private_key').populate('sender', '-private_key');
         //console.log(orders)
		 
		
		

        return res.render('location', {orders: orders})
        },

       async locationControl(req, res){

            
            
           const updatedOrder = order.updateOne({_id: req.body.orderLID}, {role: req.body.role}, async (err, data)=>{
             
                if(err){
                    console.log(err)
                    return res.redirect('/' + req.body.orderLID + '/location')
                }
				             
                const populateOrder = await updatedOrder.find({_id: req.body.orderLID}).populate('depotId', '-private-key').populate('sender', '-private_key');
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
							var _depotId = populateOrder.depotId.name;
							var _seller = populateOrder.sender.name;
                            var _toAdd = populateOrder.depotId.accountAddress;    
                            var _fromAdd = populateOrder.sender.accountAddress;

                            const myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                            const myContractFunction = myContract.methods.storeDrugs(_orderId, _depotId, _seller, _toAdd, _fromAdd).encodeABI();
                           // console.log(myContractFunction)
						//    const eventFromContract = myContract.event.logDrugInfo(()=>{

						//    }).on('data', function(event){

						//    })
							const tx={
								chainId: 23112,
								data: myContractFunction,
								to: _toAdd,
                                value:web3.utils.toWei('0.1','ether'),
                                gas:600000*1.50
							}
							web3.eth.accounts.signTransaction(tx, "0x"+ accoutOrpaKey).then(signed =>{
								web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt',async function(response){
									//console.log(response)

									const transactionData = new transactionDb({
										orderID: _orderId,
										depotId: populateOrder.depotId,
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
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('locationUpdate', {id: req.body.orderLID, role: req.body.role})   
                return res.redirect('/' + req.body.orderLID + '/location') 
               
            })
        }
    }
}


module.exports = locationController