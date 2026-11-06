import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import "./back-to-top.css";

export function BackToTop({ label, hidden = false }: { label: string; hidden?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible || hidden) return null;

  return (
    <button
      aria-label={label}
      className="docs-back-to-top"
      onClick={() => window.scrollTo({
        top: 0,
        left: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      })}
      title={label}
      type="button"
    >
      <ArrowUp aria-hidden="true" size={20} strokeWidth={1.8} />
    </button>
  );
}
