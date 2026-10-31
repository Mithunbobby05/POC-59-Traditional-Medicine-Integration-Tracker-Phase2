import type { SourceMetadata } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface DataProvenanceProps {
  sources: SourceMetadata[];
}

export function DataProvenance({ sources }: DataProvenanceProps) {
  const referenceSources = sources.filter((source) => source.url);
  const timestamp = sources[0]?.snapshot_generated_at;
  const formattedTimestamp = timestamp
    ? new Date(`${timestamp}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Unavailable";

  return (
    <section className="provenance-panel" aria-label="Data provenance and source quality">
      <div className="provenance-topline">
        <div className="provenance-status"><span className="provenance-mark">S</span><div><Badge>SYNTHETIC / DEMONSTRATION DATA</Badge><small>All displayed values are illustrative, not real-world statistics.</small></div></div>
        <div className="snapshot-stamp"><span>SYNTHETIC SNAPSHOT GENERATED</span><strong>{formattedTimestamp}</strong></div>
      </div>
      <div className="quality-grid">
        <div><span>DATA STATUS</span><strong>Synthetic demonstration</strong><small>No live healthcare data connected</small></div>
        <div><span>COVERAGE</span><strong>Not applicable</strong><small>Synthetic Gulf-market sample; no real-world coverage claim</small></div>
        <div><span>FRESHNESS</span><strong>Not applicable</strong><small>No source retrieval or update timestamp exists</small></div>
        <div><span>QUALITY / LIMITATIONS</span><strong>Illustrative fixtures</strong><small>Not validated against registries or clinical reports</small></div>
      </div>
      <div className="provenance-links">
        <span>INTENDED FUTURE SOURCES</span>
        <div>{referenceSources.map((source) => <a key={source.dataset} href={source.url ?? undefined} target="_blank" rel="noreferrer">{source.intended_future_source}<span aria-hidden="true"> ↗</span></a>)}</div>
        <small>Links are future reference sources only; they are not the origin of current synthetic values.</small>
      </div>
    </section>
  );
}
