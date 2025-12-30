'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/app/components/Button';

export type Complaint = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  dateSubmitted?: string;
  createdAt?: string;
};

interface AdminTableProps {
  statusFilter?: string;
  priorityFilter?: string;
}

export default function AdminTable({
  statusFilter = 'all',
  priorityFilter = 'all',
}: AdminTableProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/complaints', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load complaints');
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
      const statusOk = statusFilter === 'all' ? true : c.status === statusFilter;
      const priorityOk = priorityFilter === 'all' ? true : c.priority === priorityFilter;
      return statusOk && priorityOk;
    });
  }, [complaints, statusFilter, priorityFilter]);

  const onChangeStatus = async (id: string, status: Complaint['status']) => {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update status');
      setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete');
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const getStatusBadge = (status: Complaint['status']) => {
    const baseClasses = 'inline-block rounded-full px-3 py-1 text-xs font-semibold';
    switch (status) {
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'In Progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Resolved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority: Complaint['priority']) => {
    const baseClasses = 'inline-block rounded-full px-3 py-1 text-xs font-semibold';
    switch (priority) {
      case 'High':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Medium':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'Low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Complaints</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-3xl font-bold text-yellow-900 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">In Progress</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
          <p className="text-sm text-green-700">Resolved</p>
          <p className="text-3xl font-bold text-green-900 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Complaints</h3>
            <button
              onClick={fetchComplaints}
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading complaints…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Priority</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => {
                  const date = c.dateSubmitted || c.createdAt;
                  const formatted = date ? new Date(date).toLocaleDateString() : '—';
                  return (
                    <React.Fragment key={c._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{c.title}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                            {c.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={getPriorityBadge(c.priority)}>{c.priority}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{formatted}</td>
                        <td className="px-6 py-4">
                          <select
                            value={c.status}
                            onChange={(e) => onChangeStatus(c._id, e.target.value as Complaint['status'])}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setExpandedId((prev) => (prev === c._id ? null : c._id))}
                              className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {expandedId === c._id ? 'Hide' : 'View'}
                            </button>
                            <button
                              onClick={() => onDelete(c._id)}
                              className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === c._id && (
                        <tr className="bg-gray-50">
                          <td colSpan={6} className="px-6 py-4 text-gray-800">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Description</p>
                                <p className="text-sm text-gray-700 mt-2">{c.description || 'No details provided.'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Complaint ID</p>
                                <p className="text-xs text-gray-600 mt-2 font-mono break-all">{c._id}</p>
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
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
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
