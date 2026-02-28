"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

interface FormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function NewJourneyPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      next.endDate = "End date cannot be before start date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !validate()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "journeys"), {
        userId: user.uid,
        title: form.title.trim(),
        description: form.description.trim(),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        coverImage: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/dashboard/journeys");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">New Journey</h1>
        <p className="text-zinc-500 text-sm mt-1">Document your next adventure.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field label="Title" required error={errors.title}>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Tokyo Spring Trip"
            className={`w-full bg-zinc-900/80 border ${
              errors.title ? "border-red-500" : "border-zinc-800"
            } text-white placeholder-zinc-600 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500/70 transition-all duration-200`}
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="A short description (optional)"
            rows={3}
            className="w-full bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-600 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500/70 transition-all duration-200 resize-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date" error={errors.startDate}>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="w-full bg-zinc-900/80 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500/70 transition-all duration-200 [color-scheme:dark]"
            />
          </Field>
          <Field label="End date" error={errors.endDate}>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className="w-full bg-zinc-900/80 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500/70 transition-all duration-200 [color-scheme:dark]"
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl px-6 py-2.5 transition-all duration-300 flex items-center gap-2"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? "Saving…" : "Create journey"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl px-5 py-2.5 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-blue-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
