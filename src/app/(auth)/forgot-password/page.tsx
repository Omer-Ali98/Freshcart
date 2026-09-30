import { Suspense } from "react";
import AuthForm from "../_components/AuthForm";
export default function Page() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <AuthForm mode="forgot" />
    </Suspense>
  );
}
