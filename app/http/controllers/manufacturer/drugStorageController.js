const drugStore = require('../../../models/storage')
const axios = require('axios')


function drugStorageController(){
    return{
        async drugStorage(req, res){
            const drugstorage = await drugStore.find().populate('drugId', '-genericName')
            console.log(drugstorage)
            res.render('manufacturer/drugStore/drugStorage', {drugstorage: drugstorage})
        },
        drugAddStorage(req, res){
            res.render('manufacturer/drugStore/drugAddStorage')
        },
        drugAddNewStorage(req, res){
            const {drugId, drugName, productionID, batchNum, darNum, production} = req.body

           
             //---------Validate Request-----------
             if(!drugId || !drugName || !productionID || !batchNum || !darNum || !production ){
                req.flash('error', 'All Fields are Required to Add Drug production')
                req.flash('drugId', drugId)
                req.flash('drugName', drugName)
                req.flash('productionID', productionID)
                req.flash('batchNum', batchNum)
                req.flash('darNum', darNum)
                req.flash('production', production)
                return res.redirect('/manufacturer/drugstorage/upload')
            }

            //----------Add New Drugs to Storage-----------
            const drugstorage = new drugStore({
                drugId: drugId,
                drugName: drugName,
                productionID: productionID,
                batchNum: batchNum,
                darNum: darNum,
                production: production
            })

            

            drugstorage.save().then((drugstorage)=>{
                console.log(drugstorage)
                return res.redirect('/manufacturer/drugstorage')
            }).catch(err=>{
                return res.redirect('/manufacturer/drugstorage/upload')
            })
        },
        drugStorageFind(req, res){
            if(req.query.id){
                const id = req.query.id
                drugStore.findById(id).then(drugstorage =>{
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
                drugStore.find().then(drugstorage =>{
                    res.send(drugstorage)
                    console.log(drugstorage)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Retriving Information from DurgStorage' })
                })
            }
        },
        updateDrugStorage(req, res){
            axios.get(`${process.env.APP_BASE_URL}/manufacturer/drugstorage/find`, { params : { id : req.query.id }}).then(function(drugStoreData){
                //console.log(drugStoreData.data)
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
            drugStore.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(drugstorage =>{
                if(!drugstorage){
                    res.status(404).send({ message: `Cannot Update Drug Storage with ${id}. Maybe Drug Storage Info not Found`})
                }else{
                    res.send(drugstorage)
                }
            }).catch(err =>{
                res.status(500).send({ message: 'Error in Updating Drug Storage Info'})
            })
        },
        drugStorageDelete(req, res){
            const id = req.params.id

            drugStore.findByIdAndDelete(id).then(drugstorage =>{
                if(!drugstorage){
                    res.status(404).send({ message: `Cannot Delete Drug Storage with ${id}. Maybe Id is not Correct`})
                }
                else{
                    res.send({ message: 'Drug Storage Info was Deleted Successfully'})
                }
            }).catch(err =>{
                res.status(500).send({ message: `Cound not Delete Drug Storage Info with this ${id}}`})
            })
        },
        productionControl(req, res){
            res.render('manufacturer/production/drug')
        },
        async productionUpdate(req, res){
            const {drugName, production} = req.body

            if(!drugName || !production){
                req.flash('error', 'All Fields are Required to Update Production')
                req.flash('drugName', drugName)
                req.flash('production', production)
                return res.redirect('/manufacturer/production/control')
            }
            //console.log(drugName + '\n' + '\n' + production + '\n' + '\n')
            const drugStorage = await drugStore.findOne({drugName})
           // console.log(drugStorage.drugName + '\n' + drugStorage.production) 

           const newProduction = drugStorage.production - production
           
           const response = await drugStore.updateOne({drugName}, {production: newProduction})
           //console.log(response)
            return res.redirect('/manufacturer/drugstorage')
        }
    }
}


module.exports = drugStorageController