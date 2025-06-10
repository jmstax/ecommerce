import DataFetcher from '../components/DataFetcher';

export default function TestPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Test Page - Direct API Calls</h1>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          This page uses direct API calls to Astra DB without the vector search functionality.
          Check the browser console for detailed request/response logs.
        </p>
      </div>
      <DataFetcher />
    </main>
  );
} 