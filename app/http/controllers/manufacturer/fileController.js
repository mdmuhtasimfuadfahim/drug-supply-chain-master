const File = require('../../../models/file')
const path = require('path')
const multer = require('multer')
const { v4: uuid4 } = require('uuid')
const fs = require('fs')
//-----------------File Upload Router-------------
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limit: { fileSize: 1000000 * 100 },
}).single('myfiles');



function fileController () {
    return{
        async file (req, res){
            try{
                const file = await File.findOne({ uuid: req.params.uuid })
                if(!file){
                    return res.json('download', { err: 'Link has been Expired' })
                }

                return res.render('download', {
                    uuid: file.uuid,
                    fileName: file.filename,
                    fileSize: file.size,
                    downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
                })
            }catch(err){
                return res.render('download', { err: 'Something went Wrong' })
            }
         },
        async fileControl (req, res){
            const file = await File.findOne({ uuid: req.params.uuid })
            if(!file){
                return res.json('download', { err: 'Link has been Expired' })
            }

            const filePath = `${__dirname}/../../../../../DrugChain/${file.path}`;
            res.download(filePath);
        },
        fileUploader (req, res){

            // res.render('drop')
            //Store Files
            upload(req, res, async (err) =>{
            //Validate request
                if(!req.file){
                return res.json({ error: 'Somthing Went Wrong'})
               }
                if(err){
                    return res.status(500).send({ error: err.message})
                }
            //Store into Database
    
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
                })
    
                const response = await file.save();
                return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
            })
            //Response -> Link  
        },
        async fileSender (req, res){
            // console.log(req.body)
            const { uuid, emailTo, emailFrom} = req.body;
            //Validate Request
            if(!uuid || !emailTo || !emailFrom){
                return res.status(422).send({ error: 'All Fields are Required'})
            }
            //Get Data From Database
            try{
                const file = await File.findOne({ uuid : uuid })
            if(file.sender){
                return res.status(422).send({ error: 'Email Already Sent'})
            }
        
            file.sender = emailFrom;
            file.receiver = emailTo;
            const response = await file.save();
            // console.log(response)
        
            const sendMail = require('../../../../services/mailService')
            sendMail({ 
                from: emailFrom,
                to: emailTo,
                subject: 'DrugGuard. The Secure Files Sharing',
                text: `${emailFrom} shared a file with you. Keep it secret`,
                html: require('../../../../services/mailTemplate')({ 
                    emailFrom: emailFrom,
                    downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                    size: parseInt(file.size/1000) + ' KB',
                    expires: '24 hours'
                })
            }).then(()=>{
                return res.json({ success: true })
            }).catch(err =>{
                return res.status(500).json({ error: 'Error While Sending Email'})
            })
        } catch(err) {
            return res.status(500).send({ error: 'Something is Going Wrong Here'})
        }
            
        }
    }
}


module.exports = fileController