interface Book {
  id: number;
  code: string;
  title: string;
  author: string;
  year: number;
}

interface Borrower {
  id: number;
  name: string;
  class: string;
}

interface Loan {
  id: number;
  bookId: number;
  borrowerId: number;
  borrowDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned';
  dueDate?: string;
}

class LibraryApp {
  private books: Book[] = [];
  private borrowers: Borrower[] = [];
  private loans: Loan[] = [];

  constructor() {
    this.loadData();
    this.setupEventListeners();
  }

  private async loadData(): Promise<void> {
    await Promise.all([
      this.loadBooks(),
      this.loadBorrowers(),
      this.loadLoans()
    ]);
    this.renderAll();
  }

  private async loadBooks(): Promise<void> {
    try {
      const response = await fetch('/api/books');
      this.books = await response.json();
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  private async loadBorrowers(): Promise<void> {
    try {
      const response = await fetch('/api/borrowers');
      this.borrowers = await response.json();
    } catch (error) {
      console.error('Error loading borrowers:', error);
    }
  }

  private async loadLoans(): Promise<void> {
    try {
      const response = await fetch('/api/loans');
      this.loans = await response.json();
    } catch (error) {
      console.error('Error loading loans:', error);
    }
  }

  private setupEventListeners(): void {
    const addBookForm = document.getElementById('add-book-form') as HTMLFormElement;
    const searchForm = document.getElementById('search-form') as HTMLFormElement;
    const addBorrowerForm = document.getElementById('add-borrower-form') as HTMLFormElement;
    const borrowBookForm = document.getElementById('borrow-book-form') as HTMLFormElement;
    const returnBookForm = document.getElementById('return-book-form') as HTMLFormElement;

    addBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addBook();
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.searchBooks();
    });

    addBorrowerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addBorrower();
    });

    borrowBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.borrowBook();
    });

    returnBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.returnBook();
    });

    // Update dropdowns when forms are shown
    document.addEventListener('DOMContentLoaded', () => {
      this.updateBorrowBookForm();
      this.updateReturnBookForm();
    });
  }

  private async addBook(): Promise<void> {
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const authorInput = document.getElementById('author') as HTMLInputElement;
    const yearInput = document.getElementById('year') as HTMLInputElement;

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = parseInt(yearInput.value);

    if (title && author && year) {
      try {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, author, year })
        });
        const newBook = await response.json();
        this.books.push(newBook);
        this.renderBooks();
        this.updateBorrowBookForm();

        // Clear form
        titleInput.value = '';
        authorInput.value = '';
        yearInput.value = '';
      } catch (error) {
        console.error('Error adding book:', error);
      }
    }
  }

  private async searchBooks(): Promise<void> {
    const queryInput = document.getElementById('search-query') as HTMLInputElement;
    const query = queryInput.value.trim();

    if (query) {
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        this.renderSearchResults(results);
      } catch (error) {
        console.error('Error searching books:', error);
      }
    } else {
      this.renderSearchResults([]);
    }
  }

  private async addBorrower(): Promise<void> {
    const nameInput = document.getElementById('borrower-name') as HTMLInputElement;
    const classInput = document.getElementById('borrower-class') as HTMLInputElement;

    const name = nameInput.value.trim();
    const borrowerClass = classInput.value.trim();

    if (name && borrowerClass) {
      try {
        const response = await fetch('/api/borrowers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, class: borrowerClass })
        });
        const newBorrower = await response.json();
        this.borrowers.push(newBorrower);
        this.renderBorrowers();
        this.updateBorrowBookForm();

        // Clear form
        nameInput.value = '';
        classInput.value = '';
      } catch (error) {
        console.error('Error adding borrower:', error);
      }
    }
  }

  private async borrowBook(): Promise<void> {
    const bookSelect = document.getElementById('borrow-book-select') as HTMLSelectElement;
    const borrowerSelect = document.getElementById('borrow-borrower-select') as HTMLSelectElement;

    const bookId = bookSelect.value;
    const borrowerId = borrowerSelect.value;

    if (bookId && borrowerId) {
      try {
        const response = await fetch('/api/loans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId, borrowerId })
        });
        const newLoan = await response.json();
        this.loans.push(newLoan);
        await this.loadBooks();
        this.renderBooks();
        this.renderLoans();
        this.updateBorrowBookForm();
        this.updateReturnBookForm();

        // Reset form
        bookSelect.value = '';
        borrowerSelect.value = '';
      } catch (error) {
        console.error('Error borrowing book:', error);
      }
    }
  }

  private async returnBook(): Promise<void> {
    const loanSelect = document.getElementById('return-loan-select') as HTMLSelectElement;
    const loanId = loanSelect.value;

    if (loanId) {
      try {
        const response = await fetch(`/api/loans/${loanId}/return`, {
          method: 'PUT'
        });
        const updatedLoan = await response.json();
        const index = this.loans.findIndex(l => l.id === updatedLoan.id);
        if (index !== -1) {
          this.loans[index] = updatedLoan;
        }
        await this.loadBooks();
        this.renderBooks();
        this.renderLoans();
        this.updateBorrowBookForm();
        this.updateReturnBookForm();

        // Reset form

  private renderAll(): void {
    this.renderBooks();
    this.renderBorrowers();
    this.renderLoans();
  }

  private renderBooks(): void {
    const container = document.getElementById('books-container')!;
    container.innerHTML = '';

    this.books.forEach(book => {
      const bookElement = document.createElement('div');
      bookElement.className = 'book';
      bookElement.innerHTML = `
        <h3>${book.title} (${book.code})</h3>
        <p>Author: ${book.author}</p>
        <p>Year: ${book.year}</p>
      `;
      container.appendChild(bookElement);
    });
  }

  private renderBorrowers(): void {
    const container = document.getElementById('borrowers-container')!;
    container.innerHTML = '';

    this.borrowers.forEach(borrower => {
      const borrowerElement = document.createElement('div');
      borrowerElement.className = 'borrower';
      borrowerElement.innerHTML = `
        <h3>${borrower.name}</h3>
        <p>Class: ${borrower.class}</p>
      `;
      container.appendChild(borrowerElement);
    });
  }

  private renderLoans(): void {
    const container = document.getElementById('loans-container')!;
    container.innerHTML = '';

    this.loans.forEach(loan => {
      const book = this.books.find(b => b.id === loan.bookId);
      const borrower = this.borrowers.find(b => b.id === loan.borrowerId);
      const loanElement = document.createElement('div');
      loanElement.className = 'loan';
      loanElement.innerHTML = `
        <h3>${book?.title || 'Unknown Book'} borrowed by ${borrower?.name || 'Unknown Borrower'}</h3>
        <p>Borrow Date: ${loan.borrowDate}</p>
        <p>Status: ${loan.status}</p>
        ${loan.returnDate ? `<p>Return Date: ${loan.returnDate}</p>` : ''}
      `;
      container.appendChild(loanElement);
    });
  }

  private renderSearchResults(results: Book[]): void {
    const container = document.getElementById('search-results')!;
    container.innerHTML = '';

    if (results.length === 0) {
      container.innerHTML = '<p>No books found.</p>';
      return;
    }

    results.forEach(book => {
      const bookElement = document.createElement('div');
      bookElement.className = 'book';
      bookElement.innerHTML = `
        <h3>${book.title} (${book.code})</h3>
        <p>Author: ${book.author}</p>
        <p>Year: ${book.year}</p>
      `;
      container.appendChild(bookElement);
    });
  }

  private updateBorrowBookForm(): void {
    const bookSelect = document.getElementById('borrow-book-select') as HTMLSelectElement;
    const borrowerSelect = document.getElementById('borrow-borrower-select') as HTMLSelectElement;

    bookSelect.innerHTML = '<option value="">Select Book</option>';
    this.books.forEach(book => {
      const option = document.createElement('option');
      option.value = book.id.toString();
      option.textContent = `${book.code} - ${book.title}`;
      bookSelect.appendChild(option);
    });

    borrowerSelect.innerHTML = '<option value="">Select Borrower</option>';
    this.borrowers.forEach(borrower => {
      const option = document.createElement('option');
      option.value = borrower.id.toString();
      option.textContent = `${borrower.name} (${borrower.class})`;
      borrowerSelect.appendChild(option);
    });
  }

  private updateReturnBookForm(): void {
    const loanSelect = document.getElementById('return-loan-select') as HTMLSelectElement;
    loanSelect.innerHTML = '<option value="">Select Loan</option>';

    this.loans.filter(loan => loan.status === 'borrowed').forEach(loan => {
      const book = this.books.find(b => b.id === loan.bookId);
      const borrower = this.borrowers.find(b => b.id === loan.borrowerId);
      const option = document.createElement('option');
      option.value = loan.id.toString();
      option.textContent = `${book?.title || 'Unknown'} by ${borrower?.name || 'Unknown'} (${loan.borrowDate})`;
      loanSelect.appendChild(option);
    });
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LibraryApp();
});
