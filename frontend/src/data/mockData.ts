export type ProductCategory = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Packaging' | 'Raw Materials';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMode = 'Credit Card' | 'Bank Transfer' | 'Cash' | 'PayPal' | 'Cheque';
export type WarehouseLocation = 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D' | 'Zone E';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  reorderThreshold: number;
  supplier: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouse: WarehouseLocation;
  quantity: number;
  reorderThreshold: number;
  lastUpdated: string;
}

export interface Distributor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  status: 'Active' | 'Inactive';
  totalOrders: number;
  joinedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentMode: PaymentMode;
  totalAmount: number;
  items: number;
  createdAt: string;
}

export const products: Product[] = [
  { id: 'p1', name: 'Industrial Drill Bit Set', sku: 'TL-001', category: 'Tools', price: 89.99, quantity: 145, reorderThreshold: 50, supplier: 'ToolMaster Inc', createdAt: '2024-01-10' },
  { id: 'p2', name: 'Ergonomic Office Chair', sku: 'FN-002', category: 'Furniture', price: 349.00, quantity: 32, reorderThreshold: 20, supplier: 'FurniCo Ltd', createdAt: '2024-01-15' },
  { id: 'p3', name: 'Wireless Bluetooth Speaker', sku: 'EL-003', category: 'Electronics', price: 129.99, quantity: 8, reorderThreshold: 25, supplier: 'TechWorld', createdAt: '2024-02-01' },
  { id: 'p4', name: 'Heavy Duty Pallet Wrap', sku: 'PK-004', category: 'Packaging', price: 45.50, quantity: 500, reorderThreshold: 100, supplier: 'PackPro', createdAt: '2024-02-05' },
  { id: 'p5', name: 'Standing Desk Frame', sku: 'FN-005', category: 'Furniture', price: 599.00, quantity: 12, reorderThreshold: 15, supplier: 'FurniCo Ltd', createdAt: '2024-02-10' },
  { id: 'p6', name: 'Safety Work Gloves', sku: 'CL-006', category: 'Clothing', price: 18.99, quantity: 3, reorderThreshold: 30, supplier: 'SafeGear', createdAt: '2024-02-15' },
  { id: 'p7', name: '4K Security Camera', sku: 'EL-007', category: 'Electronics', price: 199.99, quantity: 67, reorderThreshold: 20, supplier: 'TechWorld', createdAt: '2024-02-20' },
  { id: 'p8', name: 'Steel Storage Shelving', sku: 'FN-008', category: 'Furniture', price: 275.00, quantity: 25, reorderThreshold: 10, supplier: 'StorePro', createdAt: '2024-03-01' },
  { id: 'p9', name: 'Aluminum Raw Sheet 2mm', sku: 'RM-009', category: 'Raw Materials', price: 22.00, quantity: 7, reorderThreshold: 50, supplier: 'MetalBase', createdAt: '2024-03-05' },
  { id: 'p10', name: 'Cordless Impact Wrench', sku: 'TL-010', category: 'Tools', price: 159.99, quantity: 41, reorderThreshold: 15, supplier: 'ToolMaster Inc', createdAt: '2024-03-10' },
  { id: 'p11', name: 'High-Vis Safety Vest', sku: 'CL-011', category: 'Clothing', price: 14.50, quantity: 120, reorderThreshold: 40, supplier: 'SafeGear', createdAt: '2024-03-15' },
  { id: 'p12', name: 'Industrial Label Printer', sku: 'EL-012', category: 'Electronics', price: 389.00, quantity: 18, reorderThreshold: 8, supplier: 'TechWorld', createdAt: '2024-03-20' },
];

export const inventory: InventoryItem[] = [
  { id: 'inv1', productId: 'p1', productName: 'Industrial Drill Bit Set', sku: 'TL-001', warehouse: 'Zone C', quantity: 145, reorderThreshold: 50, lastUpdated: '2024-05-10' },
  { id: 'inv2', productId: 'p2', productName: 'Ergonomic Office Chair', sku: 'FN-002', warehouse: 'Zone B', quantity: 32, reorderThreshold: 20, lastUpdated: '2024-05-12' },
  { id: 'inv3', productId: 'p3', productName: 'Wireless Bluetooth Speaker', sku: 'EL-003', warehouse: 'Zone A', quantity: 8, reorderThreshold: 25, lastUpdated: '2024-05-14' },
  { id: 'inv4', productId: 'p4', productName: 'Heavy Duty Pallet Wrap', sku: 'PK-004', warehouse: 'Zone D', quantity: 500, reorderThreshold: 100, lastUpdated: '2024-05-14' },
  { id: 'inv5', productId: 'p5', productName: 'Standing Desk Frame', sku: 'FN-005', warehouse: 'Zone B', quantity: 12, reorderThreshold: 15, lastUpdated: '2024-05-15' },
  { id: 'inv6', productId: 'p6', productName: 'Safety Work Gloves', sku: 'CL-006', warehouse: 'Zone E', quantity: 3, reorderThreshold: 30, lastUpdated: '2024-05-15' },
  { id: 'inv7', productId: 'p7', productName: '4K Security Camera', sku: 'EL-007', warehouse: 'Zone A', quantity: 67, reorderThreshold: 20, lastUpdated: '2024-05-16' },
  { id: 'inv8', productId: 'p8', productName: 'Steel Storage Shelving', sku: 'FN-008', warehouse: 'Zone B', quantity: 25, reorderThreshold: 10, lastUpdated: '2024-05-16' },
  { id: 'inv9', productId: 'p9', productName: 'Aluminum Raw Sheet 2mm', sku: 'RM-009', warehouse: 'Zone D', quantity: 7, reorderThreshold: 50, lastUpdated: '2024-05-17' },
  { id: 'inv10', productId: 'p10', productName: 'Cordless Impact Wrench', sku: 'TL-010', warehouse: 'Zone C', quantity: 41, reorderThreshold: 15, lastUpdated: '2024-05-17' },
  { id: 'inv11', productId: 'p11', productName: 'High-Vis Safety Vest', sku: 'CL-011', warehouse: 'Zone E', quantity: 120, reorderThreshold: 40, lastUpdated: '2024-05-18' },
  { id: 'inv12', productId: 'p12', productName: 'Industrial Label Printer', sku: 'EL-012', warehouse: 'Zone A', quantity: 18, reorderThreshold: 8, lastUpdated: '2024-05-18' },
];

