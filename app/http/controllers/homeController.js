const Drug = require('../../models/drug')

function homeController(){
    return{
        async index (req, res){

            const drugs = await Drug.find()
            // console.log(drugs)
            return res.render('home', {drugs: drugs})

            // Drug.find().then(function(drug){
            //     console.log(drug)
            //     return res.render('home', {drug: drug})
            // })
           
        }
    }
}


module.exports = homeController