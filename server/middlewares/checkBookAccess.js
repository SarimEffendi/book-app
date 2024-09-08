const asyncHandler = require("express-async-handler");
const Book = require("../models/book.model");

exports.checkBookAccess = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found!xsxsx" });
        }

        if (req.user.role.includes('admin')) {
            return next();
        }

        const hasAccess = book.purchasers.some(p => p.user.toString() === req.user._id.toString()) ||
            book.renters.some(r => r.user.toString() === req.user._id.toString());

        if (hasAccess) {
            return next();
        }

        res.status(403).json({ message: "Access denied. Please Buy the Book for access!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
