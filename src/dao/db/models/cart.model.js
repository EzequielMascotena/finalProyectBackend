const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref : 'products'
                },
                quantity : {
                    type: Number
                }
            }
        ]
    }
})

const Cart = mongoose.model ('carts', CartSchema)

module.exports = Cart