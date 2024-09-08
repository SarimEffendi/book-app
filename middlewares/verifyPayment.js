const Payment = require('../models/payment.model');
const asyncHandler = require('express-async-handler');

const verifyPayment = asyncHandler(async (req, res, next) => {
    try {
        const { paymentId, bookId } = req.body;

        if (!paymentId || !bookId) {
            return res.status(400).json({ message: 'Payment ID and Book ID are required' });
        }

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.status !== 'succeeded') {
            return res.status(400).json({ message: 'Payment has not been confirmed' });
        }

        if (payment.book.toString() !== bookId) {
            return res.status(400).json({ message: 'Payment does not match the requested book' });
        }

        if (payment.type === 'rental') {
            const rentalDuration = 7 * 24 * 60 * 60 * 1000; 
            const rentalEnd = new Date(payment.createdAt).getTime() + rentalDuration;
            const currentTime = new Date().getTime();

            if (currentTime > rentalEnd) {
                return res.status(403).json({ message: 'Rental period has expired' });
            }
        }

        req.payment = payment;
        console.log(payment);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = verifyPayment;
