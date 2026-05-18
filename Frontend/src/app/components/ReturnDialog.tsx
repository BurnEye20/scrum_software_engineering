import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  Typography
} from '@mui/material';
import { BookData } from './BookCard';

interface ReturnDialogProps {
  open: boolean;
  book: BookData | null;
  onClose: () => void;
  onConfirm: (rating: number) => void;
}

export function ReturnDialog({ open, book, onClose, onConfirm }: ReturnDialogProps) {
  const [rating, setRating] = useState<number>(0);

  const handleConfirm = () => {
    onConfirm(rating);
    setRating(0);
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Return Book</DialogTitle>
      <DialogContent>
        {book && (
          <>
            <Typography variant="h6" gutterBottom>
              {book.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <div className="mt-4">
              <Typography component="legend" gutterBottom>
                Rate this book (optional)
              </Typography>
              <Rating
                name="book-rating"
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 0)}
                size="large"
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained">
          Return Book
        </Button>
      </DialogActions>
    </Dialog>
  );
}
