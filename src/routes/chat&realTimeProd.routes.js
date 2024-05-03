const { Router } = require('express');
const handlePolicies = require('../utils/middlewares')


//FS
//const ProductManager = require('../dao/fileSystem/ProductManager');
//const productManager = new ProductManager('./products.json')

//Mongoose
const { obtAllProds, showLiveProds } = require('../services/realTimeProdServices')
const ChatController = require('../controllers/ChatController')
const ProductController = require('../controllers/ProductController');

const chatController = new ChatController()
const productController = new ProductController();

const router = new Router()

router.get('/', obtAllProds)
//productos con socket
router.get('/realtimeproducts', handlePolicies('admin'), showLiveProds)

//chat con socket
router.get('/chat', handlePolicies('user'), chatController.getChat)

// mocking Products
router.get("/mockingproducts", productController.getMockingProducts)


module.exports = router;