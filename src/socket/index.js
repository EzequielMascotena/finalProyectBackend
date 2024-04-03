const ProductController = require('../controllers/ProductController');
const productController = new ProductController();

const ChatServices = require('../services/chatServices');
const chatServices = new ChatServices();


//Socket Server
const socketService = (socket, io) => {
    console.log('New User Connected')

    //productos
    socket.on('addProdInfo', async (data) => {
        try {
            await productController.addProduct(data);
            const updatedProducts = await productController.getProducts();
            socket.emit('prodsToRender', updatedProducts);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('deleteProdInfo', async (data) => {
        try {
            await productController.deleteProduct(data.id);
            const updatedProducts = await productController.getProducts();
            socket.emit('prodsToRender', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });


    //chat
    socket.on('newMenssage', async (msg) => {
        await chatServices.addMsgToDb(msg)
        const chat = await chatServices.getChatFromDb()
        io.sockets.emit('allMsgs', chat)
    })
}

module.exports = socketService