const passport = require('passport')
const Order = require('../../../models/order')
const moment = require('moment')
const bcrypt = require('bcrypt')
function orderController(){
    return{
        async store(req, res){
            //----------Validate Request----------

            const {email, private_key, address} = req.body
            if(!email || !private_key || !address){
                req.flash('error', 'All Fields are Required')
                req.flash('email', email)
                req.flash('address', address)
                req.flash('private_key', private_key)
                return res.redirect('/cart')
            }

            
                const hashed = await bcrypt.hash(private_key, 10)
                const order = new Order({
                    depotId: req.user._id,
                    sender: "606060b0f87ae52f5ceed7d5",
                    drugs: req.session.cart.drugs,
                    email,
                    private_key: hashed,
                    address   
                })

                // const location = new Location({
                //     drugs: req.session.cart.drugs,
                //     sender: "606060b0f87ae52f5ceed7d5",
                //     receiver: req.user._id,
                // })
    
    
                console.log(order)

               // console.log(location)
                
               // const responsive= await location.save()
                order.save().then(result =>{
                    Order.populate(result, {path: 'depotId'}, (err, placedOrder)=>{
                        
                        req.flash('success', 'Order Placed Successfully')
                        delete req.session.cart
                        //-------Emit Event--------
                       const eventEmitter = req.app.get('eventEmitter')
                       eventEmitter.emit('orderPlaced', placedOrder)
                        
                        return res.redirect('/depot/orders')
                     })
                    }).catch(err=>{
                    req.flash('error', 'Something Went Wrong')
                    return res.redirect('/cart')
                })
           
           // console.log(req.body)
        },
        async orderControl(req, res){
            const orders = await Order.find({depotId: req.user._id},
                 null,
                { sort: { 'createdAt': -1 } } ).populate('sender', '-private_key')
                res.header('Cache-Control', 'no-store')
            res.render('depot/orders', {orders: orders, moment: moment })
            // console.log(orders)
        },
        async showStatus(req, res){
            const order = await Order.findById(req.params.id)
            //const location = await Location.find()
            
            //---------------Authorize User------------
            if(req.user._id.toString() === order.depotId.toString()){
               
                // console.log(order + '\n' + location)
                //location: location,
                return res.render('depot/singleOrder', { order: order})
                
            }
            return res.redirect('/')
            
              
        }
    }
}


module.exports = orderController