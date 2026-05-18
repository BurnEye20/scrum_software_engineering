import { Card, CardContent, Typography, Button, Chip, Box, IconButton } from '@mui/material';
import { Book, TrendingUp, Star, Trash2, Plus, Minus } from 'lucide-react';

export interface BookData {
  id: string;
  title: string;
  author: string;
  year: number;
  edition: string;
  publisher: string;
  totalPieces: number;
  availablePieces: number;
  borrowCount: number;
  ratings: number[];
}

interface BookCardProps {
  book: BookData;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onRemovePiece: (bookId: string) => void;
  onAddPiece: (bookId: string) => void;
  onRemoveBook: (bookId: string) => void;
}

export function BookCard({ book, onBorrow, onReturn, onRemovePiece, onAddPiece, onRemoveBook }: BookCardProps) {
  const averageRating = book.ratings.length > 0
    ? (book.ratings.reduce((sum, rating) => sum + rating, 0) / book.ratings.length).toFixed(1)
    : 'N/A';

  const borrowedPieces = book.totalPieces - book.availablePieces;

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-blue-600" />
            <Typography variant="h6" component="div">
              {book.title}
            </Typography>
          </div>
          <IconButton
            size="small"
            color="error"
            onClick={() => onRemoveBook(book.id)}
            title="Remove book completely"
          >
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>

        <Typography color="text.secondary" gutterBottom>
          by {book.author}
        </Typography>

        <div className="flex gap-2 mb-3 flex-wrap">
          <Chip label={`${book.year}`} size="small" />
          {book.edition && <Chip label={book.edition} size="small" variant="outlined" />}
          {book.publisher && <Chip label={book.publisher} size="small" variant="outlined" />}
        </div>

        <Box sx={{ mb: 2 }}>
          <div className="flex items-center gap-2 mb-1">
            <Typography variant="body2" color="text.secondary">
              Available: {book.availablePieces} / {book.totalPieces}
            </Typography>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <Typography variant="body2">
              Borrowed {book.borrowCount} times
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <Typography variant="body2">
              Rating: {averageRating} ({book.ratings.length} reviews)
            </Typography>
          </div>
        </Box>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="contained"
            size="small"
            disabled={book.availablePieces === 0}
            onClick={() => onBorrow(book.id)}
          >
            Borrow
          </Button>

          <Button
            variant="outlined"
            size="small"
            disabled={borrowedPieces === 0}
            onClick={() => onReturn(book.id)}
          >
            Return
          </Button>

          <div className="flex gap-1">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onAddPiece(book.id)}
              title="Add a piece"
            >
              <Plus className="w-4 h-4" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              disabled={book.totalPieces <= 1 || (borrowedPieces > 0 && book.totalPieces - 1 < borrowedPieces)}
              onClick={() => onRemovePiece(book.id)}
              title={borrowedPieces > 0 && book.totalPieces - 1 < borrowedPieces ? "Return borrowed pieces first" : "Remove a piece"}
            >
              <Minus className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
