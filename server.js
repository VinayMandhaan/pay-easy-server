const express = require('express')
const app = express();
const path  = require('path')
var cors = require('cors');
const engines = require("consolidate");


app.engine('ejs', require('ejs').__express)
app.set("views", path.join(__dirname,'templates'))
app.set("view engine", "ejs");
app.use(cors())
app.options('*', cors())

const PORT = process.env.PORT || 5000

app.use(express.json({
    extended: false
}))

app.get('/',(req,res)=>{
    res.send('API Running')
})

app.use('/api/stripe',require('./routes/api/stripe'))
app.use('/api/paypal',require('./routes/api/paypal'))

app.listen(PORT, ()=>{
    console.log(`Server Started on Port ${PORT}`)
})