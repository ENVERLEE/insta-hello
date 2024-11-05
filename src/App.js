import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Components
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetail from './pages/ProjectDetail';

// Styles
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects/create" element={<ProjectCreate />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default App;
