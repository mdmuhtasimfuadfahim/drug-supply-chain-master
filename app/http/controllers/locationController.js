const location = require('../../models/location')
const order = require('../../models/order')

function locationController(){
    return{
        
       async location(req, res){   
        
        
        // const locations = await location.find({role: {$ne: 'Pharmacist'}})
        // console.log(locations)
        // return res.render('location', {locations: locations})
        // const locations = await location.find(req.params.id)
       
        const orders = await order.find({_id: req.params.id}).populate('depotId', '-private_key').populate('sender', '-private_key')
        console.log(orders)

        return res.render('location', {orders: orders})
            // order.find({role: {$ne : 'Pharmacist'}}, null).populate('depotId', '-private_key').exec((err, order) =>{
                    
            //         if(req.xhr){
            //             res.json(order)
            //             console.log(order)
            //          }
            //          else{
            //             return res.render('location', {order})
            //          }            
                     
            //     })     
           // return res.render('location', {locations})   
        },

        locationControl(req, res){
            
            order.updateOne({_id: req.body.orderLID}, {role: req.body.role}, (err, data)=>{
                console.log(req.body.role)
                if(err){
                    console.log(err)
                    return res.redirect('/' + req.body.orderLID + '/location')
                }
                //-------Emit Event--------
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('locationUpdate', {id: req.body.orderLID, role: req.body.role})
                return res.redirect('/' + req.body.orderLID + '/location')
            })
        }
    }
}


module.exports = locationController