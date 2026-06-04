import { useState } from 'react';
import { X } from 'lucide-react';
import { Product, ProductCategory } from '../../data/mockData';

const categories: ProductCategory[] = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Packaging', 'Raw Materials'];

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'createdAt'>) => void;
}

export default function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Electronics' as ProductCategory,
    price: '',
    quantity: '',
    reorderThreshold: '',
    supplier: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Valid price is required';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) e.quantity = 'Valid quantity is required';
    if (!form.reorderThreshold || isNaN(Number(form.reorderThreshold)) || Number(form.reorderThreshold) < 0) e.reorderThreshold = 'Valid threshold is required';
    if (!form.supplier.trim()) e.supplier = 'Supplier is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd({
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      reorderThreshold: Number(form.reorderThreshold),
      supplier: form.supplier.trim(),
    });
  };

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors
          ${errors[key] ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('name', 'Product Name', 'text', 'e.g. Drill Bit Set')}
            {field('sku', 'SKU', 'text', 'e.g. TL-099')}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {field('price', 'Unit Price ($)', 'number', '0.00')}
            {field('quantity', 'Initial Qty', 'number', '0')}
            {field('reorderThreshold', 'Reorder At', 'number', '10')}
          </div>

          {field('supplier', 'Supplier', 'text', 'Supplier name')}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
