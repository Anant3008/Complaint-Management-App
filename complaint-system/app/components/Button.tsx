"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "danger";
};

export default function Button({ loading, variant = "primary", className = "", children, ...props }: Props) {
  const baseClasses =
    variant === "danger"
      ? "rounded-md bg-red-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
      : "rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white shadow-sm transition-colors hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-600";

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed ${baseClasses} ${className}`}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}
