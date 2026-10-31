import type { AdverseEvent } from "@/lib/types";
import { matchesSearchTerms, parseSearchTerms } from "@/lib/search";

interface AdverseEventsProps {
  events: AdverseEvent[];
  regionCode: string;
  modality: string;
  search: string;
}

const severityOrder = { high: 0, moderate: 1, low: 2 };

export function AdverseEvents({ events, regionCode, modality, search }: AdverseEventsProps) {
  const searchTerms = parseSearchTerms(search);
  const visibleEvents = events
    .filter((event) => (regionCode === "all" || event.region_code === regionCode)
      && (modality === "all" || event.modality === modality)
      && matchesSearchTerms([event.region_name, event.region_code, event.modality], searchTerms))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]
      || b.report_date.localeCompare(a.report_date));

  return (
    <section className="panel alerts-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">SAFETY SIGNALS</p>
          <h2>Adverse-event alerts</h2>
        </div>
        <span className="count-pill">{visibleEvents.length.toString().padStart(2, "0")} REPORTS</span>
      </div>
      <p className="panel-description">Fictional demonstration reports; not medical incidents or clinical guidance.</p>
      <div className="alert-list">
        {visibleEvents.length ? visibleEvents.map((event) => (
          <article className={`alert-item severity-${event.severity}`} key={event.id}>
            <span className="severity-mark" aria-label={`${event.severity} severity`} />
            <div className="alert-content">
              <div className="alert-meta">
                <span className={`severity-label severity-text-${event.severity}`}>{event.severity}</span>
                <span>{event.modality}</span>
                <span>{event.region_name}</span>
              </div>
              <p>{event.short_description}</p>
              <div className="alert-footer">
                <time dateTime={event.report_date}>{new Date(`${event.report_date}T00:00:00`).toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" })}</time>
                <span className={`alert-status status-${event.alert_status}`}>{event.alert_status}</span>
              </div>
            </div>
          </article>
        )) : <p className="panel-empty">No reports match the selected filters.</p>}
      </div>
    </section>
  );
}
