
const axios = require('axios')

function drugStorageController(){
    return{
        drugStorage(req, res){
            res.render('manufacturer/drugStore/drugStorage')
        },
        drugAddStorage(req, res){
            res.render('manufacturer/drugStore/drugAddStorage')
        },
        drugAddNewStorage(req, res){
            const {drugId, categoryName, productionID, batchNum, darNum} = req.body

            //--------------Validate Request-------------
            if(!drugId || !categoryName || !productionID || !batchNum || !darNum){
                req.flash('error', 'All Fields are Required to Add New Storage')
                req.flash('drugId', drugId)
                req.flash('categoryName', categoryName)
                req.flash('productionID', productionID)
                req.flash('batchNum', batchNum)
                req.flash('darNum', darNum)
                return res.redirect('/manufacturer/drugstorage/upload')
            }

            //----------Add New Drugs to Storage-----------
            const drugstorage = new drugStorageController({
                drugId,
                categoryName,
                productionID,
                batchNum,
                darNum
            })

            console.log(drugstorage)

            drugstorage.save().then((drugstorage)=>{
                res.redirect('/manufacturer/drugstorage')
            }).catch(err=>{
                res.redirect('/manufacturer/drugstorage/upload')
            })
        },
        drugStorageFind(req, res){
            if(req.query.id){
                const id = req.query.id
                drugStorageController.findById(id).then(drugstorage =>{
                    if(!drugstorage){
                        res.status(404).send({ message: `Not Found Any Drugs with this ${id}`})
                    }else{
                        res.send(drugstorage)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving Drugs with this ${id}`})
                })
            }
            else{
                drugStorageController.find().then(drugstorage =>{
                    res.send(drugstorage)
                    console.log(drugstorage)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Retriving Information from DurgStorage' })
                })
            }
        },
        updateDrugStorage(req, res){
            axios.get(`${process.env.APP_BASE_URL}/manufacturer/drugstorage/find`, { params : { id : req.query.id }}).then(function(drugStoreData){
                console.log(drugStoreData.data)
                res.render('manufacturer/drugStore/updateDrugStorage', { drugstorage : drugStoreData.data})
               }).catch(err =>{
                   res.send(err)
               })
        },
        drugStorageUpdate(req, res){
            if(!req.body){
                return res.status(400).send({ message: 'Data to Update can not be Empty'})
            }

            const id = req.params.id
            drugStorageController.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(drugstorage =>{
                if(!drugstorage){
                    res.status(404).send({ message: `Cannot Update Drug Storage with ${id}. Maybe Drug Storage Info not Found`})
                }else{
                    res.send(drugs)
                }
            }).catch(err =>{
                res.status(500).send({ message: 'Error in Updating Drug Storage Info'})
            })
        },
        drugStorageDelete(req, res){
            const id = req.params.id

            drugStorageController.findByIdAndDelete(id).then(drugstorage =>{
                if(!drugstorage){
                    res.status(404).send({ message: `Cannot Delete Drug Storage with ${id}. Maybe Id is not Correct`})
                }
                else{
                    res.send({ message: 'Drug Storage Info was Deleted Successfully'})
                }
            }).catch(err =>{
                res.status(500).send({ message: `Cound not Delete Drug Storage Info with this ${id}}`})
            })
        }
    }
}


module.exports = drugStorageController