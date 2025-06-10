'use client';

import {
  Tabs,
  Tab,
  TextField,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSearch } from '@/context/SearchContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchComponent() {
  const {
    searchType,
    setSearchType,
    vectorQuery,
    setVectorQuery,
    hybridQuery,
    setHybridQuery,
    hybridTerms,
    setHybridTerms,
    loading,
    setLoading,
    error,
    setError,
    setProducts,
    isClient,
  } = useSearch();

  // Add debounced values
  const debouncedVectorQuery = useDebounce(vectorQuery, 500);
  const debouncedHybridQuery = useDebounce(hybridQuery, 500);
  const debouncedHybridTerms = useDebounce(hybridTerms, 500);

  // Effect for vector search
  useEffect(() => {
    if (searchType === 'vector' && debouncedVectorQuery) {
      handleSearch();
    }
  }, [debouncedVectorQuery]);

  // Effect for hybrid search
  useEffect(() => {
    if (searchType === 'hybrid' && (debouncedHybridQuery || debouncedHybridTerms)) {
      handleSearch();
    }
  }, [debouncedHybridQuery, debouncedHybridTerms]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/vector-search?collection=products`);
        setProducts(response.data.products);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Failed to load products. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      loadInitialData();
    }
  }, [isClient, setLoading, setProducts, setError]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (searchType === 'vector') {
        response = await axios.get(
          `/api/vector-search?query=${encodeURIComponent(vectorQuery)}&collection=products`
        );
      } else {
        response = await axios.get(
          `/api/hybrid-search?query=${encodeURIComponent(hybridQuery)}&terms=${encodeURIComponent(hybridTerms)}&collection=products`
        );
      }

      setProducts(response.data.products);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null; // Don't render anything on the server
  }

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Tabs
          value={searchType}
          onChange={(_, newValue) => setSearchType(newValue)}
          sx={{ flexGrow: 1 }}
        >
          <Tab value="vector" label="Vector Search" />
          <Tab value="hybrid" label="Hybrid Search" />
        </Tabs>
      </Box>

      {searchType === 'vector' ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Search Query"
            value={vectorQuery}
            onChange={(e) => setVectorQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Search Query"
            value={hybridQuery}
            onChange={(e) => setHybridQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <TextField
            fullWidth
            label="Search Terms"
            value={hybridTerms}
            onChange={(e) => setHybridTerms(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
} 