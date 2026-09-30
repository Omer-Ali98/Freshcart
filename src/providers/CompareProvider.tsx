"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, RefreshCw } from "lucide-react";
import { ProductType } from "@/api/types/productType";
import Modal from "@/app/_components/Modal";
const Context = createContext<{
  items: ProductType[];
  toggle: (p: ProductType) => void;
}>({ items: [], toggle: () => { } });
export const useCompare = () => useContext(Context);

function productValue(product: ProductType, label: string) {
  if (label === "Price") return `${product.priceAfterDiscount ?? product.price} EGP`;
  if (label === "Brand") return product.brand?.name;
  if (label === "Category") return product.category?.name;
  if (label === "Rating") return `${product.ratingsAverage} / 5`;
  return product.quantity > 0 ? "In stock" : "Out of stock";
}

export default function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProductType[]>([]);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  function toggle(p: ProductType) {
    if (items.some((i) => i._id === p._id)) {
      setItems(items.filter((i) => i._id !== p._id));
      return;
    }
    if (items.length >= 4) {
      setNotice("Compare up to 4 products. Remove one to add another.");
      setOpen(true);
      return;
    }
    setItems([...items, p]);
  }
  return (
    <Context.Provider value={{ items, toggle }}>
      {children}
      {items.length > 0 && (
        <button
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm text-white shadow-xl"
          onClick={() => setOpen(true)}
        >
          <RefreshCw size={17} />
          Compare ({items.length})
        </button>
      )}
      {open && (
        <Modal
          title="Compare products"
          onClose={() => {
            setOpen(false);
            setNotice("");
          }}
        >
          {notice && (
            <p role="status" className="feedback mb-5">
              {notice}
            </p>
          )}
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                <tr>
                  <th className="pr-5">Product</th>
                  {items.map((p) => (
                    <td key={p._id} className="min-w-40 p-3">
                      <button
                        aria-label={`Remove ${p.title}`}
                        onClick={() => toggle(p)}
                      >
                        <X size={16} />
                      </button>
                      <Image
                        src={p.imageCover}
                        alt={p.title}
                        width={130}
                        height={130}
                        className="mx-auto h-32 object-contain"
                      />
                      <Link
                        href={`/products/${p._id}`}
                        onClick={() => setOpen(false)}
                        className="mt-3 block font-semibold text-green-600"
                      >
                        {p.title}
                      </Link>
                    </td>
                  ))}
                </tr>
                {["Price", "Brand", "Category", "Rating", "Stock"].map(
                  (label) => (
                    <tr key={label} className="border-t border-gray-100">
                      <th className="py-4 pr-5">{label}</th>
                      {items.map((p) => (
                        <td key={p._id} className="p-3">
                          {productValue(p, label)}
                        </td>
                      ))}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          {!items.length && <p>No products selected.</p>}
        </Modal>
      )}
    </Context.Provider>
  );
}
