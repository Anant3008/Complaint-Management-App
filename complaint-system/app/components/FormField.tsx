"use client";
import React from "react";

type Props = {
  id: string;
  label: string;
  children: React.ReactElement<any>;
  hint?: string;
  error?: string;
  required?: boolean;
};

export default function FormField({ id, label, children, hint, error, required }: Props) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const labelId = `${id}-label`;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const enhancedChild = React.cloneElement(children, {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error) || undefined,
    "aria-required": required || undefined,
    "aria-labelledby": labelId,
  });

  return (
    <div className="mb-4">
      <label id={labelId} htmlFor={id} className="mb-1 block text-sm font-medium text-zinc-900">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden>*</span>}
      </label>
      {enhancedChild}
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-zinc-700">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
