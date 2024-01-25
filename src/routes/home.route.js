const { Router } = require('express');
const ProductManager = require('../ProductManager');

const productManager = new ProductManager('./products.json')

const router = new Router()

async function obtenerProductos() {
    return await productManager.getProducts();
}

router.get('/', async (req, res) => {
    const products = await obtenerProductos();
    const datos = { products };
    res.render('home.handlebars', datos)
})

//con socket
router.get('/realtimeproducts', async (req, res) => {
    const products = await obtenerProductos();
    const datos = { products };
    res.render('realTimeProducts.handlebars', datos)
})



module.exports = router;