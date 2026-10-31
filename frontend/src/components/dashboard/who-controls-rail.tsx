import type { SourceMetadata } from "@/lib/types";

interface WhoControlsRailProps {
  sources: SourceMetadata[];
}

const controlLayers = [
  { id: "01", title: "Practice & licensing", detail: "Licensing bodies define practitioner authorization and modality scope." },
  { id: "02", title: "System integration", detail: "Health authorities shape service standards and referral pathways." },
  { id: "03", title: "Care delivery", detail: "Conventional-care providers receive referrals and coordinate follow-up." },
  { id: "04", title: "Product oversight", detail: "Product regulators oversee registration and market authorization." },
];

export function WhoControlsRail({ sources }: WhoControlsRailProps) {
  const sourceUrl = (match: string) => sources.find(
    (source) => source.url && source.intended_future_source.includes(match),
  )?.url;
  const references = [
    { label: "WHO Traditional Medicine Strategy", url: sourceUrl("WHO Traditional Medicine Strategy"), type: "Reference framework · contextual only" },
    { label: "MOHAP Licensed Health Workforce Data 2023", url: "https://mohap.gov.ae/en/w/licensed-health-workforce-data_2023-1", type: "Workforce dataset · T&CM counts unverified" },
    { label: "DHA TCAM scope-of-practice guidance", url: sourceUrl("Dubai Health Authority"), type: "Regulatory guidance · specified department reports unverified" },
    { label: "Saudi SFDA herbal-drug listings", url: sourceUrl("Saudi SFDA"), type: "Searchable product listings · no data integration" },
  ];

  return (
    <section className="panel controls-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">GOVERNANCE LAYER</p>
          <h2>Who controls the rail</h2>
        </div>
        <span className="panel-index">07 / STAKEHOLDERS</span>
      </div>
      <p className="panel-description">Policy, licensing, care delivery, and product oversight shape how these pathways can connect.</p>
      <div className="control-layers">
        {controlLayers.map((layer) => (
          <div className="control-layer" key={layer.id}>
            <span className="control-layer-id">{layer.id}</span>
            <div><strong>{layer.title}</strong><p>{layer.detail}</p></div>
          </div>
        ))}
      </div>
      <div className="source-ecosystem">
        <span className="source-ecosystem-label">INTENDED REFERENCE ECOSYSTEM</span>
        <div className="source-reference-grid">
          {references.filter((reference) => reference.url).map((reference) => (
            <a className="source-reference" href={reference.url ?? undefined} target="_blank" rel="noopener noreferrer" key={reference.label}>
              <span>{reference.label}</span>
              <small>{reference.type}<span className="source-external-icon" aria-hidden="true">↗</span></small>
            </a>
          ))}
        </div>
        <p>These links are references, not dashboard data feeds. The MOHAP practitioner-service link failed in the user&apos;s browser test; that does not establish service availability or verify a public T&amp;CM registry. Current dashboard values remain synthetic.</p>
      </div>
    </section>
  );
}
