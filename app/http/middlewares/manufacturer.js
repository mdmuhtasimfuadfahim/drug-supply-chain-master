function manufacturer(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'Manufacturer'){
        return next()
    }

    return res.redirect('/')
}


module.exports = manufacturer