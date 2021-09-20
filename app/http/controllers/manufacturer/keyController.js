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
const encryption = require('../../../config/encrptDecrypt')
const encrypt = encryption.encrypt
const decryption = require('../../../config/encrptDecrypt')
const decrypt = decryption.decryption
var getAbi = require('../../../config/abi')
var abi = getAbi.abi
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
                                  blockHash: encrypt(response.blockHash),
                                  blockNumber: encrypt(response.blockNumber.toString()),
                                  cumulativeGasUsed: encrypt(response.cumulativeGasUsed.toString()),
                                  from: encrypt(response.from.toString()),
                                  gasUsed: encrypt(response.gasUsed.toString()),
                                  logsBloom: encrypt(response.logsBloom),
                                  status: encrypt(response.status.toString()),
                                  transactionHash: encrypt(response.transactionHash),
                                  transactionIndex: encrypt(response.transactionIndex.toString()),
                                  type: encrypt(response.type.toString()),
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
			
			//const secretDar = qrCodeData.dar

			const secret = qrCodeData.secret_key
            //console.log(secret + '\n' + secretDar)

            var crypto = require('crypto'),
                        algorithm = process.env.algorithm,
                        password = secret;

            function decrypt(text){
                var decipher = crypto.createDecipher(algorithm, password)
                var dec = decipher.update(text, 'hex', 'utf8')
                dec += decipher.final('utf8');
                return dec;
            }

            const decryptDAR = decrypt(dar)
			console.log(dar + '\n' + secret + '\n' + decryptDAR)
			
			res.status(200).send(JSON.stringify({decryptDAR: decryptDAR}))          
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
                    blockHash: decrypt(qrCodeBlockchainInfo.blockHash),
                    blockNumber: decrypt(qrCodeBlockchainInfo.blockNumber),
                    cumulativeGasUsed: decrypt(qrCodeBlockchainInfo.cumulativeGasUsed),
                    from: decrypt(qrCodeBlockchainInfo.from),
                    gasUsed: decrypt(qrCodeBlockchainInfo.gasUsed),
                    logsBloom: decrypt(qrCodeBlockchainInfo.logsBloom),
                    status: decrypt(qrCodeBlockchainInfo.status),
                    transactionHash: decrypt(qrCodeBlockchainInfo.transactionHash),
                    transactionIndex: decrypt(qrCodeBlockchainInfo.transactionIndex),
                    type: decrypt(qrCodeBlockchainInfo.type),
                    createdAt: qrCodeBlockchainInfo.createdAt
               })
            })

            console.log(qrCodeBlockchainData)
            res.render('manufacturer/qrcode/blockdata', {qrCodeBlockchainData: qrCodeBlockchainData, moment: moment})
        }
    }
}


module.exports = keyController