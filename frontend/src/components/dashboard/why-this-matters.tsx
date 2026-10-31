const reasons = [
  { number: "01", title: "Licensing visibility", copy: "Compare how practitioner authorization is represented across regions and modalities." },
  { number: "02", title: "Usage patterns", copy: "Use illustrative activity patterns to frame where oversight questions may arise." },
  { number: "03", title: "Safety signals", copy: "Review illustrative adverse-event examples alongside modality and jurisdiction." },
  { number: "04", title: "Referral pathways", copy: "Explore an illustrative path from complementary care through conventional assessment and follow-up." },
];

export function WhyThisMatters() {
  return (
    <section className="panel why-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">CONTEXT</p>
          <h2>Why this matters</h2>
        </div>
        <span className="panel-index">06 / RATIONALE</span>
      </div>
      <p className="why-lead">Integration needs a clear view of the systems around care.</p>
      <div className="why-list">
        {reasons.map((reason) => (
          <div className="why-item" key={reason.number}>
            <span>{reason.number}</span>
            <div><strong>{reason.title}</strong><p>{reason.copy}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
