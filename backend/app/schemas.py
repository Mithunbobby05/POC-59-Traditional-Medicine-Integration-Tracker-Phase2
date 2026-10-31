from datetime import date
from typing import Literal

from pydantic import BaseModel


DataStatus = Literal["SYNTHETIC / DEMONSTRATION DATA"]
DATA_STATUS: DataStatus = "SYNTHETIC / DEMONSTRATION DATA"
SYNTHETIC_SNAPSHOT_GENERATED_AT = date(2026, 10, 10)


class SourceMetadata(BaseModel):
    dataset: str
    data_status: DataStatus = DATA_STATUS
    source_type: Literal["synthetic_demo"] = "synthetic_demo"
    intended_future_source: str
    note: str
    url: str | None = None
    snapshot_generated_at: date = SYNTHETIC_SNAPSHOT_GENERATED_AT


class Region(BaseModel):
    code: str
    name: str
    country: str
    latitude: float
    longitude: float


class Modality(BaseModel):
    id: str
    name: str


class DashboardSummary(BaseModel):
    data_status: DataStatus = DATA_STATUS
    region_count: int
    modality_count: int
    license_count: int
    compliant_license_count: int
    usage_observation_count: int
    adverse_event_count: int
    referral_volume: int
    source_metadata: list[SourceMetadata]


class LicensingRecord(BaseModel):
    region_code: str
    region_name: str
    country: str
    modality: str
    total_licenses: int
    compliant_licenses: int
    compliance_rate: float


class LicensingMapRegion(BaseModel):
    region: Region
    licensing: list[LicensingRecord]


class LicensingMapResponse(BaseModel):
    data_status: DataStatus = DATA_STATUS
    metric_definition: str
    regions: list[LicensingMapRegion]
    source_metadata: SourceMetadata


class UsageObservation(BaseModel):
    region_code: str
    region_name: str
    modality: str
    period: str
    usage_volume: int


class UsageTrendsResponse(BaseModel):
    data_status: DataStatus = DATA_STATUS
    observations: list[UsageObservation]
    source_metadata: SourceMetadata


class AdverseEvent(BaseModel):
    id: str
    region_code: str
    region_name: str
    modality: str
    severity: Literal["low", "moderate", "high"]
    report_date: date
    alert_status: Literal["open", "monitoring", "closed"]
    short_description: str


class AdverseEventsResponse(BaseModel):
    data_status: DataStatus = DATA_STATUS
    events: list[AdverseEvent]
    source_metadata: SourceMetadata


class LicensingRanking(BaseModel):
    rank: int
    region_code: str
    region_name: str
    country: str
    total_licenses: int
    compliant_licenses: int
    compliance_rate: float


class LicensingRankingsResponse(BaseModel):
    data_status: DataStatus = DATA_STATUS
    metric_definition: str
    rankings: list[LicensingRanking]
    source_metadata: SourceMetadata


class ReferralFlowEdge(BaseModel):
    source: str
    target: str
    volume: int


class ReferralFlowResponse(BaseModel):
    data_status: DataStatus = DATA_STATUS
    unit: str
    flows: list[ReferralFlowEdge]
    source_metadata: SourceMetadata


class SourcesResponse(BaseModel):
    data_status: str = DATA_STATUS
    sources: list[SourceMetadata]
