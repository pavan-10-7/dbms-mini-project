import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, AlertTriangle, Package } from 'lucide-react';
import { fetchProducts, addProduct, deleteProduct } from '../api/mockApi';
import { Product, ProductCategory } from '../data/mockData';
import AddProductModal from '../components/modals/AddProductModal';

const categoryColors: Record<ProductCategory, string> = {
  Electronics: 'bg-blue-100 text-blue-700',
  Furniture: 'bg-amber-100 text-amber-700',
  Clothing: 'bg-pink-100 text-pink-700',
  Tools: 'bg-slate-100 text-slate-700',
  Packaging: 'bg-teal-100 text-teal-700',
  'Raw Materials': 'bg-orange-100 text-orange-700',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => fetchProducts().then(p => { setProducts(p); setLoading(false); });

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    await addProduct(product);
    await load();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteId(null);
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Product Catalog</span>
          </div>
          <span className="text-xs text-gray-500">{filtered.length} products</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Price</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Supplier</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No products found</td>
                </tr>
              ) : (
                filtered.map(product => {
                  const isLow = product.quantity <= product.reorderThreshold;
                  return (
                    <tr key={product.id} className={`hover:bg-gray-50 transition-colors ₹{isLow ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {isLow && <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />}
                          <div>
                            <p className="font-medium text-gray-900 text-xs leading-tight">{product.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[product.category]}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs font-medium text-gray-700 hidden sm:table-cell">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`text-xs font-bold ₹{isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                          {product.quantity}
                        </span>
                        {isLow && (
                          <p className="text-xs text-amber-500 text-right">min: {product.reorderThreshold}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-600 hidden lg:table-cell">{product.supplier}</td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete <strong>{products.find(p => p.id === deleteId)?.name}</strong>? This will also remove it from inventory.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
