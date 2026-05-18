import { Paper, Typography, Grid } from '@mui/material';
import { BookData } from './BookCard';
import { TrendingUp, Star, Book, Users } from 'lucide-react';

interface StatisticsProps {
  books: BookData[];
}

export function Statistics({ books }: StatisticsProps) {
  const totalBooks = books.length;
  const totalPieces = books.reduce((sum, book) => sum + book.totalPieces, 0);
  const availablePieces = books.reduce((sum, book) => sum + book.availablePieces, 0);
  const borrowedPieces = totalPieces - availablePieces;
  const totalBorrows = books.reduce((sum, book) => sum + book.borrowCount, 0);

  const allRatings = books.flatMap(book => book.ratings);
  const averageRating = allRatings.length > 0
    ? (allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length).toFixed(2)
    : 'N/A';

  const mostBorrowedBook = books.length > 0
    ? books.reduce((prev, current) =>
        current.borrowCount > prev.borrowCount ? current : prev
      )
    : null;

  const highestRatedBook = books.length > 0
    ? books
        .filter(book => book.ratings.length > 0)
        .reduce((prev, current) => {
          const prevAvg = prev.ratings.reduce((sum, r) => sum + r, 0) / prev.ratings.length;
          const currentAvg = current.ratings.reduce((sum, r) => sum + r, 0) / current.ratings.length;
          return currentAvg > prevAvg ? current : prev;
        }, books.find(b => b.ratings.length > 0) || books[0])
    : null;

  const StatCard = ({ icon: Icon, title, value, subtitle }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string
  }) => (
    <Paper elevation={2} sx={{ p: 2 }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-blue-600" />
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </div>
      <Typography variant="h4" gutterBottom>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );

  return (
    <div className="mb-4">
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Library Statistics
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={Book}
            title="Total Books"
            value={totalBooks}
            subtitle={`${totalPieces} pieces total`}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            icon={Users}
            title="Currently Borrowed"
            value={borrowedPieces}
            subtitle={`${availablePieces} available`}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            icon={TrendingUp}
            title="Total Borrows"
            value={totalBorrows}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            icon={Star}
            title="Average Rating"
            value={averageRating}
            subtitle={`${allRatings.length} ratings`}
          />
        </Grid>
      </Grid>

      {(mostBorrowedBook || highestRatedBook) && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {mostBorrowedBook && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Most Borrowed Book
                </Typography>
                <Typography variant="h6">
                  {mostBorrowedBook.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mostBorrowedBook.borrowCount} times
                </Typography>
              </Paper>
            </Grid>
          )}

          {highestRatedBook && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Highest Rated Book
                </Typography>
                <Typography variant="h6">
                  {highestRatedBook.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(highestRatedBook.ratings.reduce((sum, r) => sum + r, 0) / highestRatedBook.ratings.length).toFixed(1)} stars
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
}
