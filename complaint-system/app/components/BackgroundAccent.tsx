"use client";

export default function BackgroundAccent() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Top-left glow */}
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 opacity-50 blur-3xl dark:from-indigo-900 dark:to-violet-900" />
      {/* Bottom-right glow */}
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-sky-200 to-teal-200 opacity-40 blur-3xl dark:from-sky-900 dark:to-teal-900" />
      {/* Center soft bloom */}
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-pink-100 to-purple-200 opacity-30 blur-[100px] dark:from-pink-900 dark:to-purple-900" />
    </div>
  );
}
