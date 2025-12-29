"use client";
import ComplaintForm from "@/app/components/ComplaintForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <header className="mb-8">
          <h1 className="bg-gradient-to-r from-indigo-700 via-violet-700 to-sky-600 bg-clip-text text-3xl font-extrabold text-transparent">
            Complaint Management
          </h1>
          <p className="text-zinc-700">Submit your complaint below.</p>
        </header>
        <ComplaintForm />
      </div>
    </div>
  );
}
