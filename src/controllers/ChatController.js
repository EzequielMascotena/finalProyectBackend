const ChatServices = require('../services/chatServices');
const chatservices = new ChatServices();


async function obtenerMsgs() {
    try {
        return await chatservices.getChatFromDb();
    } catch (err) {
        return `error al obtener los Mensajes de la BD: ${err}`
    }
}

class ChatController {
    constructor(path) {
        this.path = path;
    }

    //obtener msgs
    async getChat(req, res) {
        try {
            const chat = await obtenerMsgs();
            const datos = { chat };
            res.render('chat.handlebars', datos)
        } catch (err) {
            return `error al intentar obtener los Mensajes: ${err}`
        }
    }
}

module.exports = ChatController
