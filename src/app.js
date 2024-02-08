const express = require('express');
const Database = require ('./dao/db/db.js');
const handlebars = require('express-handlebars');
const routerHome = require('./routes/home.route.js');
const routerProd = require('./routes/products.route.js');
const routerCart = require('./routes/carts.route.js');
const http = require('http')
const { Server } = require('socket.io')

const PORT = 8080 || process.env.PORT
const app = express()

const ProductManager = require('./dao/fileSystem/ProductManager.js');
const productManager = new ProductManager('./products.json')



//Server HTTP
const server = http.createServer(app)

//Public
app.use(express.static(__dirname + '/public'))

//Motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + "/views")

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/api', routerHome)
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)

//Socket
const io = new Server(server)
io.on('connection', (socket) => {
    console.log('New User Connected')
    socket.on('addProdInfo', async (data) => {
        try {
            await productManager.addProduct(data);
            const updatedProducts = await productManager.getProducts();
            socket.emit('prodsToRender', updatedProducts);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('deleteProdInfo', async (data) => {
        try {
            await productManager.deleteProduct(data.id);   
            const updatedProducts = await productManager.getProducts();
            socket.emit('prodsToRender', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
})

server.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
    Database.connect()
})