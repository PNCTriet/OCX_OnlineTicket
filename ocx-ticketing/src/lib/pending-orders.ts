import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.resolve(process.cwd(), 'pending_orders.json');

// Đọc toàn bộ đơn hàng từ file
export function readAllOrders(): Record<string, any> {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return {};
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders file:', err);
    return {};
  }
}

// Ghi toàn bộ đơn hàng vào file
export function writeAllOrders(orders: Record<string, any>) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

// Thêm đơn hàng mới
export function addOrder(orderNumber: string, orderData: any) {
  const orders = readAllOrders();
  orders[orderNumber] = orderData;
  writeAllOrders(orders);
}

// Lấy đơn hàng theo mã
export function getOrder(orderNumber: string) {
  const orders = readAllOrders();
  return orders[orderNumber] || null;
}

// Xóa đơn hàng sau khi đã xử lý
export function removeOrder(orderNumber: string) {
  const orders = readAllOrders();
  delete orders[orderNumber];
  writeAllOrders(orders);
} 