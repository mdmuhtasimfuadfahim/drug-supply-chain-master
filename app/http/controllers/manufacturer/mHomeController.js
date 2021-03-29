const Request = require('../../../models/request')
const User = require('../../../models/user')
const bcrypt = require('bcrypt')
const axios = require('axios')
const { response } = require('express')

function mHomeController(){
    return{
        async home (req, res){
            const users = await User.find()
            res.render('manufacturer/homeMan', {users: users})
            //console.log(users)
        },
        async accounts (req, res){
            const users = await User.find()
            res.render('manufacturer/userControl/accounts', {users: users})
           // console.log(users)
        },
        async requests (req, res){
            const requests = await Request.find()
            res.render('manufacturer/userControl/requests', {requests: requests})
           // console.log(requests)
        },
        adduser (req, res){
            res.render('manufacturer/userControl/add_user')
        },
        updateuser(req, res){
            // const user = await User.find()
            // const id = await User.findById()
            // const response = req.query.id
            axios.get(`${process.env.APP_BASE_URL}/api/drug/manufacturer/users`, { params : { id : req.query.id }}).then(function(userData){
         //  console.log(userData.data)
            res.render('manufacturer/userControl/update_user', { user : userData.data})
           }).catch(err =>{
               res.send(err)
           })
        },
        async postAdduser (req, res){
            const { name, image, email, phone, role, address, private_key, public_key } = req.body
        
                        
            //---------Validate Request-----------
            if(!name || !image ||  !email || !phone || !address || !private_key || !public_key){
                req.flash('error', 'All Fields are Required to Add User')
                req.flash('name', name)
                req.flash('image', image)
                req.flash('email', email)
                req.flash('phone', phone)
                req.flash('address', address)
                req.flash('private_key', private_key)
                req.flash('public_key', public_key)
                return res.redirect('/manufacturer/add_user')
            }
        
            //----------Check if Email Exists-----------
            User.exists({email: email}, (err, result)=>{
                if(result){
                    req.flash('error', 'This Email is Taken')
                    req.flash('name', name)
                    req.flash('image', image)
                    req.flash('email', email)
                    req.flash('phone', phone)
                    req.flash('address', address)
                    req.flash('private_key', private_key)
                    req.flash('public_key', public_key)
                    return res.redirect('/manufacturer/add_user')
                }
            })
        
        
            //----------Check if Email Exists-----------
            User.exists({phone: phone}, (err, result)=>{
                if(result){
                req.flash('error', 'This Contact is Already Exists')
                req.flash('name', name)
                req.flash('image', image)
                req.flash('email', email)
                req.flash('phone', phone)
                req.flash('address', address)
                req.flash('private_key', private_key)
                req.flash('public_key', public_key)
                return res.redirect('/manufacturer/add_user')
                }
            })
        
            const hashedPrivateKey = await bcrypt.hash(private_key, 10)
            //------------Create a User--------
            const user = new User({
                name: name,
                image: image,
                email: email,
                phone: phone,
                role: role,
                address: address,
                private_key: hashedPrivateKey,
                public_key: public_key
            })
        
            user.save().then((user)=>{
                return res.redirect('/manufacturer/accounts')
            }).catch(err =>{
                req.flash('error', 'Something is Going Wrong')
                return res.redirect('/manufacturer/add_user')
            })
        
            // console.log(req.body)
            
        },


        postFind(req, res){

            if(req.query.id){
                const id = req.query.id
                User.findById(id).then(user =>{
                    if(!user){
                        res.status(404).send({ message: `Not Found Any USer with this ${id}`})
                    }else{
                        res.send(user)
                    }
                }).catch(err =>{
                    res.status(500).send({ message: `Error While Retriving User with this ${id}`})
                })
            }
            else{
                User.find().then(user =>{
                    res.send(user)
                }).catch(err =>{
                    res.status(500).send({ message: err.message || 'Error Occurred While Retriving Users Information' })
                })
            }
        },

        postUpdateuser(req, res){
            if(!req.body){
                return res.status(400).send({ message: 'Data to Update can not be Empty'})
            }

            const id = req.params.id
            User.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(user =>{
                if(!user){
                    res.status(404).send({ message: `Cannot Update User with ${id}. Maybe User not Found`})
                }else{
                    res.send(user)
                }
            }).catch(err =>{
                res.status(500).send({ message: 'Error in Updating User'})
            })
        },

        deleteUser(req, res){
            const id = req.params.id

            User.findByIdAndDelete(id).then(user =>{
                if(!user){
                    res.status(404).send({ message: `Cannot Delete User with ${id}. Maybe Id is not Correct`})
                }
                else{
                    res.send({ message: 'User was Deleted Successfully'})
                }
            }).catch(err =>{
                res.status(500).send({ message: `Cound not Delete User with this ${id}}`})
            })
        }


    }
}


module.exports = mHomeController