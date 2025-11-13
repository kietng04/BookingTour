import { useState, useEffect } from "react";
import Button from "../common/Button.jsx";

export default function UserEditModal({ open, user, onClose, onSubmit }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (open && user) {
      setForm({
        id: user.id || user._id,
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        provider: user.provider || "local",
        isOAuth: !!user.isOAuth,
        status: user.status || "active",
      });
    }
  }, [open, user]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded shadow-lg w-full max-w-md p-6 z-10">
        <h3 className="text-lg font-medium mb-4">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullName"
            value={form.fullName || ""}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full border p-2 rounded"
          />
          <input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border p-2 rounded"
          />
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isOAuth"
                checked={form.isOAuth || false}
                onChange={handleChange}
              />{" "}
              OAUTH
            </label>
            <select
              name="status"
              value={form.status || "active"}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
