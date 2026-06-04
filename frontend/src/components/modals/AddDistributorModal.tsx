import { useState } from 'react';
import { X } from 'lucide-react';
import { Distributor } from '../../data/mockData';

interface AddDistributorModalProps {
  onClose: () => void;
  onAdd: (distributor: Omit<Distributor, 'id' | 'totalOrders' | 'joinedAt'>) => void;
}

export default function AddDistributorModal({ onClose, onAdd }: AddDistributorModalProps) {
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    region: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Company name is required';
    if (!form.contactPerson.trim()) e.contactPerson = 'Contact person is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.region.trim()) e.region = 'Region is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd({ ...form, name: form.name.trim(), contactPerson: form.contactPerson.trim(), email: form.email.trim(), phone: form.phone.trim(), region: form.region.trim() });
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
          <h2 className="text-base font-semibold text-gray-900">Add New Distributor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('name', 'Company Name', 'text', 'e.g. ToolMaster Inc')}
            {field('contactPerson', 'Contact Person', 'text', 'Full name')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('email', 'Email Address', 'email', 'contact@company.com')}
            {field('phone', 'Phone Number', 'text', '+1 (555) 000-0000')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('region', 'Region', 'text', 'e.g. North America')}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Active' | 'Inactive' }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

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
              Add Distributor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
