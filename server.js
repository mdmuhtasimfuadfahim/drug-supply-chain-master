const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')


app.get('/', (req, res)=>{
    res.render('about')
})


//---------------Set Template Engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 3040
app.listen(3040, ()=>{
    console.log(`Listening on port ${PORT}`)
})