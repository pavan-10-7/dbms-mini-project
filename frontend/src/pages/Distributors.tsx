import { useEffect, useState } from 'react';
import { Plus, Trash2, Truck, Globe, Mail, Phone, ShoppingBag } from 'lucide-react';
import { fetchDistributors, addDistributor, deleteDistributor } from '../api/mockApi';
import { Distributor } from '../data/mockData';
import AddDistributorModal from '../components/modals/AddDistributorModal';

export default function Distributors() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => fetchDistributors().then(d => { setDistributors(d); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleAdd = async (distributor: Omit<Distributor, 'id' | 'totalOrders' | 'joinedAt'>) => {
    await addDistributor(distributor);
    await load();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDistributor(id);
    setDeleteId(null);
    await load();
  };

  const activeCount = distributors.filter(d => d.status === 'Active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">{distributors.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500">Active</p>
            <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500">Inactive</p>
            <p className="text-xl font-bold text-gray-400">{distributors.length - activeCount}</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Distributor</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {distributors.map(d => (
          <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {d.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {d.status}
                </span>
                <button
                  onClick={() => setDeleteId(d.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail size={12} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{d.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone size={12} className="text-gray-400 flex-shrink-0" />
                {d.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Globe size={12} className="text-gray-400 flex-shrink-0" />
                {d.region}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <ShoppingBag size={12} />
                <span><strong className="text-gray-800">{d.totalOrders}</strong> orders</span>
              </div>
              <span className="text-xs text-gray-400">Since {d.joinedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddDistributorModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Truck size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Remove Distributor</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to remove <strong>{distributors.find(d => d.id === deleteId)?.name}</strong>?
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
