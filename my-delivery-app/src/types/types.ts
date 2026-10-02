// types.ts
export interface ProductItem {
  productId: string;
  quantity: number;
}

export interface DeliveryEntry {
  customerId: string;
  customerData: string;
  products: ProductItem[];
}

export interface FormValues {
  date: string;
  deliveries: DeliveryEntry[];
}