const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: {
        type: Array
    }
})

const Cart = mongoose.model ('carts', CartSchema)

module.exports = Cart