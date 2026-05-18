import { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: '20px',
    marginBottom: '30px',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#1f2937',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
  },
  buttonSuccess: {
    backgroundColor: '#10b981',
  },
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  bookCard: {
    backgroundColor: '#f3f4f6',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '5px',
  },
  bookAuthor: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '10px',
  },
  bookInfo: {
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#6b7280',
  },
  alert: {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  alertError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  alertSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
};

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [copies, setCopies] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Load books from localStorage on component mount
  useEffect(() => {
    const storedBooks = localStorage.getItem('libraryBooks');
    if (storedBooks) {
      try {
        setBooks(JSON.parse(storedBooks));
      } catch (error) {
        console.error('Failed to load books from localStorage:', error);
      }
    }
  }, []);

  // Sync books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
  }, [books]);

  const showAlert = (type: 'error' | 'success', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();

    // Error handling: prevent empty submissions
    if (!title.trim() || !author.trim() || !copies.trim()) {
      showAlert('error', 'Please fill in all fields');
      return;
    }

    const totalCopies = parseInt(copies, 10);
    if (isNaN(totalCopies) || totalCopies <= 0) {
      showAlert('error', 'Number of copies must be a positive number');
      return;
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      totalCopies,
      availableCopies: totalCopies,
    };

    setBooks([...books, newBook]);
    setTitle('');
    setAuthor('');
    setCopies('');
    showAlert('success', 'Book registered successfully');
  };

  const handleBorrow = (bookId: string) => {
    setBooks(books.map(book =>
      book.id === bookId && book.availableCopies > 0
        ? { ...book, availableCopies: book.availableCopies - 1 }
        : book
    ));
    showAlert('success', 'Book borrowed successfully');
  };

  const handleReturn = (bookId: string) => {
    setBooks(books.map(book =>
      book.id === bookId && book.availableCopies < book.totalCopies
        ? { ...book, availableCopies: book.availableCopies + 1 }
        : book
    ));
    showAlert('success', 'Book returned successfully');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📚 Library Management System</h1>
        <p>Manage your book collection with ease</p>
      </div>

      {alert && (
        <div
          style={{
            ...styles.alert,
            ...(alert.type === 'error' ? styles.alertError : styles.alertSuccess),
          }}
        >
          {alert.message}
        </div>
      )}

      {/* Add Book Form */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Register a New Book</h2>
        <form onSubmit={handleAddBook}>
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Number of Copies"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              style={styles.input}
              min="1"
            />
            <button type="submit" style={styles.button}>
              Register Book
            </button>
          </div>
        </form>
      </div>

      {/* Books Display */}
      {books.length > 0 ? (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Book Collection ({books.length})</h2>
          <div style={styles.bookGrid}>
            {books.map(book => (
              <div key={book.id} style={styles.bookCard}>
                <div style={styles.bookTitle}>{book.title}</div>
                <div style={styles.bookAuthor}>by {book.author}</div>
                <div style={styles.bookInfo}>
                  Total Copies: <strong>{book.totalCopies}</strong>
                </div>
                <div style={styles.bookInfo}>
                  Available: <strong>{book.availableCopies}</strong>
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.availableCopies === 0}
                    style={{
                      ...styles.button,
                      ...(book.availableCopies === 0 && styles.buttonDisabled),
                    }}
                  >
                    Borrow
                  </button>
                  <button
                    onClick={() => handleReturn(book.id)}
                    disabled={book.availableCopies === book.totalCopies}
                    style={{
                      ...styles.button,
                      ...styles.buttonSuccess,
                      ...(book.availableCopies === book.totalCopies && styles.buttonDisabled),
                    }}
                  >
                    Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.section}>
          <div style={styles.emptyState}>
            <p style={{ fontSize: '24px', marginBottom: '10px' }}>📖</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
              No books registered yet
            </p>
            <p>Start by registering your first book using the form above</p>
          </div>
        </div>
      )}
    </div>
  );
}