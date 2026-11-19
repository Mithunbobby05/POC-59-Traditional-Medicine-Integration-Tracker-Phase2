import type {
  AdverseEventsResponse,
  DashboardSummary,
  LicensingMapResponse,
  LicensingRankingsResponse,
  ReferralFlowResponse,
  SourcesResponse,
  UsageTrendsResponse,
} from "./types";

const API_BASE_URL = "";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${path}`);
  }

  return (await response.json()) as T;
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return getJson("/api/dashboard/summary");
}

export function getLicensingMap(): Promise<LicensingMapResponse> {
  return getJson("/api/licensing/map");
}

export function getUsageTrends(): Promise<UsageTrendsResponse> {
  return getJson("/api/usage/trends");
}

export function getAdverseEvents(): Promise<AdverseEventsResponse> {
  return getJson("/api/adverse-events");
}

export function getLicensingRankings(): Promise<LicensingRankingsResponse> {
  return getJson("/api/licensing/rankings");
}

export function getReferralFlow(): Promise<ReferralFlowResponse> {
  return getJson("/api/referrals/flow");
}

export function getSources(): Promise<SourcesResponse> {
  return getJson("/api/sources");
}
