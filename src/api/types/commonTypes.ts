import { Brand, Category, ProductType, Subcategory } from "./productType";

export interface CategoriesResponse {
  results: number;
  data: Category[];
}

export interface BrandsResponse {
  results: number;
  data: Brand[];
}

export interface SubcategoriesResponse {
  results: number;
  data: Subcategory[];
}

export interface WishlistResponse {
  status: string;
  message?: string;
  count?: number;
  data: ProductType[] | string[];
}

export interface AddressType {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressesResponse {
  status: string;
  results?: number;
  data: AddressType[];
}

export interface OrderItem {
  count: number;
  _id: string;
  product: ProductType;
  price: number;
}

export interface OrderType {
  _id: string;
  id?: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  cartItems: OrderItem[];
  shippingAddress?: {
    details?: string;
    phone?: string;
    city?: string;
  };
}
