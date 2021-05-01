const passport = require('passport')
const Request = require('../../models/request')
// const user = require('../../models/user')
const User = require('../../models/user')
const path = require('path')
const multer = require('multer')
const bcrypt = require('bcrypt')
// const { v4: uuid4 } = require('uuid')
const fs = require('fs')

//-----------------File Upload Router-------------
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/img'),
    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})


let upload = multer({
    storage,
}).single('image')

// var type = upload.single('image')



function authController () {
    const _getRedirectUrl = (req) =>{
        return req.user.role === 'Manufacturer' ? '/manufacturer/orders' : '/depot/orders'
    }
    return{
        login (req, res){
            res.render('auth/login')
        
        },
        async postLogin(req, res, next){
            // const users = await User.find()
            // console.log(users)
            const { email, private_key } = req.body
            
            
            //---------Validate Request-----------
            if(!email || !private_key){

                req.flash('error', 'All Fields are Required for Login')
                return res.redirect('/login')
            }
            else {
                passport.authenticate('local', (err, user, info)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    if(!user){
                        req.flash('error', info.message)
                        return res.redirect('/login')
                    }
                    req.logIn(user, (err)=>{
                        if(err){
                            req.flash('error', info.message)
                            return next(err)
                        }
                        if(req.user.role === 'Manufacturer' || req.user.role === 'Depot In-charge'){
                            return res.redirect(_getRedirectUrl(req))
                        }
                        else{
                            res.status(200).send(JSON.stringify(user))
                        }
                       
                    })
                 })(req, res, next)
            }
        
        },
        register(req, res){
            res.render('auth/register')
        
           },

        postRegister(req, res){
           upload(req, res, (err) =>{
            const { name, email, phone, role, address } = req.body

            if(err){
                return res.status(500).send({ error: err.message})
            }

            if(!req.file){
                return res.json({ error: 'Somthing Went Wrong'})
            }
            
            //---------Validate Request-----------
            if(!name || !email || !phone || !role ||!address){
               req.flash('error', 'All Fields are Required for Registration')
               //req.flash('image', image)
               req.flash('name', name)
               req.flash('email', email)
               req.flash('phone', phone)
               req.flash('role', role)
               req.flash('address', address)
               return res.redirect('/register')
            }

            //----------Check if Email Exists-----------
            Request.exists({email: email}, (err, result)=>{
                if(result){
                    req.flash('error', 'This Email is Taken')
                    // req.flash('image', image)
                    req.flash('name', name)
                    req.flash('email', email)
                    req.flash('phone', phone)
                    req.flash('address', address)
                    return res.redirect('/register')
                }
            })

           // ----------Check if Phone Number Exists-----------
            Request.exists({phone: phone}, (err, result)=>{
                if(result){
                    req.flash('error', 'This Contact is Already Exists')
                       // req.flash('image', image)
                    req.flash('name', name)
                    req.flash('email', email)
                    req.flash('phone', phone)
                    req.flash('address', address)
                    return res.redirect('/register')
                }
            })
            

            //-------------Store into Database--------
            const request = new Request({
               image: '/img/' + req.file.filename,
               name: name,
               email: email,
               phone: phone,
               role: role,
               address: address
            })

            console.log(request)
    
            request.save().then(request=>{
                req.flash('success', 'Your Request is Taken')
                return res.redirect('/register')
            }).catch(err =>{
                req.flash('error', 'Something is Going Wrong')
                return res.redirect('/register')
            })                   
        })
       },
    //    postAppLogin(req, res){
    //     const query = {
    //         email: req.body.email, 
    //         private_key: req.body.private_key
    //     }

    //     User.findOne(query, (err, result) => {

    //         if (result != null) {

    //             const objToSend = {
    //                 email: result.email,
    //                 private_key: result.private_key
    //             }

    //             res.status(200).send(JSON.stringify(objToSend))

    //         } else {
    //             res.status(404).send()
    //         }

    //     })
    //    },
       logout(req, res){
           req.logout()
           return res.redirect('/login')
       }
        
    }
}


module.exports = authController