"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toast() {
  return <ToastContainer
    position="top-right"
    autoClose={4200}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="light"
    limit={3}
    aria-label="Notifications"
  />;
}
