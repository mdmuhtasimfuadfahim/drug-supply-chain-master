//const drugs = require('../router/models/drug')

const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../app/models/file');
const Drug = require('../app/models/drug');
const User = require('../app/models/user')
const { v4: uuid4 } = require('uuid');
const { truncate } = require('fs');
const { Result } = require('postcss');
const mHomeController = require('../app/http/controllers/manufacturer/mHomeController')
const fileController = require('../app/http/controllers/manufacturer/fileController')
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
// const { restart } = require('nodemon');
// const { parse } = require('dotenv/types');
// const { response } = require('express');




//-----------------JSON Post and Get Route-------------
router.post('/', homeController().passDrug)
router.get('/', homeController().passgetDrug)


// router.post('/login', authController().postAppLogin)


//-----------------File Upload Router-------------
router.post('/files', fileController().fileUploader)

router.post('/files/send', fileController().fileSender)

//--------------CURD Operations-----------------
router.post('/manufacturer/users', mHomeController().postAdduser)
router.get('/manufacturer/users', mHomeController().postFind)
router.put('/manufacturer/users/:id', mHomeController().postUpdateuser)
router.delete('/manufacturer/users/:id', mHomeController().deleteUser)

module.exports = router