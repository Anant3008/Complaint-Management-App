"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/app/components/Button";
import Select from "@/app/components/Select";

export type Complaint = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Resolved";
  dateSubmitted?: string;
  createdAt?: string;
};

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
];

const priorityOptions = [
  { label: "All", value: "" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export default function AdminTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/complaints", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load complaints");
      setComplaints(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const statusOk = statusFilter ? c.status === statusFilter : true;
      const priorityOk = priorityFilter ? c.priority === priorityFilter : true;
      return statusOk && priorityOk;
    });
  }, [complaints, statusFilter, priorityFilter]);

  const onChangeStatus = async (id: string, status: Complaint["status"]) => {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update status");
      setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this complaint?")) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete");
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">Total Complaints</p>
          <p className="text-3xl font-bold text-zinc-900">{totalCount}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="text-3xl font-bold text-amber-900">{pendingCount}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">In Progress</p>
          <p className="text-3xl font-bold text-blue-900">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-sm text-emerald-700">Resolved</p>
          <p className="text-3xl font-bold text-emerald-900">{resolvedCount}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Filter by Status</label>
            <Select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="w-full sm:w-40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Filter by Priority</label>
            <Select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityOptions}
              className="w-full sm:w-40"
            />
          </div>
          <Button onClick={fetchComplaints} className="w-full sm:w-auto sm:ml-auto">Refresh</Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-300">{error}</div>
        )}

      {loading ? (
        <div className="p-8 text-center text-zinc-600">Loading complaints…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-zinc-50">
                <th className="px-4 py-3 font-semibold text-zinc-900">Title</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Category</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Priority</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Date</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Status</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => {
                const date = c.dateSubmitted || c.createdAt;
                const formatted = date ? new Date(date).toLocaleDateString() : "—";
                return (
                  <React.Fragment key={c._id}>
                    <tr className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{c.title}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          c.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : c.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>{c.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{formatted}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={c.status}
                          onChange={(e) => onChangeStatus(c._id, e.target.value as Complaint["status"])}
                          options={statusOptions.slice(1)}
                          className="w-36"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button onClick={() => setExpandedId((prev) => (prev === c._id ? null : c._id))} className="text-sm px-3 py-1">
                            {expandedId === c._id ? "Hide" : "View"}
                          </Button>
                          <Button onClick={() => onDelete(c._id)} variant="danger" className="text-sm px-3 py-1">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === c._id && (
                      <tr className="bg-zinc-50">
                        <td colSpan={6} className="px-4 py-4 text-zinc-800">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-sm font-semibold text-zinc-900">Description</p>
                              <p className="text-sm text-zinc-700 mt-1">{c.description || "No details provided."}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-zinc-900">Complaint ID</p>
                              <p className="text-xs text-zinc-600 mt-1 font-mono break-all">{c._id}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">
                    No complaints match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
