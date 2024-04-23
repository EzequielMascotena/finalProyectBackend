const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    products: {
        type: [
            {
                code: {
                    type: String,
                    unique: true,
                    required: true
                },
                purchase_datetime: {
                    type: Date,
                    default: Date.now
                },
                amount: {
                    type: Number,
                    required: true
                },
                purchaser: {
                    type: String,
                    required: true
                }
            },
            {
                timestamps: true,
                strict: false
            }
        ]
    }
})

const Ticket = mongoose.model('ticket', TicketSchema)

module.exports = Ticket