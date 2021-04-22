const Drug = require('../../../models/drug')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const axios = require('axios')

//-----------------File Upload Router-------------
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/img'),
    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})


let upload = multer({
    storage,
}).single('image')

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
            upload(req, res, (err) =>{
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

        })
        },
        
        drugFind(req, res){
            if(req.query.id){
                const id = req.query.id
                Drug.findById(id).then(drugs =>{
                    if(!drugs){
                        res.status(404).send({ message: `Not Found Any Drug with this ${id}`})
                    }else{
                        res.send(drugs)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving Drug with this ${id}`})
                })
            }
            else{
                Drug.find().then(drugs =>{
                    res.send(drugs)
                    console.log(drugs)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Retriving Drugs Information' })
                })
            }
        },
        updateDrug(req, res){
            // const user = await User.find()
            // const id = await User.findById()
            // const response = req.query.id
            axios.get(`${process.env.APP_BASE_URL}/manufacturer/drugs/find`, { params : { id : req.query.id }}).then(function(drugData){
            console.log(drugData.data)
            res.render('manufacturer/drugsControl/updatedrug', { drugs : drugData.data})
           }).catch(err =>{
               res.send(err)
           })
        },
        drugUpdate(req, res){
            if(!req.body){
                return res.status(400).send({ message: 'Data to Update can not be Empty'})
            }

            const id = req.params.id
            Drug.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(drugs =>{
                if(!drugs){
                    res.status(404).send({ message: `Cannot Update Drug with ${id}. Maybe Drug Info not Found`})
                }else{
                    res.send(drugs)
                }
            }).catch(err =>{
                res.status(500).send({ message: 'Error in Updating Drug Info'})
            })
        },
        drugDelete(req, res){
            const id = req.params.id

            Drug.findByIdAndDelete(id).then(drugs =>{
                if(!drugs){
                    res.status(404).send({ message: `Cannot Delete Drug with ${id}. Maybe Id is not Correct`})
                }
                else{
                    res.send({ message: 'Drug Info was Deleted Successfully'})
                }
            }).catch(err =>{
                res.status(500).send({ message: `Cound not Delete Drug Info with this ${id}}`})
            })
        }
    }
}




module.exports = drugController