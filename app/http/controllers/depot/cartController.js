const { json } = require('express')

function cartController(){
    return{
        cart(req, res){
            res.render('depot/cart')
        
        },
        update(req, res){
            if(!req.session.cart){
                req.session.cart = {
                  drugs: {},
                  totalQty: 0,
                  totalPrice: 0
                }
            }
            let cart = req.session.cart
        //    console.log(req.body)
            if(!cart.drugs[req.body._id]){
                cart.drugs[req.body._id]={
                    drug: req.body,
                    qty: 1
                }
  
                cart.totalQty = cart.totalQty + 1
                // console.log(cart.totalQty)
                cart.totalPrice = cart.totalPrice + req.body.price
            } else{
                cart.drugs[req.body._id].qty = cart.drugs[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
           return res.json({totalQty: req.session.cart.totalQty})
        },
        updateCartAgain(req, res){
            const quantity = req.body.quantity
            console.log(quantity)
            cart.drugs[req.body._id].qty = cart.drugs[req.body._id].qty + req.body.qty
            cart.totalQty = cart.totalQty + req.body.qty
            cart.totalPrice = cart.totalPrice + req.body.price

            return res.json({totalQty: req.session.cart.totalQty})
        }
    }
}


module.exports = cartController