const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    book: { 
        type: Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    stripePaymentId: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'succeeded', 'failed'], 
        default: 'pending' 
    },
    type: {
        type: String,
        enum: ['purchase', 'rental'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
