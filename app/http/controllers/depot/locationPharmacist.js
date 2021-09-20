const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const order = require('../../../models/phrorder')
const contract = require('../../../models/contract')
const transactionDb = require('../../../models/phrtransaction')
const encryption = require('../../../config/encrptDecrypt')
var encrypt = encryption.encryption
var getAbi = require('../../../config/abi')
var abi = getAbi.abi
var myAccountKey = process.env.privateKeyOf2;


function locationPharmacist(){
    return{
		async location(req, res){
			const orders = await order.find({_id: req.params.id}).populate('pharmacistId', '-private_key').populate('senderId', '-private_key');
		   res.send(orders)
		},
        async locationControlPharma(req, res){
            const updatedOrder = order.updateOne({_id: req.body._id}, {role: req.body.role}, async (err, data)=>{
				             
                const populateOrder = await updatedOrder.find({_id: req.body._id}).populate('pharmacistId', '-private-key').populate('senderId', '-private_key');
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
							var _buyer = populateOrder.pharmacistId.name;
							var _seller = populateOrder.senderId.name;
                            var _toAdd = populateOrder.pharmacistId.accountAddress;    
                            var _fromAdd = populateOrder.senderId.accountAddress;

                            const myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                            const myContractFunction = myContract.methods.storeDrugsAgain(_orderId, _buyer, _seller, _fromAdd, _toAdd).encodeABI();
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
                // eventEmitter.emit('locationUpdate', {id: req.body._id, role: req.body.role})   
                
               
            })
			return res.redirect('/api/drug/' + req.body._id + 'location') 
        }

    }
}


module.exports = locationPharmacist