import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock
} from 'lucide-react';

import {
  fetchProducts,
  fetchOrders,
  fetchDistributors,
  fetchInventory
} from '../api/mockApi';

import { Product, Order } from '../data/mockData';

const statusColors: Record<string, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-amber-100 text-amber-700',
  Pending: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-600',
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  change?: string;
  changeUp?: boolean;
  subtitle?: string;
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  change,
  changeUp,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
          {changeUp ? (
            <TrendingUp size={13} className="text-emerald-500" />
          ) : (
            <TrendingDown size={13} className="text-red-500" />
          )}

          <span
            className={`text-xs font-medium ${
              changeUp
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            {change}
          </span>

          <span className="text-xs text-gray-400">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchDistributors(),
      fetchInventory(),
    ]).then(([p, o, _d, inv]) => {
      setProducts(p);
      setOrders(o);
      setInventory(inv);
      setLoading(false);
    });
  }, []);

  const customerCount = 3;

  const lowStockProducts = inventory.filter(
    (item) => item.quantity <= item.reorderThreshold
  );

  const totalStockUnits = inventory.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalValue = inventory.reduce((sum, item) => {
    const product = products.find(
      (p) => p.id === String(item.productId)
    );

    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const recentOrders = orders.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Products"
          value={products.length}
          icon={<Package size={18} className="text-blue-600" />}
          iconBg="bg-blue-50"
          change="+1 added"
          changeUp
        />

        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={<ShoppingCart size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          change="+2 delivered"
          changeUp
        />

        <StatCard
          title="Total Customers"
          value={customerCount}
          icon={<Users size={18} className="text-violet-600" />}
          iconBg="bg-violet-50"
        />

        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={
            <AlertTriangle
              size={18}
              className="text-amber-600"
            />
          }
          iconBg="bg-amber-50"
          subtitle="Needs reorder"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Inventory Summary
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">
                Total SKUs
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {products.length}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">
                Total Stock Units
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {totalStockUnits}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">
                Inventory Value
              </span>

              <span className="text-sm font-semibold text-gray-900">
                ₹{totalValue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">
                Low Stock Items
              </span>

              <span className="text-sm font-semibold text-amber-600">
                {lowStockProducts.length}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Active Orders
              </span>

              <span className="text-sm font-semibold text-blue-600">
                {
                  orders.filter((o) =>
                    ['Pending', 'Processing', 'Shipped'].includes(
                      o.status
                    )
                  ).length
                }
              </span>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Low Stock Alert
          </h3>

          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              All items are well stocked
            </p>
          ) : (
            <div className="space-y-2.5">

              {lowStockProducts.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >

                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      {item.productName}
                    </p>

                    <p className="text-xs text-gray-400">
                      SKU-{item.productId}
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
                    {item.quantity} left
                  </span>

                </div>

              ))}

            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Order Status Breakdown
          </h3>

          {[
            'Delivered',
            'Shipped',
            'Processing',
            'Pending',
            'Cancelled',
          ].map((status) => {

            const count = orders.filter(
              (o) => o.status === status
            ).length;

            const pct =
              orders.length > 0
                ? Math.round((count / orders.length) * 100)
                : 0;

            return (
              <div key={status} className="mb-3">

                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">
                    {status}
                  </span>

                  <span className="font-medium text-gray-800">
                    {count}{' '}
                    <span className="text-gray-400">
                      ({pct}%)
                    </span>
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>

              </div>
            );
          })}
        </div>

      </div>

      <div className="bg-white rounded-xl border border-gray-200">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />

            <h3 className="text-sm font-semibold text-gray-900">
              Recent Orders
            </h3>
          </div>

          <button className="flex items-center gap-1 text-xs font-medium text-blue-600">
            View all <ArrowRight size={12} />
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3">
                  Order #
                </th>

                <th className="text-left px-5 py-3">
                  Customer
                </th>

                <th className="text-left px-5 py-3">
                  Date
                </th>

                <th className="text-left px-5 py-3">
                  Status
                </th>

                <th className="text-right px-5 py-3">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>

              {recentOrders.map((order) => (

                <tr key={order.id}>

                  <td className="px-5 py-3">
                    {order.orderNumber}
                  </td>

                  <td className="px-5 py-3">
                    <div>
                      <div className="font-medium">
                        {order.customerName}
                      </div>

                      <div className="text-xs text-gray-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    {order.createdAt}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-right font-semibold">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}