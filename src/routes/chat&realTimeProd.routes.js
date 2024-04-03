const { Router } = require('express');
//FS
//const ProductManager = require('../dao/fileSystem/ProductManager');
//const productManager = new ProductManager('./products.json')

//Mongoose
const { obtAllProds, showLiveProds } = require('../services/realTimeProdServices')
const ChatController = require('../controllers/ChatController')

const chatController = new ChatController()

const router = new Router()

router.get('/', obtAllProds)
//productos con socket
router.get('/realtimeproducts', showLiveProds)

//chat con socket
router.get('/chat', chatController.getChat)



module.exports = router;