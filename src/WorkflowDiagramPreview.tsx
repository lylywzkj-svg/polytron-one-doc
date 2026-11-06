import { X } from "lucide-react";
import { useLayoutEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProfessionalWorkflowData } from "./professionalWorkflowData";

function DiagramDialog({ guide, onClose }: { guide: ProfessionalWorkflowData; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isChinese = guide.locale === "zh";
  // Keep the enlarged SVG's accessible labels and arrow markers separate from the inline copy.
  const svg = guide.svg
    .replace(/\sid="([^"]+)"/g, ' id="$1-preview"')
    .replace(/url\(#([^)]+)\)/g, 'url(#$1-preview)')
    .replace(/\b(aria-labelledby|aria-describedby)="([^"]+)"/g, (_, attribute: string, ids: string) =>
      `${attribute}="${ids.split(/\s+/).map(id => `${id}-preview`).join(" ")}"`);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-modal="true"
      className="professional-workflow professional-workflow-dialog"
      lang={guide.locale}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <header className="workflow-dialog-header">
        <h2 id={titleId}>{guide.title}</h2>
        <button type="button" aria-label={isChinese ? "关闭预览" : "Close preview"} onClick={onClose} autoFocus>
          <X aria-hidden="true" size={20} />
        </button>
      </header>
      <div className="workflow-dialog-body" tabIndex={0} role="region" aria-label={guide.title}>
        <div
          className={`professional-workflow-canvas${guide.mobileHtml ? " priority-workflow-canvas" : ""}`}
          // Only locally authored, bundled diagram markup is rendered here.
          dangerouslySetInnerHTML={{ __html: svg + (guide.mobileHtml ?? "") }}
        />
      </div>
      <p className="workflow-dialog-note">{guide.note}</p>
    </dialog>,
    document.body,
  );
}

export function WorkflowDiagramPreview({ guide }: { guide: ProfessionalWorkflowData }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="professional-workflow-tools">
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {guide.locale === "zh" ? "放大查看" : "View Larger"}
      </button>
      {open && <DiagramDialog guide={guide} onClose={() => setOpen(false)} />}
    </div>
  );
}
