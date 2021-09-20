const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const contract = require('../../../models/contract')
const PharmacistOrders = require('../../../models/phrorder')
const Phrordertrd = require('../../../models/phrordertrd')
const encryption = require('../../../config/encrptDecrypt')
const encrypt = encryption.encryption
var myAccountKey = process.env.privateKeyOf2;
var getAbi = require('../../../config/abi')
var abi = getAbi.abi

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
             PharmacistOrders.find().sort({'createdAt': -1}).populate('senderId', '-private_key').populate('pharmacistId', '-private_key').then(PharmacistOrders =>{
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