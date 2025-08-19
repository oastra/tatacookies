// useAfterLCP.js
import { useEffect, useState } from "react";

export default function useAfterLCP() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If PerformanceObserver isn't available, just start after idle
    if (!("PerformanceObserver" in window)) {
      const id = setTimeout(() => setReady(true), 600);
      return () => clearTimeout(id);
    }

    let done = false;
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint" && !done) {
          done = true;
          setReady(true);
          po.disconnect();
          break;
        }
      }
    });
    try {
      po.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      setReady(true);
    }
    return () => po.disconnect();
  }, []);

  return ready;
}
