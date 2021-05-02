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
                if(req.body.status === 'completed'){
                    console.log(req.body.orderId + '\n' + req.body.status)
                }
                //-------Emit Event--------
                // const eventEmitter = req.app.get('eventEmitter')
                // eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})
                return res.redirect('/api/drug/depot/orders')
            })
        },
        darControl(req, res){
            PharmacistOrders.updateOne({_id: req.body.darNum}, {dar: req.body.dar}, (err, data)=>{
                if(err){
                    //console.log(err)
                    return res.redirect('/api/drug/depot/orders')
                }
                return res.redirect('/api/drug/depot/orders')
            })
        },
        async completedOrder(req, res){
            const ordersCompleted = await PharmacistOrders.find({status: 'completed'}).populate('pharmacistId', '-private_key').exec((err, orders)=>{
                if(req.xhr){
                    res.json(orders)
                }
                else{
                    return  res.render('depot/completed')
                }
         //   res.render('manufacturer/completed', {ordersCompleted: ordersCompleted, moment: moment})
            })
        }
    }
}



module.exports = depotOrderController