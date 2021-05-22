const QRCODE = require('../../../models/qrcode')
const QRCode = require('qrcode')


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

            function decrypt(text){
                var decipher = crypto.createDecipher(algorithm, password)
                var dec = decipher.update(text, 'hex', 'utf8')
                dec += decipher.final('utf8');
                return dec;
            }

            //---------------------Validate Request----------------
            if(!proId || !dar || !secret_key){
                req.flash('error', 'All Fields are Requied to Generate QR Tag')
                req.flash('proId', proId)
                req.flash('dar', dar)
                req.flash('secret_key', secret_key)
                return res.redirect('/manufacturer/generatekey')
            }

            //----------Check if Secret Key Exists-----------
            QRCODE.exists({secret_key: secret_key}, (err, result)=>{
                if(result){
                    req.flash('error', 'This Secret Key is Used Already')
                    req.flash('proId', proId)
                    req.flash('dar', dar)
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
                console.log(qrCodeDataSave)
            }
        
            saveQrCode()


            if (dar.length == 0) res.send('No Data Is Given');
            
            QRCode.toDataURL(dar, (err, src) => {
                if (err) res.send('Somethig Went Wrong');
                // console.log(dar + '\n' + '\n')
                 console.log(src)

                res.render('manufacturer/qrcode/generate', { src: src });
            });
        }
    }
}


module.exports = keyController