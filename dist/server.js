"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session middleware
app.use((0, express_session_1.default)({
    secret: 'library-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));
// Serve static files from the public directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
// API routes for books (in-memory storage for simplicity)
let books = [
    { id: 1, code: 'BK001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
    { id: 2, code: 'BK002', title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
    { id: 3, code: 'BK003', title: '1984', author: 'George Orwell', year: 1949 }
];
let nextId = 4;
// Borrowers
let borrowers = [];
let nextBorrowerId = 1;
// Loans
let loans = [];
let nextLoanId = 1;
// Login routes
app.get('/login', (req, res) => {
    if (req.session && req.session.authenticated) {
        res.redirect('/');
    }
    else {
        res.sendFile(path_1.default.join(__dirname, '../public/login.html'));
    }
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.authenticated = true;
        res.redirect('/');
    }
    else {
        res.status(401).send('Invalid credentials');
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});
// Get all books
app.get('/api/books', (req, res) => {
    res.json(books);
});
// Add a new book
app.post('/api/books', (req, res) => {
    const { title, author, year } = req.body;
    if (title && author && year) {
        const code = `BK${String(nextId).padStart(3, '0')}`;
        const newBook = { id: nextId++, code, title, author, year: parseInt(year) };
        books.push(newBook);
        res.status(201).json(newBook);
    }
    else {
        res.status(400).json({ error: 'Missing required fields' });
    }
});
// Search books
app.get('/api/books/search', (req, res) => {
    const query = req.query.q;
    if (query) {
        const results = books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()));
        res.json(results);
    }
    else {
        res.json([]);
    }
});
// Get all borrowers
app.get('/api/borrowers', (req, res) => {
    res.json(borrowers);
});
// Add a new borrower
app.post('/api/borrowers', (req, res) => {
    const { name, class: borrowerClass } = req.body;
    if (name && borrowerClass) {
        const newBorrower = { id: nextBorrowerId++, name, class: borrowerClass };
        borrowers.push(newBorrower);
        res.status(201).json(newBorrower);
    }
    else {
        res.status(400).json({ error: 'Missing required fields' });
    }
});
// Get all loans
app.get('/api/loans', (req, res) => {
    res.json(loans);
});
// Borrow a book
app.post('/api/loans', (req, res) => {
    const { bookId, borrowerId } = req.body;
    if (bookId && borrowerId) {
        const book = books.find(b => b.id === parseInt(bookId));
        const borrower = borrowers.find(b => b.id === parseInt(borrowerId));
        if (book && borrower) {
            const newLoan = {
                id: nextLoanId++,
                bookId: parseInt(bookId),
                borrowerId: parseInt(borrowerId),
                borrowDate: new Date().toISOString().split('T')[0],
                status: 'borrowed'
            };
            loans.push(newLoan);
            res.status(201).json(newLoan);
        }
        else {
            res.status(400).json({ error: 'Invalid book or borrower ID' });
        }
    }
    else {
        res.status(400).json({ error: 'Missing required fields' });
    }
});
// Return a book
app.put('/api/loans/:id/return', (req, res) => {
    const loanId = parseInt(req.params.id);
    const loan = loans.find(l => l.id === loanId);
    if (loan && loan.status === 'borrowed') {
        loan.status = 'returned';
        loan.returnDate = new Date().toISOString().split('T')[0];
        res.json(loan);
    }
    else {
        res.status(400).json({ error: 'Loan not found or already returned' });
    }
});
// Serve the main HTML file for any other route (protected)
app.get('*', requireAuth, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen(port, () => {
    console.log(`Library app listening at http://localhost:${port}`);
});
