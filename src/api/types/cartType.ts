import { ProductType } from "./productType";

export interface CartProduct {
  count: number;
  _id: string;
  product: ProductType;
  price: number;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  createdAt?: string;
  updatedAt?: string;
  totalCartPrice: number;
  totalPriceAfterDiscount?: number;
}

export interface CartResponseType {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}
