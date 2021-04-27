const PharmacistOrders = require('../../../models/phrorder')

function depotOrderController(){
    return{
        showOrder(req, res){
            PharmacistOrders.find({status: { $ne: 'completed'}}, null, { sort: { 'createdAt': -1 } }).
            populate('pharmacistId', '-private_key').exec((err, PharmacistOrders)=>{
                if(req.xhr){
                    res.json(PharmacistOrders)
                }
                else{
                    console.log(PharmacistOrders)
                    return  res.render('depot/pharmacistOrders')
                }
               
            })
        },
        showStatus(req, res){
            PharmacistOrders.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data)=>{
                if(err){
                    return res.redirect('/api/drug/depot/orders')
                }
                //-------Emit Event--------
                // const eventEmitter = req.app.get('eventEmitter')
                // eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})
                return res.redirect('/api/drug/depot/orders')
            })
        }
    }
}



module.exports = depotOrderController