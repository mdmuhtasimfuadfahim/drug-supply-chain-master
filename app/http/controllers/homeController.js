const Drug = require('../../models/drug')
const User = require('../../models/user')

function homeController(){
    return{
        async index (req, res){

            const drugs = await Drug.find()
           // const users = await User.find()
            // console.log(drugs)
            return res.render('home', {drugs: drugs})
            //console.log(users)
            // Drug.find().then(function(drug){
            //     console.log(drug)
            //     return res.render('home', {drug: drug})
            // })
           
        },

        //------------Pass Drug List JSON (API)---------
        passDrug (req, res){
            if(req.query.id){
                const id = req.query.id
                Drug.findById(id).then(drug =>{
                    if(!drug){
                        res.status(404).send({ message: `Not Found Any USer with this ${id}`})
                    }else{
                        res.send(drug)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving User with this ${id}`})
                })
            } else{
                Drug.find().then(drug =>{
                    res.send(drug)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Sending Drugs Information' })
                })
            }
        
        //    try{
         
        //        const drugs = await Drug.find()
        //     //    console.log(drug)
        //        if(!drugs){
        //            return res.status(400).json({ success: false, msg: 'Something is Wrong Again'})
        //        }
        //        return res.status(200).json({drugs, success: true, count: drugs.length, msg: 'Good Job' })
        //    } catch(error){
        //     return res.status(500).send({ error: 'Something is Going Wrong Here'}) 
        //    }
        },

        //----------Get Drug List JSON----------
        passgetDrug(req, res, next) {

            if(req.query.id){
                const id = req.query.id
                Drug.findById(id).then(drug =>{
                    if(!drug){
                        res.status(404).send({ message: `Not Found Any USer with this ${id}`})
                    }else{
                        res.send(drug)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving User with this ${id}`})
                })
            } else{
                Drug.find().then(drug =>{
                    res.send(drug)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Sending Drugs Information' })
                })
            }
         },
         dropFile(req, res){ 
            res.render('depot/drop')   
        },
        dropManufacturer(req, res){
            res.render('manufacturer/drop')
        }
    }
}


module.exports = homeController