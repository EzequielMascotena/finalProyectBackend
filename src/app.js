const express = require('express');
const routerProd = require('./routes/products.route.js');
const routerCart = require ('./routes/carts.route.js')
const path = require('path');

const PORT= 8080
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Routes
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)

app.use('/static', express.static(path.join(__dirname, '/public')))

app.listen(PORT, ()=> {
    console.log (`Server run on port ${PORT}`)
})