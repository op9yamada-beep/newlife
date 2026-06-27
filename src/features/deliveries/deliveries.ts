// 型定義
export type ProductItem = {
  productId: string;
  quantity: number;
};

export type DeliveryItem = {
  customerId: string;
  products: ProductItem[];
};

export type FormValues = {
  date: string;
  deliveries: DeliveryItem[];
};