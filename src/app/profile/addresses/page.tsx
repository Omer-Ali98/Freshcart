"use client";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, FormEvent } from "react";
import { MapPin, Plus, Trash2, Pencil, Phone, Building } from "lucide-react";
import AccountShell from "@/app/_components/account/AccountShell";
import Modal from "@/app/_components/Modal";
import { notify } from "@/lib/notify";
import { AddressesResponse, AddressType } from "@/api/types/commonTypes";
async function request(url: string, init?: RequestInit) {
  const r = await fetch(url, init);
  const j = await r.json();
  if (!r.ok) throw Error(j.message || "Unable to update address");
  return j;
}
export default function AddressesPage() {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const key = ["addresses", session?.user.id];
  const [edit, setEdit] = useState<AddressType | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const q = useQuery<AddressesResponse>({
    queryKey: key,
    enabled: !!session,
    queryFn: () => request("/api/addresses"),
  });
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const body = {
      name: String(f.get("name")).trim(),
      details: String(f.get("details")).trim(),
      phone: String(f.get("phone")).trim(),
      city: String(f.get("city")).trim(),
    };
    try {
      if (!/^01[0125]\d{8}$/.test(body.phone))
        throw Error("Enter a valid Egyptian phone number");
      await request("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (edit) {
        try {
          await request(`/api/addresses?id=${edit._id}`, { method: "DELETE" });
        } catch {
          await qc.invalidateQueries({ queryKey: key });
          setEdit(undefined);
          setNotice(
            "Your new address was saved, but the old address could not be removed. Please remove the old address from the list.",
          );
          notify("New address saved. Remove the old address from your list.", "error");
          return;
        }
      }
      await qc.invalidateQueries({ queryKey: key });
      setNotice(
        edit ? "Address updated successfully" : "Address added successfully",
      );
      notify(edit ? "Address updated successfully" : "Address added successfully");
      setEdit(undefined);
    } catch (e) {
      setError((e as Error).message);
      notify((e as Error).message || "Unable to save address", "error");
    } finally {
      setBusy(false);
    }
  }
  async function remove(a: AddressType) {
    if (!window.confirm(`Remove ${a.name} from your saved addresses?`)) return;
    setBusy(true);
    try {
      await request(`/api/addresses?id=${a._id}`, { method: "DELETE" });
      await qc.invalidateQueries({ queryKey: key });
      setNotice("Address removed");
      notify("Address removed");
    } catch (e) {
      setNotice((e as Error).message);
      notify((e as Error).message || "Unable to remove address", "error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <AccountShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">My Addresses</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your saved delivery addresses
          </p>
        </div>
        <button
          className="btn"
          onClick={() => {
            setError("");
            setEdit(null);
          }}
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>
      {notice && (
        <p role="status" className="feedback mb-5">
          {notice}
        </p>
      )}
      {q.isPending ? (
        <p role="status">Loading addresses...</p>
      ) : q.isError ? (
        <div role="alert">
          <p>{q.error.message}</p>
          <button onClick={() => q.refetch()} className="btn mt-4">
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {q.data?.data.map((a) => (
            <article key={a._id} className="panel flex items-start gap-3 p-5">
              <MapPin size={20} className="mt-1 shrink-0 text-green-600" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold">{a.name}</h3>
                  <div className="flex gap-2">
                    <button
                      aria-label={`Edit ${a.name}`}
                      disabled={busy}
                      onClick={() => {
                        setError("");
                        setEdit(a);
                      }}
                      className="rounded bg-gray-50 p-1.5"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      aria-label={`Delete ${a.name}`}
                      disabled={busy}
                      onClick={() => remove(a)}
                      className="rounded bg-gray-50 p-1.5 text-gray-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-gray-500">
                  {a.details}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} />
                  {a.phone}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <Building size={12} />
                  {a.city}
                </p>
              </div>
            </article>
          ))}
          {!q.data?.data.length && (
            <p className="py-12 text-gray-500">
              No saved addresses yet. Add your first delivery address.
            </p>
          )}
        </div>
      )}
      {edit !== undefined && (
        <Modal
          title={edit ? "Edit Address" : "Add Address"}
          onClose={() => {
            if (!busy) setEdit(undefined);
          }}
        >
          <form onSubmit={save} className="space-y-4">
            {[
              ["name", "Address Name", "Home"],
              ["city", "City", "Cairo"],
              [
                "details",
                "Street Address",
                "Street, building, floor, apartment",
              ],
              ["phone", "Phone Number", "01xxxxxxxxx"],
            ].map(([name, label, placeholder]) => (
              <label key={name} className="block">
                <span className="field-label">{label}</span>
                <input
                  className="field"
                  name={name}
                  type={name === "phone" ? "tel" : "text"}
                  defaultValue={edit?.[name as keyof AddressType] || ""}
                  placeholder={placeholder}
                  minLength={name === "details" ? 5 : 2}
                  required
                />
              </label>
            ))}
            {error && (
              <p role="alert" className="feedback feedback-error">
                {error}
              </p>
            )}
            <button className="btn" disabled={busy}>
              {busy ? "Saving..." : "Save Address"}
            </button>
          </form>
        </Modal>
      )}
    </AccountShell>
  );
}
