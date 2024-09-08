const asyncHandler = require('express-async-handler');
const Book = require('../models/book.model');
const Payment = require('../models/payment.model');
const stripe = require('../config/stripe');

exports.createPaymentIntent = asyncHandler(async (req, res) => {
    try {
        const { bookId, type } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        let amount = 0;

        if (type === 'purchase' && book.availableForPurchase) {
            amount = book.price * 100;
        } else if (type === 'rental' && book.availableForRental) {
            amount = book.rentalPrice * 100;
        } else {
            return res.status(400).json({ message: 'Book not available for this type of transaction' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.json({ clientSecret: paymentIntent.client_secret , paymentId: paymentIntent.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.createPayment = asyncHandler(async (req, res) => {
    try {
        const { bookId, stripePaymentId, amount, status, type } = req.body;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const payment = new Payment({
            book: bookId,
            user: req.user._id,
            amount,
            stripePaymentId,
            status,
            type
        });

        await payment.save();

        if (type === 'purchase') {
            book.purchasers.push({
                user: req.user._id,
                purchaseDate: new Date()
            });
        } else if (type === 'rental') {
            const rentalDuration = 7 * 24 * 60 * 60 * 1000;
            const rentalEndDate = new Date(Date.now() + rentalDuration);
            book.renters.push({
                user: req.user._id,
                rentalDate: new Date(),
                rentalEndDate
            });
        }

        await book.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