export const distributors: Distributor[] = [
  { id: 'd1', name: 'ToolMaster Inc', contactPerson: 'Robert Chen', email: 'r.chen@toolmaster.com', phone: '+1 (555) 201-3344', region: 'North America', status: 'Active', totalOrders: 134, joinedAt: '2022-03-10' },
  { id: 'd2', name: 'FurniCo Ltd', contactPerson: 'Sarah Williams', email: 's.williams@furnico.co', phone: '+1 (555) 302-5567', region: 'Europe', status: 'Active', totalOrders: 89, joinedAt: '2022-06-15' },
  { id: 'd3', name: 'TechWorld', contactPerson: 'James Park', email: 'j.park@techworld.io', phone: '+1 (555) 403-7788', region: 'Asia Pacific', status: 'Active', totalOrders: 212, joinedAt: '2021-11-20' },
  { id: 'd4', name: 'PackPro', contactPerson: 'Linda Torres', email: 'l.torres@packpro.net', phone: '+1 (555) 504-9900', region: 'North America', status: 'Active', totalOrders: 56, joinedAt: '2023-01-05' },
  { id: 'd5', name: 'SafeGear', contactPerson: 'Mike Johnson', email: 'm.johnson@safegear.com', phone: '+1 (555) 605-1122', region: 'North America', status: 'Inactive', totalOrders: 23, joinedAt: '2023-04-18' },
  { id: 'd6', name: 'StorePro', contactPerson: 'Anna Novak', email: 'a.novak@storepro.eu', phone: '+44 20 7946 0001', region: 'Europe', status: 'Active', totalOrders: 77, joinedAt: '2022-09-30' },
  { id: 'd7', name: 'MetalBase', contactPerson: 'David Kim', email: 'd.kim@metalbase.co', phone: '+1 (555) 706-3344', region: 'Asia Pacific', status: 'Active', totalOrders: 44, joinedAt: '2023-07-22' },
];

export const orders: Order[] = [
  { id: 'o1', orderNumber: 'ORD-2024-0581', customerName: 'Apex Manufacturing', customerEmail: 'orders@apexmfg.com', status: 'Delivered', paymentMode: 'Bank Transfer', totalAmount: 4320.50, items: 6, createdAt: '2024-05-01' },
  { id: 'o2', orderNumber: 'ORD-2024-0582', customerName: 'BuildRight Corp', customerEmail: 'procurement@buildright.com', status: 'Shipped', paymentMode: 'Credit Card', totalAmount: 1895.00, items: 3, createdAt: '2024-05-03' },
  { id: 'o3', orderNumber: 'ORD-2024-0583', customerName: 'Metro Office Solutions', customerEmail: 'supply@metroos.com', status: 'Processing', paymentMode: 'Cheque', totalAmount: 6740.00, items: 12, createdAt: '2024-05-05' },
  { id: 'o4', orderNumber: 'ORD-2024-0584', customerName: 'SafetyFirst Ltd', customerEmail: 'orders@safetyfirst.com', status: 'Pending', paymentMode: 'PayPal', totalAmount: 312.75, items: 2, createdAt: '2024-05-07' },
  { id: 'o5', orderNumber: 'ORD-2024-0585', customerName: 'WareHouse Plus', customerEmail: 'wh@warehouseplus.net', status: 'Delivered', paymentMode: 'Bank Transfer', totalAmount: 9150.00, items: 18, createdAt: '2024-05-08' },
  { id: 'o6', orderNumber: 'ORD-2024-0586', customerName: 'Delta Logistics', customerEmail: 'delta@logistics.io', status: 'Cancelled', paymentMode: 'Credit Card', totalAmount: 540.00, items: 4, createdAt: '2024-05-09' },
  { id: 'o7', orderNumber: 'ORD-2024-0587', customerName: 'Greenfield Industries', customerEmail: 'purch@greenfield.com', status: 'Processing', paymentMode: 'Bank Transfer', totalAmount: 3275.25, items: 7, createdAt: '2024-05-10' },
  { id: 'o8', orderNumber: 'ORD-2024-0588', customerName: 'Summit Hardware', customerEmail: 'hw@summithardware.com', status: 'Shipped', paymentMode: 'Cash', totalAmount: 780.00, items: 5, createdAt: '2024-05-11' },
  { id: 'o9', orderNumber: 'ORD-2024-0589', customerName: 'TechCore Systems', customerEmail: 'tc@techcore.io', status: 'Pending', paymentMode: 'Credit Card', totalAmount: 2199.98, items: 2, createdAt: '2024-05-12' },
  { id: 'o10', orderNumber: 'ORD-2024-0590', customerName: 'Central Depot Inc', customerEmail: 'depot@centraldepot.com', status: 'Delivered', paymentMode: 'Bank Transfer', totalAmount: 5640.00, items: 9, createdAt: '2024-05-13' },
];
