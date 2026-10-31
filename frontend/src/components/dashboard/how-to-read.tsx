import { Badge } from "@/components/ui/badge";

const readingNotes = [
  ["Tracks", "Practitioner licensing, modality usage, safety signals, and referral stages."],
  ["Compliance", "Compliant licences divided by total licences, multiplied by 100."],
  ["Usage trend", "Monthly synthetic demonstration volumes by modality; not population estimates."],
  ["Adverse-event alerts", "Fictional reports for interface demonstration, not real incidents."],
  ["Referral flow", "Synthetic transition volumes between pathway stages, not observed referrals."],
];

export function HowToRead() {
  return (
    <section className="panel how-to-read" aria-labelledby="how-to-read-title">
      <div className="panel-heading">
        <div><p className="section-kicker">QUICK GUIDE</p><h2 id="how-to-read-title">How to read this dashboard</h2></div>
        <Badge variant="outline">DEMO DATA</Badge>
      </div>
      <p className="how-to-read-intro">This tracker organizes licensing, usage, safety, and conventional-care referral indicators across Gulf markets.</p>
      <ul className="reading-notes">
        {readingNotes.map(([label, note]) => <li key={label}><strong>{label}</strong><span>{note}</span></li>)}
      </ul>
      <p className="how-to-read-disclaimer">All current values are SYNTHETIC / DEMONSTRATION DATA and are not real-world statistics.</p>
    </section>
  );
}
