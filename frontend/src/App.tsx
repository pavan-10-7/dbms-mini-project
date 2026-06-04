import { useState } from 'react';

import Sidebar, {
  Page
} from './components/Sidebar';

import Header from './components/Header';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Distributors from './pages/Distributors';
import Orders from './pages/Orders';
import Sales from './pages/Sales';

export default function App() {

  const [
    currentPage,
    setCurrentPage
  ] = useState<Page>('dashboard');

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(false);

  const renderPage = () => {

    switch (currentPage) {

      case 'dashboard':
        return <Dashboard />;

      case 'products':
        return <Products />;

      case 'inventory':
        return <Inventory />;

      case 'distributors':
        return <Distributors />;

      case 'orders':
        return <Orders />;

      case 'sales':
        return <Sales />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <Header
          currentPage={currentPage}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>

      </div>
    </div>
  );
}