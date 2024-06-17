const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: "user"
    },
    documents: [
        {
            name: {
                type: String
            },
            url: {
                type: String
            }
        }
    ],
    lastConnection: {
        type: Date,
    }
},
    {
        timestamps: true,
        strict: false
    });

const User = mongoose.model("users", userSchema);

module.exports = User