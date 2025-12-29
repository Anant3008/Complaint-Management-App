"use client";
import React from "react";

type Option = { label: string; value: string };

type Props = {
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabelledBy?: string;
};

export default function RadioGroup({ name, options, value, onChange, className = "", ariaLabelledBy }: Props) {
  return (
    <fieldset className={`flex gap-3 ${className}`} aria-labelledby={ariaLabelledBy}>
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors
              ${checked ? "border-indigo-400 bg-indigo-50 text-zinc-900" : "border-zinc-300 bg-white text-zinc-800"}
              hover:border-indigo-500`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 accent-indigo-600"
            />
            {opt.label}
          </label>
        );
      })}
    </fieldset>
  );
}
