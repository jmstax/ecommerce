'use client';

import SearchComponent from '@/components/SearchComponent';
import ProductGrid from '@/components/ProductGrid';
import { SearchProvider } from '@/context/SearchContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#fafbfc' }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            eCommerce Demo
          </Typography>
        </Toolbar>
      </AppBar>
      <SearchProvider>
        <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <SearchComponent />
          </Box>
          <ProductGrid />
        </Container>
      </SearchProvider>
    </main>
  );
}
