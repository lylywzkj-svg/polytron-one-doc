import { professionalWorkflowGuides } from "./professionalWorkflowData";
import { priorityWorkflowGuides } from "./priorityWorkflowData";
import { visualSourceDocId } from "./sharedVersionVisuals";
import "./professional-workflow.css";

function workflowGuideForDoc(docId: string) {
  return priorityWorkflowGuides[docId] ?? professionalWorkflowGuides[visualSourceDocId(docId)];
}

export function getProfessionalWorkflowToc(docId: string) {
  const sourceId = visualSourceDocId(docId);
  const guide = workflowGuideForDoc(docId);
  if (!guide) return null;
  return [
    { id: guide.anchor, heading: guide.title },
    ...(sourceId === docId ? guide.blocks : []).map((block, index) => ({
      id: `${guide.anchor}-notes-${index + 1}`,
      heading: block[0],
    })),
  ];
}

export function ProfessionalWorkflowGuide({ docId }: { docId: string }) {
  const sourceId = visualSourceDocId(docId);
  const guide = workflowGuideForDoc(docId);
  if (!guide) return null;
  const isChinese = guide.locale === "zh";

  return (
    <section className="professional-workflow" aria-labelledby={guide.anchor} lang={guide.locale}>
      <header className="professional-workflow-heading">
        <h2 id={guide.anchor}>{guide.title}</h2>
        <p>{guide.intro}</p>
      </header>
      <figure className="professional-workflow-figure">
        <div className="professional-workflow-tools">
          <a href={guide.fullView} target="_blank" rel="noopener noreferrer">
            {isChinese ? "放大查看" : "View Larger"}
          </a>
        </div>
        <div
          className={`professional-workflow-canvas${guide.mobileHtml ? " priority-workflow-canvas" : ""}`}
          role="region"
          aria-label={guide.title}
          // Diagram markup is authored locally and bundled with the application, never supplied by a user or a remote request.
          dangerouslySetInnerHTML={{ __html: guide.svg + (guide.mobileHtml ?? "") }}
        />
        <figcaption>{guide.note}</figcaption>
      </figure>
      {sourceId === docId && <div className="professional-workflow-notes">
        {guide.blocks.map(([heading, paragraphs], index) => (
          <section key={heading} aria-labelledby={`${guide.anchor}-notes-${index + 1}`}>
            <h3 id={`${guide.anchor}-notes-${index + 1}`}>{heading}</h3>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>}
    </section>
  );
}
