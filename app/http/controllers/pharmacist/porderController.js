const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const contract = require('../../../models/contract')
const PharmacistOrders = require('../../../models/phrorder')
const Phrordertrd = require('../../../models/phrordertrd')
var crypto = require('crypto'),
    algorithm = process.env.algorithm,
    password = process.env.ENCRYPT_DECRYPT_PASS;


function encrypt(text){
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

var myAccountKey = process.env.privateKeyOf2;

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

function porderController(){
    return{
        async pharmastore(req, res){
            //----------Validate Request----------

            const {drugs, address} = req.body
            const pharmacistOrder = new PharmacistOrders({
                pharmacistId: "60879a2bc00cb31b50430edc",
                senderId: "605a2b5cf72ab32ec8c3aee9",
                drugs: drugs,
                address   
            })
            console.log(pharmacistOrder)

            pharmacistOrder.save().then(pharmacistOrder=>{
                PharmacistOrders.populate(pharmacistOrder, {path: 'pharmacistId'}, async (err, placedOrder)=>{
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('newOrderPlaced', placedOrder)
                    // console.log(placedOrder._id + '\n' +placedOrder.depotId.email)
                    const _toAdd = placedOrder.pharmacistId.accountAddress;
                    //-----------BlockChain Transaction----------
                    const Contract = await contract.find();
                    web3.eth.getAccounts().then(async function(accounts){
                        Contract.forEach(async function(contractAdd){
                            const contractGetAddressHere = contractAdd.contractAddress;
                            const _orderId = placedOrder._id.toString();
                            const _status = placedOrder.status.toString();
                            const _email = placedOrder.pharmacistId.email.toString();

                         const myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                         const myContractFunction = myContract.methods.setOrderInfo(_orderId, _status, _email).encodeABI();
               
                     const tx={
                         chainId: 23112,
                         data: myContractFunction,
                         to: _toAdd,
                         value:web3.utils.toWei('0.1','ether'),
                         gas:600000*1.50
                     }
                     web3.eth.accounts.signTransaction(tx, "0x"+ myAccountKey).then(signed =>{
                        web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt',async function(response){
                             console.log(response)

                             // const getOrders = myContract.methods.getOrderInfo().call({from: process.env.accountOrpa}).then(result=>{
                             //     console.log(result)
                             // })
                                 const PhrorderTrd = new Phrordertrd({
                                      orderID: placedOrder._id,
                                      pharmacistId: placedOrder.pharmacistId,
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
                                      email: encrypt(_email),
                                      orderstatus: encrypt(_status)
                                  })

                                const PhrorderTrdSave = await PhrorderTrd.save();
                                console.log(PhrorderTrdSave)	
                          })
                                 
                          })	
                     })  
                    })
                    res.status(200).send(JSON.stringify(placedOrder))
                })  
            }).catch(err =>{
                console.log(err)
            })
        },
        showOrderList(req, res){
            if(req.query.id){
                const id = req.query.id
                PharmacistOrders.findById(id).then(PharmacistOrders =>{
                    if(!PharmacistOrders){
                        res.status(404).send({ message: `Not Found Any USer with this ${id}`})
                    }else{
                        res.send(PharmacistOrders)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving User with this ${id}`})
                })
            } else{
                PharmacistOrders.find().populate('senderId', '-private_key').populate('pharmacistId', '-private_key').then(PharmacistOrders =>{
                    res.send(PharmacistOrders)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Sending Drugs Information' })
                })
            }
        },
        async showTracking(req, res){
            const PharmacistOrder = await PharmacistOrders.findById(req.params.id)
            // if(req.user.id.toString() === PharmacistOrder.pharmacistId.toString()){
               console.log(PharmacistOrder)
               res.send(PharmacistOrder)
                
            // }
        }
    }
}


module.exports = porderController