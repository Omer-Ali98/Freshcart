"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, FormEvent } from "react";
import { User, Lock, Save } from "lucide-react";
import AccountShell from "@/app/_components/account/AccountShell";
import PasswordInput from "@/app/_components/PasswordInput";
import { changePassword, updateProfile } from "@/api/actions/profile.actions";
import { notify } from "@/lib/notify";
export default function SettingsPage() {
  const { data: session, update, status } = useSession();
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState({ profile: "", password: "" });
  const [errors, setErrors] = useState({ profile: false, password: false });
  async function save(
    e: FormEvent<HTMLFormElement>,
    kind: "profile" | "password",
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(kind);
    setNotice({ ...notice, [kind]: "" });
    try {
      let result;
      if (kind === "profile") {
        const data = {
          name: String(f.get("name")).trim(),
          email: String(f.get("email")).trim(),
          phone: String(f.get("phone")).trim(),
        };
        if (!/^01[0125]\d{8}$/.test(data.phone))
          throw Error("Enter a valid Egyptian phone number");
        result = await updateProfile(data);
        if (result.ok) await update({ user: data });
      } else {
        const data = {
          currentPassword: String(f.get("currentPassword")),
          password: String(f.get("password")),
          rePassword: String(f.get("rePassword")),
        };
        if (data.password !== data.rePassword)
          throw Error("New passwords do not match");
        result = await changePassword(data);
        if (result.ok) {
          await signOut({ callbackUrl: "/login?reset=1" });
          return;
        }
      }
      if (!result.ok) throw Error(result.message);
      setErrors({ ...errors, [kind]: false });
      setNotice({ ...notice, [kind]: "Changes saved successfully." });
      notify("Changes saved successfully.");
    } catch (e) {
      setErrors({ ...errors, [kind]: true });
      setNotice({
        ...notice,
        [kind]: (e as Error).message || "Unable to save changes",
      });
    } finally {
      setBusy("");
    }
  }
  return (
    <AccountShell>
      <h2 className="text-xl font-bold">Account Settings</h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        Update your profile information and change your password
      </p>
      {status === "loading" ? (
        <p>Loading account...</p>
      ) : (
        <div className="account-form space-y-6">
          <section className="panel">
            <div className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <span className="rounded-xl bg-green-100 p-3 text-green-600">
                  <User size={22} />
                </span>
                <div>
                  <h3 className="font-bold">Profile Information</h3>
                  <p className="text-xs text-gray-500">
                    Update your personal details
                  </p>
                </div>
              </div>
              <form
                onSubmit={(e) => save(e, "profile")}
                key={session?.user?.id}
              >
                {[
                  ["name", "Full Name", "text", session?.user?.name],
                  ["email", "Email Address", "email", session?.user?.email],
                  ["phone", "Phone Number", "tel", session?.user?.phone],
                ].map(([name, label, type, value]) => (
                  <label key={name} className="block">
                    <span className="field-label">{label}</span>
                    <input
                      className="field"
                      name={name!}
                      type={type!}
                      defaultValue={value || ""}
                      required
                      minLength={name === "name" ? 3 : undefined}
                      placeholder={name === "phone" ? "01xxxxxxxxx" : undefined}
                    />
                  </label>
                ))}
                {notice.profile && (
                  <p
                    role="status"
                    className={`feedback mb-4 ${errors.profile ? "feedback-error" : ""}`}
                  >
                    {notice.profile}
                  </p>
                )}
                <button disabled={!!busy} className="btn">
                  <Save size={16} />
                  {busy === "profile" ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
            <div className="bg-gray-50 px-6 py-5 text-xs">
              <strong>Account Information</strong>
              <div className="mt-3 flex justify-between text-gray-500">
                <span>User ID</span>
                <span className="break-all">{session?.user.id || "—"}</span>
              </div>
              <div className="mt-3 flex justify-between text-gray-500">
                <span>Role</span>
                <span className="rounded bg-green-100 px-2 py-1 text-green-600">
                  User
                </span>
              </div>
            </div>
          </section>
          <section className="panel p-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <Lock size={22} />
              </span>
              <div>
                <h3 className="font-bold">Change Password</h3>
                <p className="text-xs text-gray-500">
                  Update your account password
                </p>
              </div>
            </div>
            <form onSubmit={(e) => save(e, "password")}>
              {[
                ["currentPassword", "Current Password"],
                ["password", "New Password"],
                ["rePassword", "Confirm New Password"],
              ].map(([name, label]) => (
                <label className="mb-4 block" key={name}>
                  <span className="field-label">{label}</span>
                  <PasswordInput
                    name={name}
                    required
                    minLength={6}
                    autoComplete={
                      name === "currentPassword"
                        ? "current-password"
                        : "new-password"
                    }
                  />
                  {name === "password" && (
                    <span className="text-xs text-gray-400">
                      Must be at least 6 characters
                    </span>
                  )}
                </label>
              ))}
              {notice.password && (
                <p
                  role="alert"
                  className={`feedback mb-4 ${errors.password ? "feedback-error" : ""}`}
                >
                  {notice.password}
                </p>
              )}
              <button
                disabled={!!busy}
                className="btn bg-amber-500! hover:bg-amber-600!"
              >
                <Lock size={16} />
                {busy === "password" ? "Updating..." : "Change Password"}
              </button>
            </form>
          </section>
        </div>
      )}
    </AccountShell>
  );
}
