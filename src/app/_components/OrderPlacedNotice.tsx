"use client";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function OrderPlacedNotice() {
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.success("Order placed successfully!", { toastId: "order-placed" });
  }, []);
  return null;
}
