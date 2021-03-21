require('dotenv').config()

const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongo')
const flash = require('express-flash')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cors = require('cors')


//------------DataBase Connection----------------
const connectDB = require('./app/config/db')
connectDB()


// -------------- Session Store ----------
let mongoStore = new MongoDbStore({
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    dbName: "supplyChain",
    stringify: false,
})

//--------------Cors------------------
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions))


//---------------Session Config--------------
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000* 60 * 60 *24} //24hours
    //cookie: {maxAge: 1000 * 10} //10 seconds
}))

app.use(flash())
//---------------Log Requests----------------
app.use(morgan('tiny'))

//---------------Body Parser----------------
app.use(bodyparser.urlencoded({ extended : true}))

//---------------Assets----------------
app.use(express.static('public'))
app.use(express.json())

//---------------GLobal Middleware-----------
app.use((req, res, next)=>{
    res.locals.session = req.session
    next()
})

//require('./routes/api')(app)
require('./routes/web')(app)
app.use('/api/drug', require('./routes/api'))
// app.use('/files/download', require('./routes/download'))
// app.use('files', require('./routes/show'))


//---------------Set Template Engine----------------
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


const PORT = process.env.PORT || 3040
app.listen(3040, '0.0.0.0', ()=>{
    console.log(`Listening on port ${PORT}`)
})