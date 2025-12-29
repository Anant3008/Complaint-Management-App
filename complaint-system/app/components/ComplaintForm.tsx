"use client";
import React, { useState } from "react";
import FormField from "@/app/components/FormField";
import Select from "@/app/components/Select";
import RadioGroup from "@/app/components/RadioGroup";
import Button from "@/app/components/Button";

const categories = [
  { label: "Product", value: "Product" },
  { label: "Service", value: "Service" },
  { label: "Support", value: "Support" },
];

const priorities = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export default function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0].value);
  const [priority, setPriority] = useState(priorities[1].value);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, priority, status: "Pending" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit complaint");
      }

      setMessage("Complaint submitted successfully");
      setTitle("");
      setDescription("");
      setCategory(categories[0].value);
      setPriority(priorities[1].value);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-gradient-to-b from-indigo-50 to-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-zinc-900">Submit a Complaint</h2>

      <FormField id="title" label="Title" error={!title ? "Title is required" : undefined} required>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of your complaint"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-700"
        />
      </FormField>

      <FormField id="description" label="Description" hint="Provide more details (optional)">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the issue..."
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-700"
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField id="category" label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} options={categories} />
        </FormField>

        <FormField id="priority" label="Priority" hint="Choose how urgent this is">
          <RadioGroup name="priority" options={priorities} value={priority} onChange={setPriority} />
        </FormField>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" loading={loading} disabled={!title || loading}>
          Submit Complaint
        </Button>
        {message && (
          <span role="status" aria-live="polite" className="rounded-md bg-green-50 px-2 py-1 text-sm text-green-800 ring-1 ring-green-300">
            {message}
          </span>
        )}
        {error && (
          <span role="alert" aria-live="assertive" className="rounded-md bg-red-50 px-2 py-1 text-sm text-red-800 ring-1 ring-red-300">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
