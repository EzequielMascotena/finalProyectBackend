const mongoose = require('mongoose');
const mongoPaginate = require ('mongoose-paginate-v2')

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        //enum: ['','',''] 
    },
    thumbnail: {
        type: Array,
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
})

ProductSchema.plugin(mongoPaginate)

const Products = mongoose.model ('products', ProductSchema)

module.exports = Products