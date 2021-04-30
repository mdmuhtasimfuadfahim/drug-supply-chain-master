const PharmacistOrders = require('../../../models/phrorder')

function porderController(){
    return{
        async pharmastore(req, res){
            //----------Validate Request----------

            const {drugs, address} = req.body
            const pharmacistOrder = new PharmacistOrders({
                pharmacistId: "60879a2bc00cb31b50430edc",
                senderId: "605a2b5cf72ab32ec8c3aee9",
                drugs: drugs,
                address   
            })
            console.log(pharmacistOrder)

            pharmacistOrder.save().then(pharmacistOrder=>{
                PharmacistOrders.populate(pharmacistOrder, {path: 'pharmacistId'}, (err, placedOrder)=>{
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('newOrderPlaced', placedOrder)
                    res.status(200).send(JSON.stringify(placedOrder))
                })  
            }).catch(err =>{
                console.log(err)
            })
        },
        showOrderList(req, res){
            if(req.query.id){
                const id = req.query.id
                PharmacistOrders.findById(id).then(PharmacistOrders =>{
                    if(!PharmacistOrders){
                        res.status(404).send({ message: `Not Found Any USer with this ${id}`})
                    }else{
                        res.send(PharmacistOrders)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving User with this ${id}`})
                })
            } else{
                PharmacistOrders.find().populate('senderId', '-private_key').populate('pharmacistId', '-private_key').then(PharmacistOrders =>{
                    res.send(PharmacistOrders)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Sending Drugs Information' })
                })
            }
        },
        async showTracking(req, res){
            const PharmacistOrder = await PharmacistOrders.findById(req.params.id)
            // if(req.user.id.toString() === PharmacistOrder.pharmacistId.toString()){
               console.log(PharmacistOrder)
               res.send(PharmacistOrder)
                
            // }
        }
    }
}


module.exports = porderController