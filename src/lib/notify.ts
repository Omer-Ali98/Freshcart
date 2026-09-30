import { toast } from "react-toastify";

export function notify(message: string, kind: "success" | "error" = "success") {
  if (kind === "error") toast.error(message);
  else toast.success(message);
}
