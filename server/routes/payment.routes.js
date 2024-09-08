const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const verifyPayment = require('../middlewares/verifyPayment');
const authenticate = require('../middlewares/authenticate');

router.post('/create-payment-intent',authenticate, paymentController.createPaymentIntent);
router.post('/create-payment',authenticate, paymentController.createPayment);

module.exports = router;
