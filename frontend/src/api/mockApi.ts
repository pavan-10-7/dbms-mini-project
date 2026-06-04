import axios from 'axios';

const API = 'http://localhost:5000/api';

export async function fetchProducts() {
  const [productsRes, inventoryRes] = await Promise.all([
    axios.get(`${API}/products`),
    axios.get(`${API}/inventory`)
  ]);

  return productsRes.data.map((p: any) => {

    const inventoryItem = inventoryRes.data.find(
      (i: any) => i.product_id === p.id
    );

    return {
      id: String(p.id),

      name: p.name,

      sku: `SKU-${p.id}`,

      category: p.category,

      supplier:
        p.distributors?.name || 'Unknown',

      price: Number(p.price),

      quantity:
        inventoryItem?.quantity || 0,

      reorderThreshold:
        p.reorder_threshold,

      createdAt:
        p.created_at,
    };
  });
}

export async function addProduct(product: any) {

  const distributors = await fetchDistributors();

  const selectedDistributor =
    distributors.find(
      d =>
        d.name.toLowerCase() ===
        product.supplier.toLowerCase()
    );

  if (!selectedDistributor) {
    throw new Error(
      `Distributor "${product.supplier}" not found. Create distributor first.`
    );
  }

  await axios.post(`${API}/products`, {
    name: product.name,
    category: product.category,
    price: product.price,
    reorder_threshold:
      product.reorderThreshold,

    distributor_id:
      Number(selectedDistributor.id),

    quantity:
      product.quantity,

    warehouse_location:
      'Warehouse A'
  });
}

export async function deleteProduct(id: string) {
  await axios.delete(`${API}/products/${id}`);
}

export async function fetchInventory() {
  const res = await axios.get(
    `${API}/inventory`
  );

  return res.data.map((item: any) => ({
    id: item.id,

    productId: item.product_id,

    productName:
      item.products?.name,

    sku: `SKU-${item.product_id}`,

    warehouse:
      item.warehouse_location,

    quantity:
      item.quantity,

    reorderThreshold:
      item.products?.reorder_threshold,

    lastUpdated:
      item.last_updated
  }));
}

export async function fetchDistributors() {
  const res = await axios.get(
    `${API}/distributors`
  );

  return res.data.map((d: any) => ({
    id: String(d.id),

    name: d.name,

    email: d.email,

    phone: d.phone,

    address: d.address,

    totalOrders: 0,

    joinedAt:
      d.created_at || ''
  }));
}

export async function addDistributor(
  distributor: any
) {
  await axios.post(
    `${API}/distributors`,
    distributor
  );
}

export async function deleteDistributor(
  id: string
) {
  await axios.delete(
    `${API}/distributors/${id}`
  );
}

export async function fetchOrders() {
  const res = await axios.get(
    `${API}/orders`
  );

  return res.data.map((o: any) => ({
    id: String(o.id),

    orderNumber: `ORD-${o.id}`,

    customerName:
      o.customers?.name ||
      'Customer',

    customerEmail:
      o.customers?.email ||
      'customer@example.com',

    status:
      o.status || 'Pending',

    paymentMode:
      o.payment_mode || 'Cash',

    totalAmount:
      Number(o.total_amount) || 0,

    items: 1,

    createdAt:
      o.order_date ||
      o.created_at ||
      new Date()
        .toISOString()
        .split('T')[0]
  }));
}

/* ==========================
   SALES
========================== */

export async function fetchCustomers() {

  const res = await axios.get(
    `${API}/customers`
  );

  return res.data;
}

export async function fetchSales() {

  const res = await axios.get(
    `${API}/sales`
  );

  return res.data.map((sale: any) => ({
    id: String(sale.id),

    saleNumber:
      `SAL-${sale.id}`,

    customerName:
      sale.customers?.name ||
      'Customer',

    productName:
      'Inventory Sale',

    sku:
      `ORD-${sale.id}`,

    quantity: 1,

    unitPrice:
      Number(sale.total_amount),

    totalAmount:
      Number(sale.total_amount),

    paymentMode:
      sale.payment_mode,

    createdAt:
      sale.order_date
  }));
}

export async function addSale(
  sale: any
) {

  const customers =
    await fetchCustomers();

  const customer =
    customers.find(
      (c: any) =>
        c.name.toLowerCase() ===
        sale.customerName.toLowerCase()
    );

  if (!customer) {
    throw new Error(
      `Customer "${sale.customerName}" not found`
    );
  }

  const products =
    await fetchProducts();

  const product =
    products.find(
      (p: any) =>
        p.name.toLowerCase() ===
        sale.productName.toLowerCase()
    );

  if (!product) {
    throw new Error(
      `Product "${sale.productName}" not found`
    );
  }

  await axios.post(
    `${API}/sales`,
    {
      customer_id:
        Number(customer.id),

      product_id:
        Number(product.id),

      quantity:
        Number(sale.quantity),

      payment_mode:
        sale.paymentMode
    }
  );
}