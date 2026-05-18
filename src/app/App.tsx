import { useState } from 'react';
import { Container, Typography, Grid, AppBar, Toolbar, Box } from '@mui/material';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { Library } from 'lucide-react';
import { AddBookForm } from './components/AddBookForm';
import { BookCard, BookData } from './components/BookCard';
import { ReturnDialog } from './components/ReturnDialog';
import { Statistics } from './components/Statistics';

export default function App() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);

  const handleAddBook = (bookData: {
    title: string;
    author: string;
    year: number;
    edition: string;
    publisher: string;
    totalPieces: number;
  }) => {
    const newBook: BookData = {
      id: Date.now().toString(),
      ...bookData,
      availablePieces: bookData.totalPieces,
      borrowCount: 0,
      ratings: [],
    };
    setBooks([...books, newBook]);
  };

  const handleBorrow = (bookId: string) => {
    setBooks(books.map(book => {
      if (book.id === bookId && book.availablePieces > 0) {
        return {
          ...book,
          availablePieces: book.availablePieces - 1,
          borrowCount: book.borrowCount + 1,
        };
      }
      return book;
    }));
    toast.success('Book borrowed successfully');
  };

  const handleReturnClick = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setReturnDialogOpen(true);
    }
  };

  const handleReturnConfirm = (rating: number) => {
    if (selectedBook) {
      setBooks(books.map(book => {
        if (book.id === selectedBook.id) {
          const newRatings = rating > 0 ? [...book.ratings, rating] : book.ratings;
          return {
            ...book,
            availablePieces: book.availablePieces + 1,
            ratings: newRatings,
          };
        }
        return book;
      }));
      toast.success(rating > 0 ? 'Book returned and rated' : 'Book returned');
    }
  };

  const handleAddPiece = (bookId: string) => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          totalPieces: book.totalPieces + 1,
          availablePieces: book.availablePieces + 1,
        };
      }
      return book;
    }));
    toast.success('Piece added');
  };

  const handleRemovePiece = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const borrowedPieces = book.totalPieces - book.availablePieces;

    if (borrowedPieces > 0 && book.totalPieces - 1 < borrowedPieces) {
      toast.error('Cannot remove piece - some pieces are borrowed. Please return them first.');
      return;
    }

    setBooks(books.map(b => {
      if (b.id === bookId && b.totalPieces > 1) {
        const newTotal = b.totalPieces - 1;
        const newAvailable = Math.min(b.availablePieces, newTotal);
        return {
          ...b,
          totalPieces: newTotal,
          availablePieces: newAvailable,
        };
      }
      return b;
    }));
    toast.success('Piece removed');
  };

  const handleRemoveBook = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book && book.availablePieces < book.totalPieces) {
      toast.error('Cannot remove book with borrowed pieces');
      return;
    }
    setBooks(books.filter(b => b.id !== bookId));
    toast.success('Book removed completely');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Library className="w-8 h-8 mr-2" />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AddBookForm onAddBook={handleAddBook} />

        {books.length > 0 && (
          <>
            <Statistics books={books} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Book Collection ({books.length})
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {books.map(book => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <BookCard
                    book={book}
                    onBorrow={handleBorrow}
                    onReturn={handleReturnClick}
                    onAddPiece={handleAddPiece}
                    onRemovePiece={handleRemovePiece}
                    onRemoveBook={handleRemoveBook}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {books.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary'
            }}
          >
            <Library className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <Typography variant="h6">
              No books registered yet
            </Typography>
            <Typography variant="body2">
              Start by registering your first book above
            </Typography>
          </Box>
        )}
      </Container>

      <ReturnDialog
        open={returnDialogOpen}
        book={selectedBook}
        onClose={() => setReturnDialogOpen(false)}
        onConfirm={handleReturnConfirm}
      />

      <Toaster position="top-right" richColors />
    </div>
  );
}