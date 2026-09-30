"use client";
import { useState, InputHTMLAttributes, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
const PasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function PasswordInput(props, ref) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type={show ? "text" : "password"}
        className={`field pr-11! ${props.className || ""}`}
      />
      <button
        type="button"
        className="absolute right-3 top-3 text-gray-400"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
});
export default PasswordInput;
