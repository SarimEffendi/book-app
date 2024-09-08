const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const verifyPayment = require('../middlewares/verifyPayment');

router.post('/', authenticate, authorize(['author', 'admin']), bookController.createBook);
router.get('/', authenticate, bookController.getAllBooks);
router.get('/:id', authenticate, bookController.getBookById);
router.put('/:id', authenticate, bookController.updateBookById);
router.delete('/:id', authenticate, bookController.deleteBookById);


router.post('/access/purchased', authenticate, verifyPayment, bookController.getBookContent);
router.post('/access/rented', authenticate, verifyPayment, bookController.getBookContent);

module.exports = router;
