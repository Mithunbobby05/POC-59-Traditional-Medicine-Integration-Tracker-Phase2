import type { AdverseEvent, DashboardSummary } from "@/lib/types";

interface SummaryCardsProps {
  summary: DashboardSummary;
  events: AdverseEvent[];
  regionCode: string;
  modality: string;
}

export function SummaryCards({ summary, events, regionCode, modality }: SummaryCardsProps) {
  const compliance = summary.license_count === 0
    ? 0
    : (summary.compliant_license_count / summary.license_count) * 100;
  const activeAlerts = events.filter((event) => event.alert_status !== "closed"
    && (regionCode === "all" || event.region_code === regionCode)
    && (modality === "all" || event.modality === modality)).length;
  const cards = [
    { label: "REGIONS TRACKED", value: summary.region_count, note: "Regions in this dataset" },
    { label: "MODALITIES", value: summary.modality_count, note: "Modalities in this dataset" },
    { label: "PRACTITIONER LICENSES", value: summary.license_count.toLocaleString(), note: "Synthetic license records" },
    { label: "COMPLIANCE RATE", value: `${compliance.toFixed(1)}%`, note: "Compliant ÷ total licenses" },
    { label: "USAGE OBSERVATIONS", value: summary.usage_observation_count.toLocaleString(), note: "Monthly observations" },
    { label: "ACTIVE ALERTS", value: activeAlerts, note: "Open or monitoring reports" },
  ];

  return (
    <section className="summary-grid" aria-label="Dashboard summary">
      {cards.map((card, index) => (
        <article className={`summary-card summary-card-${index + 1}`} key={card.label}>
          <div className="summary-card-top"><span>{card.label}</span><span className="summary-index">0{index + 1}</span></div>
          <strong>{card.value}</strong>
          <p>{card.note}</p>
        </article>
      ))}
      <p className="summary-scope-note">Dataset totals are global. The active-alert count reflects the selected region and modality filters.</p>
    </section>
  );
}
