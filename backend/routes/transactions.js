const express = require('express');
const router = express.Router();
const Transaction = require('../models/TransactionModel');
const Book = require('../models/BookModel');

// Borrow
router.post('/borrow', async (req, res) => {
  const { bookId, memberId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7-day loan

    const transaction = await new Transaction({ book: bookId, member: memberId, dueDate }).save();

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return
router.post('/return/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('book');
    if (!transaction || transaction.status === 'returned') {
      return res.status(400).json({ message: 'Invalid transaction' });
    }

    transaction.returnDate = new Date();
    transaction.status = 'returned';

    if (transaction.returnDate > transaction.dueDate) {
      const daysLate = Math.ceil(
        (transaction.returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24)
      );
      transaction.fine = daysLate * 2; // ₹2/day
    }
    await transaction.save();

    const book = await Book.findById(transaction.book._id);
    book.availableCopies += 1;
    await book.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book')
      .populate('member')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;