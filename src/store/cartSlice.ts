"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartResponseType } from "@/api/types/cartType";

interface CartState {
  cart: CartResponseType | null;
  isLoading: boolean;
  error: string;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: "",
};

async function readResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const getCart = createAsyncThunk<CartResponseType>(
  "cart/getCart",
  async () => {
    const response = await fetch("/api/cart", { cache: "no-store" });
    return readResponse(response);
  },
);

export const addToCart = createAsyncThunk<CartResponseType, string>(
  "cart/addToCart",
  async (productId) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    return readResponse(response);
  },
);

export const updateCartItem = createAsyncThunk<
  CartResponseType,
  { productId: string; count: number }
>("cart/updateCartItem", async ({ productId, count }) => {
  const response = await fetch("/api/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, count }),
  });
  return readResponse(response);
});

export const removeCartItem = createAsyncThunk<CartResponseType, string>(
  "cart/removeCartItem",
  async (productId) => {
    const response = await fetch(`/api/cart?productId=${productId}`, {
      method: "DELETE",
    });
    return readResponse(response);
  },
);

export const clearCart = createAsyncThunk<{
  status?: string;
  message?: string;
}>("cart/clearCart", async () => {
  const response = await fetch("/api/cart", { method: "DELETE" });
  return readResponse(response);
});

export const applyCoupon = createAsyncThunk<CartResponseType, string>(
  "cart/applyCoupon",
  async (couponName) => {
    const response = await fetch("/api/cart/coupon", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponName }),
    });
    return readResponse(response);
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.error = "";
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    const start = (state: CartState) => {
      state.isLoading = true;
      state.error = "";
    };
    const failed = (
      state: CartState,
      action: { error: { message?: string } },
    ) => {
      state.isLoading = false;
      state.error = action.error.message || "Something went wrong";
    };
    const loaded = (
      state: CartState,
      action: PayloadAction<CartResponseType>,
    ) => {
      state.isLoading = false;
      state.cart = action.payload;
    };

    builder
      .addCase(applyCoupon.pending, start)
      .addCase(applyCoupon.fulfilled, loaded)
      .addCase(applyCoupon.rejected, failed)
      .addCase(getCart.pending, start)
      .addCase(getCart.fulfilled, loaded)
      .addCase(getCart.rejected, failed)
      .addCase(addToCart.pending, start)
      .addCase(addToCart.fulfilled, loaded)
      .addCase(addToCart.rejected, failed)
      .addCase(updateCartItem.pending, start)
      .addCase(updateCartItem.fulfilled, loaded)
      .addCase(updateCartItem.rejected, failed)
      .addCase(removeCartItem.pending, start)
      .addCase(removeCartItem.fulfilled, loaded)
      .addCase(removeCartItem.rejected, failed)
      .addCase(clearCart.pending, start)
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
      })
      .addCase(clearCart.rejected, failed);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
