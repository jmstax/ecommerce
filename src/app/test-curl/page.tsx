'use client';

import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  family: string;
  tags: string[];
  image_url: string;
}

export default function TestCurlPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from /api/test-curl');
        const response = await fetch('/api/test-curl');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const data = await response.json();
        console.log('Received data:', data);
        setProducts(data.products);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products (Curl Test)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                {product.price.currency} {product.price.amount}
              </span>
              <span className="text-sm text-gray-500">{product.family}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 