const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authenticate = require('../middlewares/authenticate');
const { checkBookAccess } = require('../middlewares/checkBookAccess'); 

router.post('/:bookId', authenticate, checkBookAccess, commentController.createComment);
router.get('/:commentId', authenticate, commentController.getCommentById);
router.get('/', authenticate, commentController.getAllComments);
router.put('/:commentId', authenticate, checkBookAccess, commentController.updateCommentById); 
router.delete('/:commentId', authenticate, checkBookAccess, commentController.deleteCommentById); 

module.exports = router;
