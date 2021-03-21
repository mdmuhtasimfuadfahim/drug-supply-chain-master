function authController () {
    return{
        login (req, res){
            res.render('auth/login')
        
        },
        register(req, res){
            res.render('auth/register')
        
        },
        // postRegister(req, res){
        //     const { image, name, email, position, address } = req.body
        // }
    }
}


module.exports = authController