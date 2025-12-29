"use client";
import React from "react";
import AdminTable from "../components/AdminTable";

export default function AdminPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold text-zinc-900">
              Complaints Dashboard
            </h1>
            <p className="text-base text-zinc-600">Manage all user complaints in one place. View, update, and resolve issues efficiently.</p>
          </div>
        </header>
        <AdminTable />
      </div>
    </div>
  );
}
