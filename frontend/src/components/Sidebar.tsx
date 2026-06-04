import {
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  ShoppingCart,
  DollarSign,
  ChevronRight,
  X
} from 'lucide-react';

export type Page =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'distributors'
  | 'orders'
  | 'sales';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />
  },
  {
    id: 'products',
    label: 'Products',
    icon: <Package size={18} />
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: <Warehouse size={18} />
  },
  {
    id: 'distributors',
    label: 'Distributors',
    icon: <Truck size={18} />
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <ShoppingCart size={18} />
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: <DollarSign size={18} />
  }
];

export default function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  onClose
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 bg-slate-900 flex flex-col transition-transform duration-300
          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Warehouse size={16} className="text-white" />
            </div>

            <div>
              <p className="text-white font-bold text-sm">
                StockFlow
              </p>
              <p className="text-slate-400 text-xs">
                Inventory System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>

          {navItems.map(item => {
            const active =
              currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
                  ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>

                {active && (
                  <ChevronRight size={14} />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}