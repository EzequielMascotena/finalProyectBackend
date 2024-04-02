const { Router } = require('express');
//FS
//const ProductManager = require('../dao/fileSystem/ProductManager');
//const productManager = new ProductManager('./products.json')

//Mongoose
const ProductManagerMongo = require('../controllers/managers/ProductManager');
const productManager = new ProductManagerMongo();

const ChatManagerMongo = require('../controllers/managers/ChatManager');
const chatManager = new ChatManagerMongo();

const router = new Router()

async function obtenerProductos() {
    try {
        return await productManager.getProducts();
    } catch (err) {
        return `error al obtener Productos: ${err}`
    }
}

router.get('/', async (req, res) => {
    try {
        const products = await obtenerProductos();
        const formattedData = products.docs.map(doc => {
            return {
                _id: doc._id,
                title: doc.title,
                description: doc.description,
                price: doc.price,
                stock: doc.stock,
                category: doc.category
            };
        });
        const datos = formattedData
        res.render('tools.handlebars', datos)
    } catch (err) {
        return `error al obtener Productos: ${err}`
    }
})

//productos con socket
router.get('/realtimeproducts', async (req, res) => {
    const products = await obtenerProductos();
        const formattedData = products.docs.map(doc => {
            return {
                _id: doc._id,
                title: doc.title,
                description: doc.description,
                price: doc.price,
                stock: doc.stock,
                category: doc.category
            };
        });
        const datos = formattedData
    res.render('realTimeProducts.handlebars', datos)
})

//chat con socket
async function obtenerMsgs() {
    try {
        return await chatManager.getChat();
    } catch (err) {
        return `error al obtener los Mensajes de la BD: ${err}`
    }
}

router.get('/chat', async (req, res) => {
    try {
        const chat = await obtenerMsgs();
        const datos = { chat };
        res.render('chat.handlebars', datos)
    } catch (err) {
        return `error al intentar obtener los Mensajes: ${err}`
    }
})



module.exports = router;