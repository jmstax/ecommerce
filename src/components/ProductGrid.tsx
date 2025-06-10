'use client';

import { Grid, Card, CardContent, CardMedia, Typography, Box, Link, Chip, Stack } from '@mui/material';
import { useSearch } from '@/context/SearchContext';

interface Article {
  _id: string;
  title: string;
  author_id: string;
  last_updated: string;
  link: string;
  category: string;
}

interface Product {
  _id: string;
  sku: string;
  name: string;
  description: string;
  family: string;
  price: { amount: number; currency: string };
  tags: string[];
  attributes?: Record<string, unknown>;
  image_url?: string;
  documentation_ids?: string[];
  product_type?: string;
}

const PLACEHOLDER_IMAGE = "/placeholder.png";

export default function ProductGrid() {
  const { products, loading, isClient } = useSearch();

  if (!isClient) {
    return null; // Don't render anything on the server
  }

  if (!products || (products as unknown[]).length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>No products found</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading products...</Typography>
      </Box>
    );
  }

  // Debug: print all products
  console.log('ProductGrid products:', products);

  return (
    <Grid container spacing={3}>
      {(products as unknown[]).map((item, index) => {
        // Check if it's a product (has image_url)
        if (item && typeof item === 'object' && 'image_url' in item) {
          const product = item as Product;
          return (
            <Grid item xs={12} sm={6} md={4} key={product._id || index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 6 },
                  overflow: 'hidden',
                  maxWidth: 320,
                  margin: '0 auto',
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image_url || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  sx={{ width: '100%', height: 200, objectFit: 'contain', bgcolor: '#f7f7f7' }}
                />
                <CardContent sx={{ flexGrow: 1, minHeight: 180, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700 }} noWrap>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                    {product.price.currency} {product.price.amount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    Family: {product.family}
                  </Typography>
                  {product.product_type && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      Type: {product.product_type}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {product.tags && product.tags.slice(0, 4).map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ mb: 0.5 }} />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        } else if (item && typeof item === 'object' && 'author_id' in item) {
          const article = item as Article;
          return (
            <Grid item xs={12} sm={6} md={4} key={article._id || index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5', borderRadius: 3, boxShadow: 1, maxWidth: 320, margin: '0 auto' }}>
                <CardContent sx={{ flexGrow: 1, minHeight: 160 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700 }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Author: {article.author_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Category: {article.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Last Updated: {article.last_updated}
                  </Typography>
                  {article.link && (
                    <Link href={article.link} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', mt: 1 }}>
                      Read More
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        } else {
          // fallback for other collections
          return null;
        }
      })}
    </Grid>
  );
} 