const asyncHandler = require("express-async-handler");
const Book = require("../models/book.model");

exports.createBook = asyncHandler(async (req, res) => {
    try {
        const { title, description, publishedDate, price, rentalPrice, availableForPurchase, availableForRental } = req.body;
        const newBook = new Book({
            title,
            description,
            publishedDate,
            price,
            rentalPrice,
            availableForPurchase,
            availableForRental,
            author: req.user._id
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.getAllBooks = asyncHandler(async (req, res) => {
    try {
        const books = await Book.find().select('title price rentalPrice author').populate("author", "username");
        res.json(books);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

exports.getBookById = asyncHandler(async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).select('title price author').populate("author", "username");
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.updateBookById = asyncHandler(async (req, res) => {
    try {
        const { title, description, publishedDate, price, rentalPrice, availableForPurchase, availableForRental } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (req.user.role.includes('admin') || book.author.toString() === req.user._id.toString()) {
            const updateFields = { title, description, publishedDate, price, rentalPrice, availableForPurchase, availableForRental };

            if (req.user.role.includes('admin')) {
                if ('author' in req.body) {
                    delete updateFields.author;
                }
            }

            const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateFields, { new: true });
            res.json(updatedBook);
        } else {
            res.status(403).json({ error: "Access denied" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.deleteBookById = asyncHandler(async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (req.user.role.includes('admin') || book.author.toString() === req.user._id.toString()) {
            await Book.findByIdAndDelete(req.params.id);
            res.json({ message: "Book deleted successfully" });
        } else {
            res.status(403).json({ error: "Access denied" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.getBookContent = asyncHandler(async (req, res) => {
    try {
        const bookId = req.body.bookId || req.params.id;

        const book = await Book.findById(bookId)
            .populate('purchasers.user', 'username')
            .populate('renters.user', 'username');

        if (!book) {
            console.log(`Book with ID ${bookId} not found.`);
            return res.status(404).json({ message: 'Book not found' });
        }

        console.log(`Book data: ${JSON.stringify(book)}`);
        console.log(`User ID: ${req.user._id}`);

        const userPurchased = book.purchasers.some(purchase => purchase.user._id.equals(req.user._id));
        console.log(`User purchased: ${userPurchased}`);

        const userRented = book.renters.some(rental => rental.user._id.equals(req.user._id));
        console.log(`User rented: ${userRented}`);

        const isAdmin = req.user.role.includes('admin');
        console.log(`Is admin: ${isAdmin}`);

        if (isAdmin || userPurchased || userRented) {
            if (userRented) {
                const rental = book.renters.find(r => r.user._id.equals(req.user._id));
                const currentDate = new Date();

                if (currentDate > rental.rentalEndDate) {
                    return res.status(403).json({ message: 'Rental period has expired' });
                }
            }

            res.json({ message: 'Access granted', book });
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});



