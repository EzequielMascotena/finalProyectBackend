const mongoose = require('mongoose');
const mongoPaginate = require('mongoose-paginate-v2')

const User = require('./user.model')

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
        enum: ['shoes', 'remeras', 'camperas', 'jeans', 'buzos']
    },
    thumbnail: {
        type: Array,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String,
        default: 'admin',
        validate: {
            validator: async function (value) {
                if (value === 'admin') return true;
                const user = await User.findOne({ email: value });
                return user && user.role === 'premium';
            },
            message: 'El propietario debe ser un usuario premium o "admin".'
        },
        ref: 'users'
    }
}, {
    timestamps: true
});

ProductSchema.pre('save', async function (next) {
    if (this.owner && this.owner !== 'admin') {
        const user = await User.findOne({ email: this.owner });
        if (!user || user.role !== 'premium') {
            return next(new Error('El propietario debe ser un usuario premium.'));
        }
    }
    next();
});

ProductSchema.plugin(mongoPaginate);

const Products = mongoose.model('products', ProductSchema);

module.exports = Products;