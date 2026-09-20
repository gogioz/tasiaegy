"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, Upload, X } from "lucide-react";
import {
  getGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "@/lib/gallery";
import { uploadToCloudinary } from "@/lib/cloudinary";

const EMPTY_FORM = {
  name: "",
  country: "Egypt",
  description: "",
  mediaType: "image",
  url: "",
  publicId: "",
};

export default function DashboardGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function loadItems() {
    setLoading(true);
    try {
      const data = await getGalleryItems();
      setItems(data);
    } catch {
      setError(
        "Couldn't load the gallery. Check your Firebase configuration in .env.local."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(item) {
    setForm({
      name: item.name ?? "",
      country: item.country ?? "Egypt",
      description: item.description ?? "",
      mediaType: item.mediaType ?? "image",
      url: item.url ?? "",
      publicId: item.publicId ?? "",
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleMediaUpload(file) {
    setUploading(true);
    setError(null);
    try {
      const result = await uploadToCloudinary(file, "gallery");
      setForm((f) => ({
        ...f,
        url: result.secure_url,
        publicId: result.public_id,
        mediaType: result.resource_type === "video" ? "video" : "image",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateGalleryItem(editingId, form);
      } else {
        await addGalleryItem({ ...form, order: items.length });
      }
      setShowForm(false);
      await loadItems();
    } catch (err) {
      console.error("Failed to save place:", err);
      const message =
        err?.code === "permission-denied"
          ? "Firestore blocked this write — check your security rules allow signed-in users to write, and that you're still signed in."
          : `Couldn't save this place: ${err?.message ?? "unknown error"}`;
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this place from the gallery?")) return;
    await deleteGalleryItem(id);
    await loadItems();
  }

  const countryGroups = [...new Set(items.map((i) => i.country || "Egypt"))].map(
    (country) => ({
      country,
      items: items.filter((i) => (i.country || "Egypt") === country),
    })
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl italic text-charcoal">
            Gallery
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Places shown on the public Gallery page, grouped by country.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-warm-ivory hover:bg-navy-dark"
        >
          <Plus size={16} />
          New place
        </button>
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-navy/10 px-4 py-3 text-sm text-navy">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-charcoal/60">
          No places yet. Add your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {countryGroups.map(({ country, items: countryItems }) => (
            <div key={country}>
              <h2 className="mb-4 font-display text-xl italic text-charcoal">
                {country}
              </h2>
              <div className="flex flex-col gap-3">
                {countryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white/40 p-4"
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-warm-beige">
                      {item.url && (
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">
                        {item.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-charcoal/60">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(item)}
                      className="rounded-full p-2 text-charcoal/60 hover:bg-warm-beige/60"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-full p-2 text-charcoal/60 hover:bg-navy/10 hover:text-navy"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-6">
          <form
            onSubmit={handleSave}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-warm-ivory p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl italic text-charcoal">
                {editingId ? "Edit place" : "New place"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-charcoal/60">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                  placeholder="The Temple of Karnak"
                />
              </div>

              <div>
                <label className="text-xs text-charcoal/60">Country</label>
                <input
                  required
                  list="country-suggestions"
                  value={form.country}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, country: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                  placeholder="Egypt"
                />
                <datalist id="country-suggestions">
                  {[...new Set(items.map((i) => i.country || "Egypt"))].map(
                    (c) => (
                      <option key={c} value={c} />
                    )
                  )}
                </datalist>
              </div>

              <div>
                <label className="text-xs text-charcoal/60">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="text-xs text-charcoal/60">
                  Image or video
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {form.url && (
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-warm-beige">
                      {form.mediaType === "video" ? (
                        <video src={form.url} className="h-full w-full object-cover" />
                      ) : (
                        <Image
                          src={form.url}
                          alt="Preview"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 hover:bg-warm-beige/60">
                    <Upload size={14} />
                    {uploading ? "Uploading…" : "Upload media"}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMediaUpload(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || uploading || !form.url}
                className="mt-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-warm-ivory hover:bg-navy-dark disabled:opacity-60"
              >
                {saving
                  ? "Saving…"
                  : editingId
                  ? "Save changes"
                  : "Add place"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
