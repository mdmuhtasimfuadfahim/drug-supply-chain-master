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

            if(email === req.user.email && address == req.user.address){
                const hashed = await bcrypt.hash(private_key, 10)
                const order = new Order({
                    depotId: req.user._id,
                    drugs: req.session.cart.drugs,
                    email,
                    private_key: hashed,
                    address   
                })
    
                console.log(order)
                order.save().then(result =>{
                     req.flash('success', 'Order Placed Successfully')
                     delete req.session.cart
                     return res.redirect('/depot/orders')
                    }).catch(err=>{
                    req.flash('error', 'Something Went Wrong')
                    return res.redirect('/cart')
                })
            }
            else{
                return res.json({'error': 'Something is Going Wrong'})
            }
           // console.log(req.body)
        },
        async orderControl(req, res){
            const orders = await Order.find({depotId: req.user._id},
                 null,
                { sort: { 'createdAt': -1 } } )
                res.header('Cache-Control', 'no-store')
            res.render('depot/orders', {orders: orders, moment: moment })
            // console.log(orders)
        }
    }
}


module.exports = orderController