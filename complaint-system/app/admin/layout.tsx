import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="relative min-h-screen">
      {/* Solid white overlay to fully hide global background accents */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-white" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
