const { Router } = require('express');
//FS
//const ProductManager = require('../dao/fileSystem/ProductManager');
//const productManager = new ProductManager('./products.json')

//Mongoose
const ProductManagerMongo = require('../dao/db/managers/ProductManager');
const productManager= new ProductManagerMongo();

const router = new Router()

async function obtenerProductos() {
    try{
        return await productManager.getProducts();
    } catch (err){
        return `error al obtener Productos: ${err}`
    }
}

router.get('/', async (req, res) => {
    try{
        const products = await obtenerProductos();
        const datos = { products };
        res.render('home.handlebars', datos)
    } catch (err) {
        return `error al obtener Productos: ${err}`
    }
})

//productos con socket
router.get('/realtimeproducts', async (req, res) => {
    const products = await obtenerProductos();
    const datos = { products };
    res.render('realTimeProducts.handlebars', datos)
})

//chat con socket
router.get('/chat', async (req, res)=>{
    res.render('chat.handlebars', {})
})



module.exports = router;