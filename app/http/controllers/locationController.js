
const order = require('../../models/order')
const contract = require('../../models/contract')
var abi = [
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
				"internalType": "string",
				"name": "orderId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "depotId",
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
		"constant": true,
		"inputs": [],
		"name": "depotId",
		"outputs": [
			{
				"internalType": "address payable",
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
		"name": "isDepotId_",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "seller",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
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
				"internalType": "string",
				"name": "_orderId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_depotId",
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
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

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

                // console.log(orders._id);
                //-------Emit Event--------
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('locationUpdate', {id: req.body.orderLID, role: req.body.role})
               
                
               async function returnContents(){
                    const populateOrder = await updatedOrder.find({_id: req.body.orderLID}).populate('depotId', '-private-key').populate('sender', '-private_key');
                    const retunPopulateOrder = {populateOrder : populateOrder}
                    populateOrder.forEach(async function (populateOrder){
                        const Contract = await contract.find();
                 
                        const ContractGetData = {Contract: Contract}
                        Contract.forEach(function(contractAdd){
                             // console.log(contractAdd.contractAddress)
                              const contractGetAddressHere = contractAdd.contractAddress 
                            //   console.log("orderId:", populateOrder._id)
                            //   console.log("depotAccout:", populateOrder.depotId.accountAddress)
                            //   console.log(populateOrder.depotId.name)
                            //   console.log(populateOrder.sender.name)
                            //   console.log(populateOrder.sender.accountAddress)
                            //   console.log(contractGetAddressHere) 
                           // console.log(abi)


                             var myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                             const myContractFunction = myContract.methods.storeDrugs(String, String, String, String, String).encodeABI();
                                 
                        })  
                       
                 
                    })
                }
               

               returnContents()
               

                return res.redirect('/' + req.body.orderLID + '/location') 
               
            })
        }
    }
}


module.exports = locationController