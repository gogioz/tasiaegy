"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, Upload, X } from "lucide-react";
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/lib/programs";
import { uploadToCloudinary } from "@/lib/cloudinary";

const EMPTY_FORM = {
  title: "",
  tag: "Signature",
  duration: "",
  route: "",
  summary: "",
  coverImageUrl: "",
  coverImagePublicId: "",
};

export default function DashboardProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function loadPrograms() {
    setLoading(true);
    try {
      const data = await getPrograms();
      setPrograms(data);
    } catch {
      setError(
        "Couldn't load programs. Check your Firebase configuration in .env.local."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(program) {
    setForm({
      title: program.title,
      tag: program.tag,
      duration: program.duration,
      route: program.route,
      summary: program.summary,
      coverImageUrl: program.coverImageUrl,
      coverImagePublicId: program.coverImagePublicId ?? "",
    });
    setEditingId(program.id);
    setShowForm(true);
  }

  async function handleImageUpload(file) {
    setUploading(true);
    setError(null);
    try {
      const result = await uploadToCloudinary(file, "programs");
      setForm((f) => ({
        ...f,
        coverImageUrl: result.secure_url,
        coverImagePublicId: result.public_id,
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
        await updateProgram(editingId, { ...form, order: undefined });
      } else {
        await createProgram({ ...form, order: programs.length });
      }
      setShowForm(false);
      await loadPrograms();
    } catch (err) {
      console.error("Failed to save program:", err);
      const message =
        err?.code === "permission-denied"
          ? "Firestore blocked this write — check your security rules allow signed-in users to write, and that you're still signed in."
          : `Couldn't save this program: ${err?.message ?? "unknown error"}`;
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this program? This can't be undone.")) return;
    await deleteProgram(id);
    await loadPrograms();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl italic text-charcoal">
            Programs
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Manage the journeys shown on the public site.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-warm-ivory hover:bg-navy-dark"
        >
          <Plus size={16} />
          New program
        </button>
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-navy/10 px-4 py-3 text-sm text-navy">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading…</p>
      ) : programs.length === 0 ? (
        <p className="text-sm text-charcoal/60">
          No programs yet. Create your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white/40 p-4"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-warm-beige">
                {program.coverImageUrl && (
                  <Image
                    src={program.coverImageUrl}
                    alt={program.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">
                  {program.title}
                </p>
                <p className="mt-0.5 text-xs text-charcoal/60">
                  {program.tag} · {program.duration} · {program.route}
                </p>
              </div>
              <button
                onClick={() => startEdit(program)}
                className="rounded-full p-2 text-charcoal/60 hover:bg-warm-beige/60"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="rounded-full p-2 text-charcoal/60 hover:bg-navy/10 hover:text-navy"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
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
                {editingId ? "Edit program" : "New program"}
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
                <label className="text-xs text-charcoal/60">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                  placeholder="The Long Exodus"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-charcoal/60">Tag</label>
                  <select
                    value={form.tag}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tag: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                  >
                    <option>Signature</option>
                    <option>New</option>
                    <option>Classic</option>
                    <option>Limited</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-charcoal/60">Duration</label>
                  <input
                    required
                    value={form.duration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                    placeholder="14 days"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-charcoal/60">Route</label>
                <input
                  required
                  value={form.route}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, route: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                  placeholder="Cairo to Aswan"
                />
              </div>

              <div>
                <label className="text-xs text-charcoal/60">Summary</label>
                <textarea
                  required
                  rows={3}
                  value={form.summary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, summary: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="text-xs text-charcoal/60">
                  Cover image
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {form.coverImageUrl && (
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-warm-beige">
                      <Image
                        src={form.coverImageUrl}
                        alt="Cover preview"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 hover:bg-warm-beige/60">
                    <Upload size={14} />
                    {uploading ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="mt-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-warm-ivory hover:bg-navy-dark disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Create program"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
