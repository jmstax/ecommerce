'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Product {
  id: string;
  ProductTitle: string;
  ProductDescription: string;
  Price: number;
  Category: string;
  ImageUrls?: string[];
  Author?: string;
}

interface SearchContextType {
  searchType: 'vector' | 'hybrid';
  setSearchType: (type: 'vector' | 'hybrid') => void;
  vectorQuery: string;
  setVectorQuery: (query: string) => void;
  hybridQuery: string;
  setHybridQuery: (query: string) => void;
  hybridTerms: string;
  setHybridTerms: (terms: string) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isClient: boolean;
  selectedCollection: string;
  setSelectedCollection: (collection: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchType, setSearchType] = useState<'vector' | 'hybrid'>('vector');
  const [vectorQuery, setVectorQuery] = useState('');
  const [hybridQuery, setHybridQuery] = useState('');
  const [hybridTerms, setHybridTerms] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('articles');

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchType,
        setSearchType,
        vectorQuery,
        setVectorQuery,
        hybridQuery,
        setHybridQuery,
        hybridTerms,
        setHybridTerms,
        products,
        setProducts,
        loading,
        setLoading,
        error,
        setError,
        isClient,
        selectedCollection,
        setSelectedCollection,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 