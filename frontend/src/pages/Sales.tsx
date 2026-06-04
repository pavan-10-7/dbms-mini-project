import { useEffect, useState } from 'react';
import { ShoppingCart, Package, User, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { fetchSales, addSale, fetchProducts, fetchCustomers } from '../api/mockApi';
import { Sale, Product, Customer, PaymentMode } from '../data/mockData';

const paymentModes: PaymentMode[] = ['Credit Card', 'Bank Transfer', 'Cash', 'PayPal', 'Cheque'];

interface SaleForm {
  customerName: string;
  productId: string;
  quantity: string;
  paymentMode: PaymentMode;
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<SaleForm>({
    customerName: '',
    productId: '',
    quantity: '',
    paymentMode: 'Credit Card',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([fetchSales(), fetchProducts(), fetchCustomers()]).then(([s, p, c]) => {
      setSales(s);
      setProducts(p);
      setCustomers(c);
      setLoading(false);
    });
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.customerName.trim()) errors.customerName = 'Customer is required';
    if (!formData.productId) errors.productId = 'Product is required';
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      errors.quantity = 'Valid quantity is required';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const selectedProduct = products.find(p => p.id === formData.productId);
    if (!selectedProduct) return;

    const newSale: Omit<Sale, 'id' | 'saleNumber' | 'createdAt'> = {
      customerName: formData.customerName.trim(),
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      quantity: Number(formData.quantity),
      unitPrice: selectedProduct.price,
      totalAmount: selectedProduct.price * Number(formData.quantity),
      paymentMode: formData.paymentMode,
    };

    await addSale(newSale);
    const updatedSales = await fetchSales();
    setSales(updatedSales);
    setFormData({ customerName: '', productId: '', quantity: '', paymentMode: 'Credit Card' });
    setFormErrors({});
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const todaySales = sales.filter(s => s.createdAt === new Date().toISOString().split('T')[0]);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const selectedProduct = products.find(p => p.id === formData.productId);
  const previewAmount = selectedProduct && formData.quantity ? selectedProduct.price * Number(formData.quantity) : 0;

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
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{todaySales.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={18} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Today</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">₹{todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Orders Created</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{sales.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Package size={18} className="text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{sales.length > 0 ? (sales.reduce((s, a) => s + a.totalAmount, 0) / sales.length).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Create Sale</h2>

          {formSubmitted && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm font-medium text-emerald-700">Sale created successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
              <select
                value={formData.customerName}
                onChange={e => {
                  setFormData(f => ({ ...f, customerName: e.target.value }));
                  setFormErrors(err => ({ ...err, customerName: '' }));
                }}
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors ${
                  formErrors.customerName ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Select a customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {formErrors.customerName && <p className="text-xs text-red-500 mt-1">{formErrors.customerName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
              <select
                value={formData.productId}
                onChange={e => {
                  setFormData(f => ({ ...f, productId: e.target.value }));
                  setFormErrors(err => ({ ...err, productId: '' }));
                }}
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors ${
                  formErrors.productId ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Select a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price.toFixed(2)})
                  </option>
                ))}
              </select>
              {formErrors.productId && <p className="text-xs text-red-500 mt-1">{formErrors.productId}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={e => {
                  setFormData(f => ({ ...f, quantity: e.target.value }));
                  setFormErrors(err => ({ ...err, quantity: '' }));
                }}
                placeholder="0"
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors ${
                  formErrors.quantity ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {formErrors.quantity && <p className="text-xs text-red-500 mt-1">{formErrors.quantity}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={e => setFormData(f => ({ ...f, paymentMode: e.target.value as PaymentMode }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
              >
                {paymentModes.map(mode => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && formData.quantity && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-600">Total Amount</span>
                  <span className="text-sm font-bold text-blue-700">₹{previewAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm mt-2"
            >
              <Plus size={15} />
              Submit Sale
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">Recent Sales</span>
            </div>
            <span className="text-xs text-gray-500">{sales.slice(0, 10).length} latest</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale #</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Product</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Payment</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                      No sales yet. Create your first sale above.
                    </td>
                  </tr>
                ) : (
                  sales
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map(sale => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-700 font-medium">{sale.saleNumber}</td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-gray-900 text-xs">{sale.customerName}</p>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <p className="text-xs text-gray-600">{sale.productName}</p>
                          <p className="text-xs text-gray-400 font-mono">{sale.sku}</p>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="text-xs font-semibold text-gray-900">{sale.quantity}</span>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                            {sale.paymentMode === 'Credit Card' ? 'CC' : sale.paymentMode === 'Bank Transfer' ? 'BT' : sale.paymentMode}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-gray-900 text-xs">
                          ₹{sale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 hidden lg:table-cell">{sale.createdAt}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {sales.length > 10 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-xs text-gray-500">Showing latest 10 of {sales.length} sales</span>
              <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View all <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
