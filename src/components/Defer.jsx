// src/components/Defer.jsx
"use client";

export default function Defer({ children, size = "1200px" }) {
  return (
    <section style={{ contentVisibility: "auto", containIntrinsicSize: size }}>
      {children}
    </section>
  );
}
