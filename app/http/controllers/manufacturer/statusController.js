const Order = require('../../../models/order')

function statusController(){
    return{
        statusControl(req, res){
            Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data)=>{
                if(err){
                    return res.redirect('/manufacturer/orders')
                }
                //-------Emit Event--------
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})
                return res.redirect('/manufacturer/orders')
            })
        }
    }
}

module.exports = statusController