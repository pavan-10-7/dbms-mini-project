import { useEffect, useState } from 'react';
import { Warehouse, AlertTriangle, MapPin, RefreshCw } from 'lucide-react';
import { fetchInventory } from '../api/mockApi';
import { InventoryItem, WarehouseLocation } from '../data/mockData';

const warehouseColors: Record<WarehouseLocation, string> = {
  'Zone A': 'bg-blue-100 text-blue-700',
  'Zone B': 'bg-emerald-100 text-emerald-700',
  'Zone C': 'bg-violet-100 text-violet-700',
  'Zone D': 'bg-amber-100 text-amber-700',
  'Zone E': 'bg-rose-100 text-rose-700',
};

function StockBar({ quantity, threshold }: { quantity: number; threshold: number }) {
  const max = Math.max(quantity, threshold) * 1.5;
  const pct = Math.min((quantity / max) * 100, 100);
  const isLow = quantity <= threshold;
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${isLow ? 'text-amber-600' : 'text-gray-900'}`}>
        {quantity}
      </span>
    </div>
  );
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filterZone, setFilterZone] = useState<WarehouseLocation | 'All'>('All');
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory().then(data => { setInventory(data); setLoading(false); });
  }, []);

  const zones: WarehouseLocation[] = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

  const filtered = inventory.filter(item => {
    const zoneMatch = filterZone === 'All' || item.warehouse === filterZone;
    const stockMatch = !showLowOnly || item.quantity <= item.reorderThreshold;
    return zoneMatch && stockMatch;
  });

  const lowStockCount = inventory.filter(i => i.quantity <= i.reorderThreshold).length;
  const totalUnits = inventory.reduce((s, i) => s + i.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total SKUs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{inventory.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Units</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalUnits.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouses</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{zones.length}</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-xl p-4 bg-amber-50/50">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Low Stock</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{lowStockCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600">Filter by Zone:</span>
        </div>
        {(['All', ...zones] as const).map(zone => (
          <button
            key={zone}
            onClick={() => setFilterZone(zone)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterZone === zone
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {zone}
          </button>
        ))}
        <div className="ml-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLowOnly}
              onChange={e => setShowLowOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-amber-500"
            />
            <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-500" />
              Low stock only
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Inventory Stock Levels</span>
          </div>
          <span className="text-xs text-gray-500">{filtered.length} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Warehouse</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Reorder At</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Updated</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No items match your filter</td>
                </tr>
              ) : (
                filtered.map(item => {
                  const isLow = item.quantity <= item.reorderThreshold;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${isLow ? 'bg-amber-50/40 border-l-2 border-l-amber-400' : ''}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900 text-xs">{item.productName}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{item.sku}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${warehouseColors[item.warehouse]}`}>
                          <MapPin size={10} />
                          {item.warehouse}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StockBar quantity={item.quantity} threshold={item.reorderThreshold} />
                      </td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell">
                        <span className="text-xs text-gray-500 flex items-center justify-end gap-1">
                          <RefreshCw size={10} className="text-gray-400" />
                          {item.reorderThreshold}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 hidden lg:table-cell">{item.lastUpdated}</td>
                      <td className="px-5 py-3.5 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <AlertTriangle size={10} />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
