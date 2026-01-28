import express from 'express';
import path from 'path';
import session from 'express-session';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'library-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Authentication middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.session && (req.session as any).authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// API routes for books (in-memory storage for simplicity)
let books: { id: number; code: string; title: string; author: string; year: number }[] = [
  { id: 1, code: 'BK001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, code: 'BK002', title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 3, code: 'BK003', title: '1984', author: 'George Orwell', year: 1949 }
];
let nextId = 4;

// Borrowers
let borrowers: { id: number; name: string; class: string }[] = [];
let nextBorrowerId = 1;

// Loans
let loans: { id: number; bookId: number; borrowerId: number; borrowDate: string; returnDate?: string; status: 'borrowed' | 'returned'; dueDate?: string }[] = [];
let nextLoanId = 1;

// Login routes
app.get('/login', (req, res) => {
  if (req.session && (req.session as any).authenticated) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    (req.session as any).authenticated = true;
    res.redirect('/');
  } else {
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
  const availableBooks = books.filter(book => !loans.some(loan => loan.bookId === book.id && loan.status === 'borrowed'));
  res.json(availableBooks);
});

// Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;
  if (title && author && year) {
    const code = `BK${String(nextId).padStart(3, '0')}`;
    const newBook = { id: nextId++, code, title, author, year: parseInt(year) };
    books.push(newBook);
    res.status(201).json(newBook);
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});

// Search books
app.get('/api/books/search', (req, res) => {
  const query = req.query.q as string;
  if (query) {
    const results = books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
    );
    res.json(results);
  } else {
    res.json([]);
  }
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    const hasActiveLoans = loans.some(loan => loan.bookId === bookId && loan.status === 'borrowed');
    if (hasActiveLoans) {
      res.status(400).json({ error: 'Cannot delete book that is currently borrowed' });
    } else {
      books.splice(bookIndex, 1);
      res.status(204).send();
    }
  } else {
    res.status(404).json({ error: 'Book not found' });
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
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});

// Delete a borrower
app.delete('/api/borrowers/:id', (req, res) => {
  const borrowerId = parseInt(req.params.id);
  const borrowerIndex = borrowers.findIndex(b => b.id === borrowerId);
  if (borrowerIndex !== -1) {
    borrowers.splice(borrowerIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Borrower not found' });
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
    const isBorrowed = loans.some(l => l.bookId === parseInt(bookId) && l.status === 'borrowed');
    if (book && borrower && !isBorrowed) {
      const borrowDate = new Date();
      const dueDate = new Date(borrowDate);
      dueDate.setDate(borrowDate.getDate() + 14); // 14 days loan period
      const newLoan = {
        id: nextLoanId++,
        bookId: parseInt(bookId),
        borrowerId: parseInt(borrowerId),
        borrowDate: borrowDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'borrowed' as const
      };
      loans.push(newLoan);
      res.status(201).json(newLoan);
    } else {
      res.status(400).json({ error: 'Invalid book or borrower ID, or book already borrowed' });
    }
  } else {
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
  } else {
    res.status(400).json({ error: 'Loan not found or already returned' });
  }
});

// Serve the main HTML file for any other route (protected)
app.get('*', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Perpustakaan SMPN 3 Lumajang app listening at http://localhost:${port}`);
});
