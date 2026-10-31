export type DataStatus = "SYNTHETIC / DEMONSTRATION DATA";

export interface SourceMetadata {
  dataset: string;
  data_status: DataStatus;
  source_type: "synthetic_demo";
  intended_future_source: string;
  note: string;
  url: string | null;
  snapshot_generated_at: string;
}

export interface Region {
  code: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Modality {
  id: string;
  name: string;
}

export interface DashboardSummary {
  data_status: DataStatus;
  region_count: number;
  modality_count: number;
  license_count: number;
  compliant_license_count: number;
  usage_observation_count: number;
  adverse_event_count: number;
  referral_volume: number;
  source_metadata: SourceMetadata[];
}

export interface LicensingRecord {
  region_code: string;
  region_name: string;
  country: string;
  modality: string;
  total_licenses: number;
  compliant_licenses: number;
  compliance_rate: number;
}

export interface LicensingMapRegion {
  region: Region;
  licensing: LicensingRecord[];
}

export interface LicensingMapResponse {
  data_status: DataStatus;
  metric_definition: string;
  regions: LicensingMapRegion[];
  source_metadata: SourceMetadata;
}

export interface UsageObservation {
  region_code: string;
  region_name: string;
  modality: string;
  period: string;
  usage_volume: number;
}

export interface UsageTrendsResponse {
  data_status: DataStatus;
  observations: UsageObservation[];
  source_metadata: SourceMetadata;
}

export type AdverseEventSeverity = "low" | "moderate" | "high";
export type AdverseEventStatus = "open" | "monitoring" | "closed";

export interface AdverseEvent {
  id: string;
  region_code: string;
  region_name: string;
  modality: string;
  severity: AdverseEventSeverity;
  report_date: string;
  alert_status: AdverseEventStatus;
  short_description: string;
}

export interface AdverseEventsResponse {
  data_status: DataStatus;
  events: AdverseEvent[];
  source_metadata: SourceMetadata;
}

export interface LicensingRanking {
  rank: number;
  region_code: string;
  region_name: string;
  country: string;
  total_licenses: number;
  compliant_licenses: number;
  compliance_rate: number;
}

export interface LicensingRankingsResponse {
  data_status: DataStatus;
  metric_definition: string;
  rankings: LicensingRanking[];
  source_metadata: SourceMetadata;
}

export interface ReferralFlowEdge {
  source: string;
  target: string;
  volume: number;
}

export interface ReferralFlowResponse {
  data_status: DataStatus;
  unit: string;
  flows: ReferralFlowEdge[];
  source_metadata: SourceMetadata;
}

export interface SourcesResponse {
  data_status: DataStatus;
  sources: SourceMetadata[];
}
