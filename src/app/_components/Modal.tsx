"use client";
import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      d?.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[min(800px,90vw)] rounded-xl border-0 bg-white p-7 text-gray-900 shadow-2xl backdrop:bg-black/40"
    >
      <button
        onClick={onClose}
        className="modal-close"
        aria-label="Close dialog"
      >
        <X size={20} />
      </button>
      <h2 className="mb-6 pr-8 text-xl font-bold">{title}</h2>
      {children}
    </dialog>
  );
}
