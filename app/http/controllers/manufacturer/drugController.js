const Drug = require('../../../models/drug')
const path = require('path')
const multer = require('multer')


//-----------------File Upload Router-------------
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'public/img'),
//     filename: (req, file, cb) =>{
//         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
//         cb(null, uniqueName)
//     }
// })


// let upload = multer({
//     storage,
// }).single('image')

function drugController(){
    return{

        async seeDrugs(req, res){
            const drugs = await Drug.find();
            res.render('manufacturer/drugsControl/drugitem', {drugs: drugs})
        },
        addDrugPage(req, res){
            res.render('manufacturer/drugsControl/drugadd')
        },
        uploadDrugs(req,res){
            // upload(req, res, (err) =>{
              const {drugName, image, categoryName, productionDate, expirationDate, comment, price, genericName, brandName, description} = req.body
              
            //---------Validate Request-----------
            if(!drugName || !categoryName || !productionDate || !expirationDate || !comment || !price || !genericName || !brandName || !description){
                req.flash('error', 'All Fields are Required to Add Drug')
                req.flash('drugName', drugName)
                req.flash('categoryName', categoryName)
                req.flash('productionDate', productionDate)
                req.flash('expirationDate', expirationDate)
                req.flash('comment', comment)
                req.flash('price', price)
                req.flash('genericName', genericName)
                req.flash('brandName', brandName)
                req.flash('description', description)
                return res.redirect('/manufacturer/drugs/upload')
            }

            //--------Add New Drug to Sell--------
            const drug = new Drug({
                drugName: drugName,
                image: '/img/' + image,
                categoryName: categoryName,
                productionDate: productionDate,
                expirationDate: expirationDate,
                comment: comment,
                price: price,
                genericName: genericName,
                brandName: brandName,
                description: description
            })
            console.log(drug)

            drug.save().then((drug)=>{
                return res.redirect('/manufacturer/drugs')
            }).catch(err=>{
                return res.redirect('/manufacturer/drugs/upload')
            })

        // })
        }
    }
}




module.exports = drugController