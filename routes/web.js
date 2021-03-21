const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/depot/cartController')
const fileController = require('../app/http/controllers/manufacturer/fileController')


function initRoutes(app){
    //----------- Depot In-charge Routes
    app.get('/', homeController().index)
    app.get('/login', authController().login)  
    app.get('/register', authController().register)
    // app.post('/register', authController().postRegister)

    app.get('/cart', cartController().cart)
    app.post('/update_cart', cartController().update)
    
    // app.get('/manufacturer/home', (req, res)=>{
    //     res.render('manufacturer/homeAdmin')
    
    // })

    
    app.get('/manufacturer/home', (req, res)=>{
        res.render('manufacturer/homeMan')
    
    })

    app.get('/manufacturer/accounts', (req, res)=>{
        res.render('manufacturer/userControl/accounts')
    
    })

    app.get('/manufacturer/add_user', (req, res)=>{
        res.render('manufacturer/userControl/add_user')
    
    })

    app.get('/manufacturer/update_user', (req, res)=>{
        res.render('manufacturer/userControl/update_user')
    
    })

    app.get('/drop', (req, res)=>{
        res.render('drop')
    })
    app.get('/files/:uuid', fileController().file)
    app.get('/files/download/:uuid', fileController().fileControl)
    
    
}


module.exports = initRoutes