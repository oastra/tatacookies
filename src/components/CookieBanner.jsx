// src/components/CookieBanner.jsx
"use client";
import { useEffect, useState } from "react";

const KEY = "tc_cookie_consent"; // localStorage key

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const val = localStorage.getItem(KEY);
    if (!val) setOpen(true);
  }, []);

  const accept = () => {
    window.acceptAnalytics?.();
    localStorage.setItem(KEY, "accepted");
    setOpen(false);
  };

  const reject = () => {
    window.rejectAnalytics?.();
    localStorage.setItem(KEY, "rejected");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[92vw] max-w-[780px] rounded-xl bg-white shadow-xl border border-neutral-200 p-4 md:p-5">
      <p className="text-sm md:text-[15px] text-neutral-800">
        We use cookies for essential functionality and, with your consent,
        Google Analytics to improve our site. You can change your choice later
        in your browser.
      </p>
      <div className="mt-3 flex gap-2 justify-end">
        <button
          onClick={reject}
          className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700"
          aria-label="Reject analytics cookies"
        >
          Reject
        </button>
        <button
          onClick={accept}
          className="px-4 py-2 rounded-lg bg-black text-white"
          aria-label="Accept analytics cookies"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
