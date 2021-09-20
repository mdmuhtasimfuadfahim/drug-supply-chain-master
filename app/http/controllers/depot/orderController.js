const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const passport = require('passport')
const Order = require('../../../models/order')
const contract = require('../../../models/contract')
const Ordertrd = require('../../../models/ordertrd')
const moment = require('moment')
const bcrypt = require('bcrypt')
const encryption = require('../../../config/encrptDecrypt')
var encrypt = encryption.encryption
var getAbi = require('../../../config/abi')
var abi = getAbi.abi
var accoutOrpaKey = process.env.privateKeyOf1;


function orderController(){
    return{
        async store(req, res){
            //----------Validate Request----------

            const {email, private_key, address} = req.body
            if(!email || !private_key || !address){
                req.flash('error', 'All Fields are Required')
                req.flash('email', email)
                req.flash('address', address)
                req.flash('private_key', private_key)
                return res.redirect('/cart')
            }

            
                const hashed = await bcrypt.hash(private_key, 10)
                const order = new Order({
                    depotId: req.user._id,
                    sender: "606060b0f87ae52f5ceed7d5",
                    drugs: req.session.cart.drugs,
                    email,
                    private_key: hashed,
                    address   
                })
    
                console.log(order)

                order.save().then(result =>{
                    Order.populate(result, {path: 'depotId'}, async (err, placedOrder)=>{
                        
                        req.flash('success', 'Order Placed Successfully')
                        delete req.session.cart
                        //-------Emit Event--------
                       const eventEmitter = req.app.get('eventEmitter')
                       eventEmitter.emit('orderPlaced', placedOrder)


                       const _toAdd = placedOrder.depotId.accountAddress;
                       //-----------BlockChain Transaction----------
                       const Contract = await contract.find();
                       web3.eth.getAccounts().then(async function(accounts){
                           Contract.forEach(async function(contractAdd){
                               const contractGetAddressHere = contractAdd.contractAddress;
                               const _orderId = placedOrder._id.toString();
                               const _status = placedOrder.status.toString();
                               const _email = placedOrder.email.toString();

                            const myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                            const myContractFunction = myContract.methods.setOrderInfo(_orderId, _status, _email).encodeABI();
                  
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

                                // const getOrders = myContract.methods.getOrderInfo().call({from: process.env.accountOrpa}).then(result=>{
                                //     console.log(result)
                                // })
									const orderTrdData = new Ordertrd({
										orderID: placedOrder._id,
										depotId: placedOrder.depotId,
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
                                        orderst: encrypt(_status)
				                     })

				                   const ordertrdSave = await orderTrdData.save();
				                   console.log(ordertrdSave)	
					 		})
									
					 		})	
                        })  
					   })
        
                     //  console.log(placedOrder._id + '\n' +placedOrder.email + '\n' +placedOrder.status)
                        
                        return res.redirect('/depot/orders')
                     })
                    }).catch(err=>{
                    req.flash('error', 'Something Went Wrong')
                    return res.redirect('/cart')
                })
           
           // console.log(req.body)
        },
        async orderControl(req, res){
            const orders = await Order.find({depotId: req.user._id},
                 null,
                { sort: { 'createdAt': -1 } } ).populate('sender', '-private_key')
                res.header('Cache-Control', 'no-store')
            res.render('depot/orders', {orders: orders, moment: moment })
            // console.log(orders)
        },
        async showStatus(req, res){
            const order = await Order.findById(req.params.id)
            //const location = await Location.find()
            
            //---------------Authorize User------------
            if(req.user._id.toString() === order.depotId.toString()){
               
                // console.log(order + '\n' + location)
                //location: location,
                return res.render('depot/singleOrder', { order: order})
                
            }
            return res.redirect('/')
            
              
        }
    }
}


module.exports = orderController