// src/components/common/Container.jsx
import { containerClasses } from "@/components/common/containerClasses";

export default function Container({ children, className = "" }) {
  return <div className={`${containerClasses} ${className}`}>{children}</div>;
}
