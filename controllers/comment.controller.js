const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment.model");
const Book = require("../models/book.model");

exports.checkBookAccess = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        if (req.user.role.includes('admin')) {
            return next();
        }

        const hasAccess = book.purchasers.some(p => p.user.toString() === req.user._id.toString()) ||
            book.renters.some(r => r.user.toString() === req.user._id.toString());

        if (hasAccess) {
            return next();
        }

        res.status(403).json({ message: "Access denied" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.createComment = asyncHandler(async (req, res) => {
    try {
        const { description } = req.body;
        const newComment = new Comment({
            description,
            author: req.user._id,
            book: req.params.bookId
        });
        await newComment.save();
        res.status(201).json({ message: "New Comment Created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.getCommentById = asyncHandler(async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate("author", "username").populate("book", "title");
        if (!comment) {
            return res.status(404).json({ message: "Comment not found!" });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.getAllComments = asyncHandler(async (req, res) => {
    try {
        const comments = await Comment.find().populate("author", "username").populate("book", "title");
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.updateCommentById = asyncHandler(async (req, res) => {
    try {
        const { description } = req.body;
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found!" });
        }

        if (req.user.role.includes('admin') || comment.author.toString() === req.user._id.toString()) {
            const updateFields = { description };
            const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, updateFields, { new: true });
            res.json(updatedComment);
        } else {
            res.status(403).json({ error: "Access denied" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.deleteCommentById = asyncHandler(async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found!" });
        }

        if (req.user.role.includes('admin') || comment.author.toString() === req.user._id.toString()) {
            await Comment.findByIdAndDelete(req.params.commentId);
            res.json({ message: "Comment deleted successfully" });
        } else {
            res.status(403).json({ error: "Access denied" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
