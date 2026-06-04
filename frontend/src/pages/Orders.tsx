import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { fetchOrders } from '../api/mockApi';
import { Order, OrderStatus, PaymentMode } from '../data/mockData';

const statusColors: Record<OrderStatus, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-amber-100 text-amber-700',
  Pending: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-600',
};

const statusDot: Record<OrderStatus, string> = {
  Delivered: 'bg-emerald-500',
  Shipped: 'bg-blue-500',
  Processing: 'bg-amber-500',
  Pending: 'bg-gray-400',
  Cancelled: 'bg-red-500',
};

const paymentIcons: Record<PaymentMode, string> = {
  'Credit Card': 'CC',
  'Bank Transfer': 'BT',
  'Cash': '₹',
  'PayPal': 'PP',
  'Cheque': 'CHQ',
};

const allStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then(o => { setOrders(o); setLoading(false); });
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.totalAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setStatusFilter('All')}
          className={`cursor-pointer bg-white border rounded-xl p-3 text-center hover:shadow-sm transition-shadow ₹{statusFilter === 'All' ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'}`}
        >
          <p className="text-xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">All Orders</p>
        </div>
        {allStatuses.map(status => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <div
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`cursor-pointer bg-white border rounded-xl p-3 text-center hover:shadow-sm transition-shadow ₹{statusFilter === status ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'}`}
            >
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className={`text-xs mt-0.5 font-medium ₹{
                status === 'Delivered' ? 'text-emerald-600' :
                status === 'Shipped' ? 'text-blue-600' :
                status === 'Processing' ? 'text-amber-600' :
                status === 'Pending' ? 'text-gray-500' : 'text-red-500'
              }`}>{status}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-emerald-800">Total Delivered Revenue</span>
        <span className="text-lg font-bold text-emerald-700">₹{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders or customers..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as OrderStatus | 'All')}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
          >
            <option value="All">All Statuses</option>
            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Orders</span>
          </div>
          <span className="text-xs text-gray-500">{filtered.length} results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Payment</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No orders found</td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-700 font-medium whitespace-nowrap">{order.orderNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900 text-xs leading-tight whitespace-nowrap">{order.customerName}</p>
                      <p className="text-xs text-gray-400 hidden sm:block">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-600">
                        {paymentIcons[order.paymentMode]}
                        <span className="hidden lg:inline">{order.paymentMode}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs text-gray-600 hidden sm:table-cell">{order.items}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 hidden lg:table-cell whitespace-nowrap">{order.createdAt}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[order.status]}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900 text-xs whitespace-nowrap">
                      ₹{order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs text-gray-500">Showing {filtered.length} of {orders.length} orders</span>
          <span className="text-xs font-semibold text-gray-700">
            Total: ₹{filtered.reduce((s, o) => s + o.totalAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
