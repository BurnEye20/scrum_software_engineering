import { useState } from 'react';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';
import { BookPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AddBookFormProps {
  onAddBook: (book: {
    title: string;
    author: string;
    year: number;
    edition: string;
    publisher: string;
    totalPieces: number;
  }) => void;
}

export function AddBookForm({ onAddBook }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    edition: '',
    publisher: '',
    totalPieces: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      toast.error('Title and Author are required');
      return;
    }

    const currentYear = new Date().getFullYear();
    if (formData.year > currentYear) {
      toast.error('Cannot add a book with a future year');
      return;
    }

    onAddBook(formData);
    setFormData({
      title: '',
      author: '',
      year: new Date().getFullYear(),
      edition: '',
      publisher: '',
      totalPieces: 1,
    });
    toast.success('Book registered successfully');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <div className="flex items-center gap-2 mb-4">
        <BookPlus className="w-6 h-6" />
        <Typography variant="h5">Register New Book</Typography>
      </div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Author"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Year"
              type="number"
              inputProps={{ max: new Date().getFullYear() }}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Edition"
              value={formData.edition}
              onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Pieces"
              type="number"
              inputProps={{ min: 1 }}
              value={formData.totalPieces}
              onChange={(e) => setFormData({ ...formData, totalPieces: parseInt(e.target.value) || 1 })}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<BookPlus />}
            >
              Register Book
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
