const Chat = require('../dao/mongoDB/models/messages.model')

class ChatServices {
    constructor(path) {
        this.path = path;
    }

    //obtener msgs
    async getChatFromDb() {
        try {
            let chat = await Chat.find().lean()
            return (chat)
        } catch (err) {
            return (`Error al buscar los mensajes, ${err}`)
        }
    }

    //agregar msgs
    async addMsgToDb(msg) {
        try {
            await Chat.create(msg)
            return (true)
        } catch (err) {
            console.log(err)
            return { error: 'Error al agregar MSJ a BD: ' + err.message }
        }
    }
}

module.exports = ChatServices
