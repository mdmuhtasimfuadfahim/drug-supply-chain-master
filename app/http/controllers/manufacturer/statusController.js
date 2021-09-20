const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const passport = require('passport')
const Order = require('../../../models/order')
const contract = require('../../../models/contract')
const Complete = require('../../../models/complete')
const encryption = require('../../../config/encrptDecrypt')
const encrypt = encryption.encryption 
var getAbi = require('../../../config/abi')
var abi = getAbi.abi
var accoutOrpaKey = process.env.privateKeyOf1;


function statusController(){
    return{
        async statusControl(req, res){
           const order = Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, async (err, data)=>{
                if(err){
                    return res.redirect('/manufacturer/orders')
                }

                
                console.log(req.body.orderId)
                
                //-------Emit Event--------
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})

                if(req.body.status === 'completed'){
               
                //-----------BlockChain Transaction----------
                const _toAdd = "0x090070f77a6b9b016f9c8be8b4a8ed047c07b088";
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
                     web3.eth.accounts.signTransaction(tx, "0x"+ accoutOrpaKey).then(signed =>{
                       web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt',async function(response){
                            // console.log(response)
                            const completeSaveVa = new Complete({
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
                                 orderst: encrypt(_status)
                             })

                           const completeDataSave = await completeSaveVa.save();
                           console.log(completeDataSave)
                       })                                
                    })	
                })  
               })
               // console.log(req.body.orderId + '\n' + req.body.status)
            }
                
                return res.redirect('/manufacturer/orders')
            })
        },
        darControl(req, res){
            Order.updateOne({_id: req.body.darNum}, {dar: req.body.dar}, (err, data)=>{
                if(err){
                    //console.log(err)
                    return res.redirect('/manufacturer/orders')
                }
                return res.redirect('/manufacturer/orders')
            })
        }
    }
}

module.exports = statusController