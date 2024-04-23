const mongoose = require('mongoose');
const config = require('../../config/config')

module.exports = {
    connect: () => {
        return mongoose.connect(process.env.MONGOURL)
            .then(() => {
                console.log('Data Base connected')
            }).catch((err) => {
                console.log(err)
            })
    }
}