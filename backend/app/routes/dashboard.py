from fastapi import APIRouter
import pandas as pd

from app import data
from app.schemas import (
    AdverseEventsResponse,
    DashboardSummary,
    LicensingMapRegion,
    LicensingMapResponse,
    LicensingRanking,
    LicensingRankingsResponse,
    ReferralFlowResponse,
    SourcesResponse,
    UsageTrendsResponse,
)


router = APIRouter()


@router.get("/api/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary() -> DashboardSummary:
    return DashboardSummary(
        region_count=len(data.REGIONS),
        modality_count=len(data.MODALITIES),
        license_count=sum(row.total_licenses for row in data.LICENSING_RECORDS),
        compliant_license_count=sum(row.compliant_licenses for row in data.LICENSING_RECORDS),
        usage_observation_count=len(data.USAGE_OBSERVATIONS),
        adverse_event_count=len(data.ADVERSE_EVENTS),
        referral_volume=data.REFERRAL_FLOWS[0].volume,
        source_metadata=[data.SUMMARY_SOURCE],
    )


@router.get("/api/licensing/map", response_model=LicensingMapResponse)
def get_licensing_map() -> LicensingMapResponse:
    region_rows = [
        LicensingMapRegion(
            region=region,
            licensing=[row for row in data.LICENSING_RECORDS if row.region_code == region.code],
        )
        for region in data.REGIONS
    ]
    return LicensingMapResponse(
        metric_definition="compliance_rate = (compliant_licenses / total_licenses) * 100; displayed to one decimal place",
        regions=region_rows,
        source_metadata=data.LICENSING_SOURCE,
    )


@router.get("/api/usage/trends", response_model=UsageTrendsResponse)
def get_usage_trends() -> UsageTrendsResponse:
    return UsageTrendsResponse(
        observations=data.USAGE_OBSERVATIONS,
        source_metadata=data.USAGE_SOURCE,
    )


@router.get("/api/adverse-events", response_model=AdverseEventsResponse)
def get_adverse_events() -> AdverseEventsResponse:
    return AdverseEventsResponse(
        events=data.ADVERSE_EVENTS,
        source_metadata=data.ADVERSE_EVENT_SOURCE,
    )


@router.get("/api/licensing/rankings", response_model=LicensingRankingsResponse)
def get_licensing_rankings() -> LicensingRankingsResponse:
    # Pandas performs the same per-region aggregation used by the rankings table.
    licensing_frame = pd.DataFrame([row.model_dump() for row in data.LICENSING_RECORDS])
    grouped = licensing_frame.groupby(
        ["region_code", "region_name", "country"], as_index=False
    )[["total_licenses", "compliant_licenses"]].sum()
    grouped["compliance_rate"] = (
        grouped["compliant_licenses"] / grouped["total_licenses"] * 100
    ).round(1)
    sorted_regions = grouped.sort_values("compliance_rate", ascending=False).to_dict(orient="records")
    rankings = [
        LicensingRanking(
            rank=index,
            region_code=row["region_code"],
            region_name=row["region_name"],
            country=row["country"],
            total_licenses=int(row["total_licenses"]),
            compliant_licenses=int(row["compliant_licenses"]),
            compliance_rate=float(row["compliance_rate"]),
        )
        for index, row in enumerate(sorted_regions, start=1)
    ]
    return LicensingRankingsResponse(
        metric_definition="Regional compliance rate = (sum of compliant licenses / sum of total licenses across modalities) * 100; displayed to one decimal place.",
        rankings=rankings,
        source_metadata=data.LICENSING_SOURCE,
    )


@router.get("/api/referrals/flow", response_model=ReferralFlowResponse)
def get_referral_flow() -> ReferralFlowResponse:
    return ReferralFlowResponse(
        unit="synthetic demonstration referral transitions",
        flows=data.REFERRAL_FLOWS,
        source_metadata=data.REFERRAL_SOURCE,
    )


@router.get("/api/sources", response_model=SourcesResponse)
def get_sources() -> SourcesResponse:
    return SourcesResponse(sources=data.SOURCE_METADATA)
