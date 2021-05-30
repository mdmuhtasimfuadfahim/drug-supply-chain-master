const Web3 = require('web3')
const rpcUrl = "http://localhost:8000"
const web3 = new Web3(rpcUrl) 
var Accounts = require('web3-eth-accounts')
var keyth = require('keythereum')
const Tx = require('ethereumjs-tx').Transaction
const contract = require('../../../models/contract')
const QRCODE = require('../../../models/qrcode')
const QRCode = require('qrcode')
const QRCodeTransaction = require('../../../models/qrtransaction')
const moment = require('moment')
var crypto = require('crypto'),
            algorithm = process.env.algorithm,
            password = process.env.ENCRYPT_DECRYPT_PASS;


        function encrypted(text){
           var cipher = crypto.createCipher(algorithm, password)
           var crypted = cipher.update(text, 'utf8', 'hex')
           crypted += cipher.final('hex');
           return crypted;
        }
        function decrypted(text){
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
var accoutOrpaKey = process.env.privateKeyOf1;

function keyController(){
    return{
        key(req, res){
            res.render('manufacturer/qrcode/key')
        },
        generateQRCode(req, res){
            const { proId, secret_key } = req.body
            var crypto = require('crypto'),
                        algorithm = process.env.algorithm,
                        password = secret_key;


            function encrypt(text){
                var cipher = crypto.createCipher(algorithm, password)
                var crypted = cipher.update(text, 'utf8', 'hex')
                crypted += cipher.final('hex');
                return crypted;
            }

            const dar = encrypt(req.body.dar)
            const rawDar = req.body.dar
            

            //---------------------Validate Request----------------
            if(!proId || !rawDar || !secret_key){
                req.flash('error', 'All Fields are Requied to Generate QR Tag')
                req.flash('proId', proId)
                req.flash('dar', rawDar)
                req.flash('secret_key', secret_key)
                return res.redirect('/manufacturer/generatekey')
            }

            //----------Check if Secret Key Exists-----------
            QRCODE.exists({secret_key: secret_key}, (err, result)=>{
                if(result){
                    req.flash('error', 'This Secret Key is Used Already')
                    req.flash('proId', proId)
                    req.flash('dar', rawDar)
                    req.flash('secret_key', secret_key)
                    return res.redirect('/manufacturer/generatekey')
                }
            })

            //------------Store into Database----------------
            async function saveQrCode(){

                const qrCodeData = new QRCODE({
                    proId,
                    dar,
                    secret_key
                })
        
                const qrCodeDataSave = await qrCodeData.save() 
                // console.log(qrCodeDataSave._id)
                const qrCodeId = qrCodeDataSave._id
                //-----------BlockChain Transaction----------
                const Contract = await contract.find();
                web3.eth.getAccounts().then(async function(accounts){
                    Contract.forEach(async function(contractAdd){
                        const contractGetAddressHere = contractAdd.contractAddress;
                        const _productionId = proId;
                        const _secretKey = secret_key;
                        const _darNumber = rawDar;

                     const myContract =new web3.eth.Contract(abi,contractGetAddressHere);

                     const myContractFunction = myContract.methods.createQR(_productionId, _secretKey, _darNumber).encodeABI();
           
                 const tx={
                     chainId: 23112,
                     data: myContractFunction,
                     to: "0x372570fbdc1ea9c9d1c4513677218dc53b6acb19",
                     value:web3.utils.toWei('0.1','ether'),
                     gas:600000*1.50
                 }
                 web3.eth.accounts.signTransaction(tx, "0x"+ accoutOrpaKey).then(signed =>{
                    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt',async function(response){
                        // console.log(response)

                             const qrCodeTransactionData = new QRCodeTransaction({
                                  QRCodeID: qrCodeId,
                                  blockHash: encrypted(response.blockHash),
                                  blockNumber: encrypted(response.blockNumber.toString()),
                                  cumulativeGasUsed: encrypted(response.cumulativeGasUsed.toString()),
                                  from: encrypted(response.from.toString()),
                                  gasUsed: encrypted(response.gasUsed.toString()),
                                  logsBloom: encrypted(response.logsBloom),
                                  status: encrypted(response.status.toString()),
                                  transactionHash: encrypted(response.transactionHash),
                                  transactionIndex: encrypted(response.transactionIndex.toString()),
                                  type: encrypted(response.type.toString()),
                              })

                            const qrCodeTransactionDataSave = await qrCodeTransactionData.save();
                            console.log(qrCodeTransactionDataSave)	
                      })
                             
                      })	
                 })  
                })
            }
        
            saveQrCode()


            if (dar.length == 0) res.send('No Data Is Given');
            
            QRCode.toDataURL(dar, (err, src) => {
                if (err) res.send('Somethig Went Wrong');
                // console.log(dar + '\n' + '\n')
                 console.log(src)

                res.render('manufacturer/qrcode/generate', { src: src });
            })
        },
        async decryptQRCode(req, res){
            const dar = req.body.dar

            const qrCodeData = await QRCODE.findOne({dar})
            const secret_key = qrCodeData.secret_key
            // console.log(qrCodeData.secret_key)

            var crypto = require('crypto'),
                        algorithm = process.env.algorithm,
                        password = secret_key;

            function decrypt(text){
                var decipher = crypto.createDecipher(algorithm, password)
                var dec = decipher.update(text, 'hex', 'utf8')
                dec += decipher.final('utf8');
                return dec;
            }

            const decryptedDAR = decrypt(dar)
			console.log(dar + '\n' + secret_key + '\n' + decryptedDAR)
            res.status(200).send(JSON.stringify(decryptedDAR))
           
        },
        async qrCodeInfo(req, res){
            const qrCodeDB = await QRCODE.find()
            const qrcodeNew = {qrCodeDB: qrCodeDB}
            const qrCodeDBInfo = []
            qrCodeDB.forEach(function(qrCodeDB){
                console.log(qrCodeDB.secret_key)
                const secret_key = qrCodeDB.secret_key
                var crypto = require('crypto'),
                algorithm = process.env.algorithm,
                password = secret_key;

                function decrypt(text){
                    var decipher = crypto.createDecipher(algorithm, password)
                    var dec = decipher.update(text, 'hex', 'utf8')
                    dec += decipher.final('utf8');
                    return dec;
                }

                qrCodeDBInfo.push({
                    _id: qrCodeDB._id,
                    proId: qrCodeDB.proId,
                    dar: decrypt(qrCodeDB.dar),
                    secret_key: qrCodeDB.secret_key,
                    createdAt: qrCodeDB.createdAt
                })

            })
            console.log(qrCodeDBInfo)

            res.render('manufacturer/qrcode/show', {qrCodeDBInfo: qrCodeDBInfo, moment: moment})
        },

        async qrCodeBlockchainInfo(req, res){
            const qrCodeBlockchainInfo = await QRCodeTransaction.find()
            const qrCodeBlockchainNew = {qrCodeBlockchainInfo: qrCodeBlockchainInfo}
            const qrCodeBlockchainData = []
            qrCodeBlockchainInfo.forEach(function(qrCodeBlockchainInfo){
               qrCodeBlockchainData.push({
                    _id: qrCodeBlockchainInfo._id,
                    QRCodeID: qrCodeBlockchainInfo.QRCodeID,
                    blockHash: decrypted(qrCodeBlockchainInfo.blockHash),
                    blockNumber: decrypted(qrCodeBlockchainInfo.blockNumber),
                    cumulativeGasUsed: decrypted(qrCodeBlockchainInfo.cumulativeGasUsed),
                    from: decrypted(qrCodeBlockchainInfo.from),
                    gasUsed: decrypted(qrCodeBlockchainInfo.gasUsed),
                    logsBloom: decrypted(qrCodeBlockchainInfo.logsBloom),
                    status: decrypted(qrCodeBlockchainInfo.status),
                    transactionHash: decrypted(qrCodeBlockchainInfo.transactionHash),
                    transactionIndex: decrypted(qrCodeBlockchainInfo.transactionIndex),
                    type: decrypted(qrCodeBlockchainInfo.type),
                    createdAt: qrCodeBlockchainInfo.createdAt
               })
            })

            console.log(qrCodeBlockchainData)
            res.render('manufacturer/qrcode/blockdata', {qrCodeBlockchainData: qrCodeBlockchainData, moment: moment})
        }
    }
}


module.exports = keyController