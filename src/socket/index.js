


const ProductManagerMongo = require('../controllers/ProductController');
const productManager = new ProductManagerMongo();

const ChatManagerMongo = require('../controllers/managers/ChatManager');
const chatManager = new ChatManagerMongo();


//Socket Server
const socketService = (socket, io) => {
    console.log('New User Connected')

    //productos
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


    //chat
    socket.on('newMenssage', async (msg) => {
        await chatManager.addMsg(msg)
        const chat = await chatManager.getChat()
        io.sockets.emit('allMsgs', chat)
    })
}

module.exports = socketService