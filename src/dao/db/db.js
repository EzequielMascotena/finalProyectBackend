const mongoose = require('mongoose');

module.exports = {
    connect: ()=>{
        return mongoose.connect("mongodb+srv://ezequielmascotena:ez123456@coderproject.gsslbll.mongodb.net/ecommerce")
        .then (()=> {
            console.log('Data Base connected')
        }).catch ((err)=>{
            console.log(err)
        })
    }
}