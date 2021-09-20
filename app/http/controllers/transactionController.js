const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const Transaction = require('../../models/transaction')
const PhrTransaction = require('../../models/phrtransaction')
const moment = require('moment')
const decryption = require('../../config/encrptDecrypt')
const decrypt = decryption.decryption


function transactionController(){
    return{
        async depotTransaction(req, res){
           const transaction = await Transaction.find({depotId: req.user._id}, null, { sort: { 'createdAt': -1 } }).populate('orderID', '-private_key')
		   const showTransaction = {transaction: transaction};
		   const transactions = []
		   transaction.forEach(function(transaction){
			transactions.push({
			   _id: transaction._id,
			   orderID: transaction.orderID,
			   depotId: transaction.depotId,
			   blockHash: decrypt(transaction.blockHash),
			   blockNumber: decrypt(transaction.blockNumber),
			   contractAddress: transaction.contractAddress,
			   cumulativeGasUsed: decrypt(transaction.cumulativeGasUsed.toString()),
			   from: decrypt(transaction.from.toString()),
			   gasUsed: decrypt(transaction.gasUsed.toString()),
			   logsBloom: decrypt(transaction.logsBloom.toString()),
			   status:decrypt(transaction.status.toString()),
			   to:decrypt(transaction.to.toString()),
			   transactionHash:decrypt(transaction.transactionHash),
			   transactionIndex:decrypt(transaction.transactionIndex.toString()),
			   type:decrypt(transaction.type.toString()),
			   transaction: transaction.transaction,
			   createdAt: transaction.createdAt,
			   updatedAt: transaction.updatedAt,
			   __v: transaction.__v
		   })

		   console.log(transactions)  
	   })
          // console.log(transactions)
		//    const myContract = new web3.eth.Contract(abi, contractAddress)
		//    const getAllDatas = await myContract.methods.getStoreDrugs("6082e0d913143b04bc137480").call({from: "0x372570fbdc1ea9c9d1c4513677218dc53b6acb19"});
		//    console.log(getAllDatas)
        //   web3.eth.getAccounts().then(async function(accounts){
        //     const myContract = new web3.eth.Contract(abi, contractAddress)
        //     const _orderId = '607a927c34f0d51bf89cff77';
        //     const getAllDatas = await myContract.methods.getStoreDrugs(_orderId).call().then(function(result){
        //        console.log(result);
        //      })
            

        //     //  var myEvent = myContract.events.logDrugInfo().call().then(function(error, event){
        //     //      console.log(event)
        //     //  }).then(function(events){
        //     //         console.log(events)
        //     //     })

        // //    const events = await myContract.getPastEvents('logDrugInfo',{
        // //         filter:{},
        // //         fromBlock:2900,
        // //         toBlock: 'latest'
        // //     }, function(error, events){
        // //         console.log(events);
        // //     }).then(function(events){
        // //         console.log(events)
        // //     })

        // // const events = await myContract.getPastEvents('logDrugInfo', {fromBlock: 0})
        // // console.log(events)


        //      })
             
          
           return res.render('depot/transaction', {transactions: transactions, moment: moment })
        },

		async manufacturerTransaction(req, res){
		   const transaction = await Transaction.find().sort({'createdAt': -1}).populate('orderID', '-private_key')
		   const showTransaction = {transaction: transaction};
		   const transactions = []
		   transaction.forEach(function(transaction){
			   console.log(transaction)
			transactions.push({
			   _id: transaction._id,
			   orderID: transaction.orderID,
			   blockHash: decrypt(transaction.blockHash),
			   blockNumber: decrypt(transaction.blockNumber),
			   contractAddress: transaction.contractAddress,
			   cumulativeGasUsed: decrypt(transaction.cumulativeGasUsed),
			   from: decrypt(transaction.from),
			   gasUsed: decrypt(transaction.gasUsed),
			   logsBloom: decrypt(transaction.logsBloom),
			   status:decrypt(transaction.status),
			   to:decrypt(transaction.to),
			   transactionHash:decrypt(transaction.transactionHash),
			   transactionIndex:decrypt(transaction.transactionIndex),
			   type:decrypt(transaction.type),
			   transaction: transaction.transaction,
			   createdAt: transaction.createdAt,
			   updatedAt: transaction.updatedAt,
			   __v: transaction.__v
		   })

		  
	   })
	   console.log(transactions)  

		   return res.render('manufacturer/transaction', {transactions: transactions, moment: moment })

		},
	    async pharmacistTransaction(req, res){
		   const transaction = await PhrTransaction.find().sort({'createdAt': -1}).populate('orderID', '-private_key')
		   const showTransaction = {transaction: transaction};
		   const transactions = []
		   transaction.forEach(function(transaction){
			  // console.log(transaction)
			transactions.push({
			   _id: transaction._id,
			   orderID: transaction.orderID,
			   blockHash: decrypt(transaction.blockHash),
			   blockNumber: decrypt(transaction.blockNumber),
			   contractAddress: transaction.contractAddress,
			   cumulativeGasUsed: decrypt(transaction.cumulativeGasUsed),
			   from: decrypt(transaction.from),
			   gasUsed: decrypt(transaction.gasUsed),
			   logsBloom: decrypt(transaction.logsBloom),
			   status:decrypt(transaction.status),
			   to:decrypt(transaction.to),
			   transactionHash:decrypt(transaction.transactionHash),
			   transactionIndex:decrypt(transaction.transactionIndex),
			   type:decrypt(transaction.type),
			   transaction: transaction.transaction,
			   createdAt: transaction.createdAt,
			   updatedAt: transaction.updatedAt,
			   __v: transaction.__v
		   })

		  
	   })
	   console.log(transactions)  

		   return res.render('depot/pharma/transaction', {transactions: transactions, moment: moment })

		}

    }
}


module.exports = transactionController