import type { ReferralFlowEdge } from "@/lib/types";

interface ReferralFlowProps {
  flows: ReferralFlowEdge[];
  unit: string;
}

function describeStage(stage: string, flows: ReferralFlowEdge[], unit: string) {
  const incoming = flows.filter((flow) => flow.target === stage);
  const outgoing = flows.filter((flow) => flow.source === stage);
  const formatVolumes = (edges: ReferralFlowEdge[], end: "source" | "target") => edges.length
    ? edges.map((flow) => `${flow.volume.toLocaleString()} ${unit} ${end === "source" ? `from ${flow.source}` : `to ${flow.target}`}`).join("; ")
    : "None";

  return [
    stage,
    `Incoming: ${formatVolumes(incoming, "source")}`,
    `Outgoing: ${formatVolumes(outgoing, "target")}`,
  ].join("\n");
}

function describeConnection(flow: ReferralFlowEdge, unit: string) {
  return `Source: ${flow.source}\nDestination: ${flow.target}\nVolume: ${flow.volume.toLocaleString()} ${unit}`;
}

export function ReferralFlow({ flows, unit }: ReferralFlowProps) {
  const stages = [...new Set(flows.flatMap((flow) => [flow.source, flow.target]))];

  return (
    <section className="panel referral-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">CARE COORDINATION</p>
          <h2>Conventional-care referral flow</h2>
        </div>
        <span className="panel-index">05 / PATHWAY</span>
      </div>
      <p className="panel-description">Synthetic transitions from complementary care into conventional follow-up.</p>
      {stages.length ? (
        <div className="flow-track" aria-label="Referral flow from traditional care through assessment and conventional care to follow-up">
          {stages.map((stage, index) => {
            const connection = flows.find((flow) => flow.source === stage && flow.target === stages[index + 1]);
            const stageDescription = describeStage(stage, flows, unit);

            return (
              <div className="flow-segment" key={stage}>
                <div
                  className="flow-node"
                  data-tooltip={stageDescription}
                  tabIndex={0}
                  aria-label={stageDescription}
                >
                  <span className="flow-step">0{index + 1}</span>
                  <strong>{stage}</strong>
                </div>
                {connection && (
                  <div
                    className="flow-connector"
                    data-tooltip={describeConnection(connection, unit)}
                    tabIndex={0}
                    role="group"
                    aria-label={describeConnection(connection, unit)}
                  >
                    <span className="flow-volume">{connection.volume.toLocaleString()}</span>
                    <span className="flow-arrow" aria-hidden="true">→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : <p className="panel-empty">Referral flow data is not available.</p>}
      <p className="flow-unit">Flow volumes are synthetic demonstration transitions; they are not observed referral counts.</p>
    </section>
  );
}
