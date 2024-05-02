const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
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
    }, {
    strict: false
});

const Ticket = mongoose.model('tickets', TicketSchema);

module.exports = Ticket;
