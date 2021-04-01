const order = require('../../../models/order')
const Order = require('../../../models/order')

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


            
        }
    }
}


module.exports = manufacturerOrderController