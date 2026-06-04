import { Menu, Bell, Search } from 'lucide-react';
import { Page } from './Sidebar';

interface HeaderProps {
  currentPage: Page;
  onMenuClick: () => void;
}

const pageTitles: Record<
  Page,
  { title: string; subtitle: string }
> = {
  dashboard: {
    title: 'Dashboard',
    subtitle:
      'Overview of your inventory operations'
  },

  products: {
    title: 'Products',
    subtitle:
      'Manage your product catalog'
  },

  inventory: {
    title: 'Inventory',
    subtitle:
      'Track stock levels across warehouses'
  },

  distributors: {
    title: 'Distributors',
    subtitle:
      'Manage supplier network'
  },

  orders: {
    title: 'Orders',
    subtitle:
      'Monitor customer orders'
  },

  sales: {
    title: 'Sales',
    subtitle:
      'Create sales and reduce inventory'
  }
};

export default function Header({
  currentPage,
  onMenuClick
}: HeaderProps) {

  const {
    title,
    subtitle
  } = pageTitles[currentPage];

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">

      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {title}
          </h1>

          <p className="text-xs text-gray-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-56">
          <Search
            size={15}
            className="text-gray-400"
          />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>

        <button className="relative p-2 rounded-lg text-gray-500">
          <Bell size={18} />
        </button>

      </div>
    </header>
  );
}
