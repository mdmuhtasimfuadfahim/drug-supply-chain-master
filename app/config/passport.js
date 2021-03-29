const passport = require('passport')
 ,LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'private_key' }, async (email, private_key, done) => {
        // Login
        // Check if email exists
        const user = await User.findOne({ email: email })
        if(!user) {
            return done(null, false, { message: 'No User with this Email' })
        }

        
        bcrypt.compare(private_key, user.private_key).then(match => {
            if(match) {
                return done(null, user, { message: 'Logged in Succesfully' })
            }
            return done(null, false, { message: 'Wrong Username or Private Key' })
        }).catch(err => {
            return done(null, false, { message: 'Something is Going Wrong' })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init