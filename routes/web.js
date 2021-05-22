const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/depot/cartController')
const fileController = require('../app/http/controllers/manufacturer/fileController')
const mHomeController = require('../app/http/controllers/manufacturer/mHomeController')
const keyController = require('../app/http/controllers/manufacturer/keyController')
const orderController = require('../app/http/controllers/depot/orderController')
const manufacturerOrderController = require('../app/http/controllers/manufacturer/manufacturerOrderController')
const statusController = require('../app/http/controllers/manufacturer/statusController')
const locationController = require('../app/http/controllers/locationController')
const transactionController = require('../app/http/controllers/transactionController')
const drugController = require('../app/http/controllers/manufacturer/drugController')
const drugStorageController = require('../app/http/controllers/manufacturer/drugStorageController')


//------------------Middlewares---------------
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const manufacturer = require('../app/http/middlewares/manufacturer')
const order = require('../app/models/order')

function initRoutes(app){
    //----------- Depot In-charge Routes---------------
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)  
    app.get('/register', guest, authController().register)
    app.get('/drop', auth, homeController().dropFile)

    app.post('/login', authController().postLogin)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/cart', auth, cartController().cart)
    app.post('/update_cart', cartController().update)
    app.post('/cart/update/drug', cartController().updateCartAgain)
    app.get('/transaction',auth, transactionController().depotTransaction)
    app.get('/transaction/pharmacist',auth, transactionController().pharmacistTransaction)
    app.get('/profiles', auth, homeController().getProfiles)

    //---------------Depot Order Control Routes---------
    app.post('/orders', auth, orderController().store)
    app.get('/depot/orders', auth, orderController().orderControl)
    app.get('/depot/orders/:id', auth, orderController().showStatus)

    //----------------Manufacturer Routes-------------
    app.get('/manufacturer/home', manufacturer, mHomeController().home)
    app.get('/manufacturer/accounts', manufacturer, mHomeController().accounts)
    app.get('/manufacturer/add_user', manufacturer, mHomeController().adduser)
    app.get('/manufacturer/update_user', manufacturer, mHomeController().updateuser)
    app.get('/manufacturer/requests', manufacturer, mHomeController().requests)
    app.get('/manufacturer/generatekey', manufacturer, keyController().key)
    app.post('/manufacturer/generate/qr', keyController().generateQRCode)
    app.get('/manufacturer/drop', manufacturer, homeController().dropManufacturer)
    app.get('/manufacturer/transaction', transactionController().manufacturerTransaction)

    //--------------Manufacturer Control Drugs-----------
    app.get('/manufacturer/drugs',manufacturer,drugController().seeDrugs)
    app.get('/manufacturer/drugs/upload',manufacturer,drugController().addDrugPage)
    app.post('/manufacturer/drugs/upload',drugController().uploadDrugs)
    app.get('/manufacturer/drugs/find', drugController().drugFind)
    app.get('/manufacturer/update_drugs',manufacturer, drugController().updateDrug)
    app.put('/manufacturer/drugs/:id',drugController().drugUpdate)
    app.delete('/manufacturer/drugs/:id',drugController().drugDelete)


    //-------------Manufacturer Personal Drug Control-----------
    app.get('/manufacturer/drugstorage',manufacturer,drugStorageController().drugStorage)
    app.get('/manufacturer/drugstorage/upload',manufacturer, drugStorageController().drugAddStorage)
    app.post('/manufacturer/drugstorage/upload',manufacturer, drugStorageController().drugAddNewStorage)
    app.get('/manufacturer/drugstorage/find', drugStorageController().drugStorageFind)
    app.get('/manufacturer/update_drugstorage',manufacturer, drugStorageController().updateDrugStorage)
    app.put('/manufacturer/drugstorage/:id',drugStorageController().drugStorageUpdate)
    app.delete('/manufacturer/drugstorage/:id',drugStorageController().drugStorageDelete)

    //-----------------Manufacturer Order Control Routes-------------
    app.get('/manufacturer/orders', manufacturer, manufacturerOrderController().index)
    app.get('/manufacturer/orders/find', manufacturerOrderController().orderDrugFind)
    app.get('/manufacturer/update_orders', manufacturer, manufacturerOrderController().updateOrderProduction)
    app.put('/manufacturer/orders/:id', manufacturer, manufacturerOrderController().orderDrugUpdate)
    app.get('/manufacturer/orders/blockchain', manufacturer, manufacturerOrderController().showBlockchainOrder)
    app.post('/manufacturer/order/status', manufacturer, statusController().statusControl)
    app.post('/manufacturer/order/dar', manufacturer, statusController().darControl)
    app.get('/manufacturer/orders/completed', manufacturer, manufacturerOrderController().showCompleted)
    app.get('/manufacturer/orders/completed/blockchain', manufacturer, manufacturerOrderController().showBlockChainCompleted)
   
    app.get('/files/:uuid', fileController().file)
    app.get('/files/download/:uuid', fileController().fileControl)
    
    //----------------Depot In-charge Location Control Routes----------------
    app.get('/:id/location', auth, locationController().location)
    app.post('/locationId/location/role', auth, locationController().locationControl)


}


module.exports = initRoutes