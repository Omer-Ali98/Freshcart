export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG").format(price);
}

export function getDiscount(price: number, priceAfterDiscount?: number) {
  if (!priceAfterDiscount || priceAfterDiscount >= price) return 0;
  return Math.round(((price - priceAfterDiscount) / price) * 100);
}
