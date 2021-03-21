//const drugs = require('../app/models/drug')

const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../app/models/file');
const Drug = require('../app/models/drug');
const { v4: uuid4 } = require('uuid');
const { truncate } = require('fs');
const { Result } = require('postcss');
// const { restart } = require('nodemon');
// const { parse } = require('dotenv/types');
// const { response } = require('express');

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


//-----------------JSON Post Route-------------
router.post('/', async (req, res) =>{
   try{
    //    const drug = await Drug.find({
    //        image: req.image,
    //        categoryName: req.categoryName,
    //        drugName: req.drugName,
    //        productionDate: req.productionDate,
    //        expirationDate: req.expirationDate,
    //        comment: req.comment,
    //        price: req.price,
    //        genericName: req.genericName,
    //        brandName: req.brandName,
    //        description: req.description
    //    })

       const drugs = await Drug.find()
    //    console.log(drug)
       if(!drugs){
           return res.status(400).json({ success: false, msg: 'Something is Wrong Again'})
       }
       return res.status(200).json({drugs, success: true, count: drugs.length, msg: 'Good Job' })
   } catch(error){
    return res.status(500).send({ error: 'Something is Going Wrong Here'}) 
   }
})

router.get('/', async (req, res, next) =>{
    try{
     //    const drug = await Drug.find({
     //        image: req.image,
     //        categoryName: req.categoryName,
     //        drugName: req.drugName,
     //        productionDate: req.productionDate,
     //        expirationDate: req.expirationDate,
     //        comment: req.comment,
     //        price: req.price,
     //        genericName: req.genericName,
     //        brandName: req.brandName,
     //        description: req.description
     //    })
 
        const drugs = await Drug.find()
     //    console.log(drug)
        if(!drugs){
            return res.status(400).json({ success: false, msg: 'Something is Wrong Again'})
        }
        return res.status(200).json({drugs, success: true, count: drugs.length, msg: 'Good Job' })
    } catch(error){
     return res.status(500).send({ error: 'Something is Going Wrong Here'}) 
    }
 })


//-----------------File Upload Router-------------
router.post('/files', (req, res) =>{

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
})

router.post('/files/send', async (req, res)=>{
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

    const sendMail = require('../services/mailService')
    sendMail({ 
        from: emailFrom,
        to: emailTo,
        subject: 'DrugGuard. The Secure Files Sharing',
        text: `${emailFrom} shared a file with you. Keep it secret`,
        html: require('../services/mailTemplate')({ 
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
    
})

module.exports = router