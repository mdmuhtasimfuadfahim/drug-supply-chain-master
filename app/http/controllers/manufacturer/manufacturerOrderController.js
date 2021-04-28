const order = require('../../../models/order')
const moment = require('moment')


function manufacturerOrderController(){
    return{
        index(req, res){
            order.find({status: { $ne: 'completed'}}, null, { sort: { 'createdAt': -1 } }).
            populate('depotId', '-private_key').exec((err, orders)=>{
                if(req.xhr){
                    res.json(orders)
                }
                else{
                    return  res.render('manufacturer/orders')
                }
               
            })  
        },
        async showCompleted(req, res){
            const ordersCompleted = await order.find({status: 'completed'}).populate('depotId', '-private_key').exec((err, orders)=>{
                if(req.xhr){
                    res.json(orders)
                }
                else{
                    return  res.render('manufacturer/completed')
                }
         //   res.render('manufacturer/completed', {ordersCompleted: ordersCompleted, moment: moment})
            })
        }
    }
}


module.exports = manufacturerOrderController