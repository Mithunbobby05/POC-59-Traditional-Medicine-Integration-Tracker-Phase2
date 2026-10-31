from datetime import date

from app.schemas import (
    AdverseEvent,
    LicensingRecord,
    Modality,
    Region,
    ReferralFlowEdge,
    SourceMetadata,
    UsageObservation,
)


SYNTHETIC_STATUS = "SYNTHETIC / DEMONSTRATION DATA"

REGIONS = [
    Region(code="AE", name="United Arab Emirates", country="United Arab Emirates", latitude=24.4539, longitude=54.3773),
    Region(code="SA", name="Saudi Arabia", country="Saudi Arabia", latitude=24.7136, longitude=46.6753),
    Region(code="QA", name="Qatar", country="Qatar", latitude=25.2854, longitude=51.5310),
]

MODALITIES = [
    Modality(id="ayurveda", name="Ayurveda"),
    Modality(id="unani", name="Unani"),
    Modality(id="acupuncture", name="Acupuncture"),
    Modality(id="cupping", name="Cupping"),
    Modality(id="herbal-medicine", name="Herbal Medicine"),
]

LICENSING_COUNTS = {
    "AE": {"Ayurveda": (120, 112), "Unani": (84, 76), "Acupuncture": (96, 91), "Cupping": (110, 101), "Herbal Medicine": (72, 64)},
    "SA": {"Ayurveda": (90, 81), "Unani": (105, 95), "Acupuncture": (78, 72), "Cupping": (130, 116), "Herbal Medicine": (150, 134)},
    "QA": {"Ayurveda": (64, 58), "Unani": (52, 46), "Acupuncture": (71, 65), "Cupping": (83, 75), "Herbal Medicine": (91, 82)},
}

LICENSING_RECORDS: list[LicensingRecord] = []
for region in REGIONS:
    for modality in MODALITIES:
        total, compliant = LICENSING_COUNTS[region.code][modality.name]
        LICENSING_RECORDS.append(
            LicensingRecord(
                region_code=region.code,
                region_name=region.name,
                country=region.country,
                modality=modality.name,
                total_licenses=total,
                compliant_licenses=compliant,
                # Keep the displayed percentage derived from the disclosed counts.
                compliance_rate=round((compliant / total) * 100, 1),
            )
        )

USAGE_OBSERVATIONS: list[UsageObservation] = []
month_labels = [f"2025-{month:02d}" for month in range(1, 13)]
for region_index, region in enumerate(REGIONS):
    for modality_index, modality in enumerate(MODALITIES):
        base_volume = 220 + region_index * 70 + modality_index * 35
        for month_index, period in enumerate(month_labels):
            # A deterministic demonstration pattern gives the future trend chart variation.
            seasonal_offset = (month_index % 4) * 11
            gentle_change = month_index * (3 + (modality_index % 3))
            USAGE_OBSERVATIONS.append(
                UsageObservation(
                    region_code=region.code,
                    region_name=region.name,
                    modality=modality.name,
                    period=period,
                    usage_volume=base_volume + seasonal_offset + gentle_change,
                )
            )

ADVERSE_EVENTS = [
    AdverseEvent(
        id="demo-ae-001", region_code="AE", region_name="United Arab Emirates",
        modality="Herbal Medicine", severity="moderate", report_date=date(2025, 10, 14),
        alert_status="monitoring", short_description="Demonstration record: a fictional product interaction report awaiting review.",
    ),
    AdverseEvent(
        id="demo-ae-002", region_code="SA", region_name="Saudi Arabia",
        modality="Cupping", severity="low", report_date=date(2025, 11, 3),
        alert_status="closed", short_description="Demonstration record: a fictional minor reaction report marked closed.",
    ),
    AdverseEvent(
        id="demo-ae-003", region_code="QA", region_name="Qatar",
        modality="Ayurveda", severity="high", report_date=date(2025, 12, 9),
        alert_status="open", short_description="Demonstration record: a fictional event submitted for clinical review.",
    ),
    AdverseEvent(
        id="demo-ae-004", region_code="AE", region_name="United Arab Emirates",
        modality="Acupuncture", severity="low", report_date=date(2026, 1, 18),
        alert_status="monitoring", short_description="Demonstration record: a fictional post-session report under observation.",
    ),
]

REFERRAL_FLOWS = [
    ReferralFlowEdge(source="Traditional / Complementary Care", target="Assessment / Referral", volume=180),
    ReferralFlowEdge(source="Assessment / Referral", target="Conventional Care", volume=72),
    ReferralFlowEdge(source="Conventional Care", target="Follow-up", volume=68),
]

LICENSING_SOURCE = SourceMetadata(
    dataset="Practitioner licensing demonstration records",
    intended_future_source="UAE MOHAP complementary-medicine licensing information; Dubai Health Authority TCAM reports",
    note="Synthetic values only; neither MOHAP nor DHA records are connected. No Saudi practitioner-licensing source is specified in this POC.",
)
USAGE_SOURCE = SourceMetadata(
    dataset="Monthly modality usage demonstration observations",
    intended_future_source="Dubai Health Authority traditional-medicine reports, if they provide compatible usage data",
    note="Deterministic synthetic observations created for future chart development.",
)
ADVERSE_EVENT_SOURCE = SourceMetadata(
    dataset="Adverse-event demonstration records",
    intended_future_source="An approved, suitable adverse-event reporting source, if identified",
    note="Fictional records for interface development; not real reports or clinical guidance.",
)
REFERRAL_SOURCE = SourceMetadata(
    dataset="Conventional-care referral flow demonstration",
    intended_future_source="No specific source identified in the POC specification",
    note="Synthetic stage-to-stage demonstration volumes; not observed referral counts.",
)
SUMMARY_SOURCE = SourceMetadata(
    dataset="Dashboard summary demonstration values",
    intended_future_source="Derived from future verified, documented POC datasets",
    note="Counts summarize only the synthetic demonstration records in this application.",
)

SOURCE_METADATA = [
    SourceMetadata(
        dataset="Context on traditional and complementary medicine",
        intended_future_source="WHO Traditional Medicine Strategy",
        note="Future contextual reference only; no WHO data is used in this demonstration API.",
        url="https://www.who.int/publications/i/item/9789240113176",
    ),
    LICENSING_SOURCE,
    SourceMetadata(
        dataset="MOHAP practitioner licensing service reference",
        intended_future_source="UAE MOHAP licensing or re-licensing service for health professionals",
        note="Reference only: this is a practitioner-licensing application service, not a verified public searchable registry or data feed. No MOHAP data is connected; dashboard values remain synthetic.",
        url="https://mohap.gov.ae/en/w/licensing-or-re-licensing-of-health-professional",
    ),
    SourceMetadata(
        dataset="DHA TCAM scope-of-practice guidance reference",
        intended_future_source="Dubai Health Authority Traditional, Complementary and Alternative Medicine Scope of Practice guidance (August 2011)",
        note="Related DHA scope-of-practice guidance only; it is not the specified traditional-medicine department reports. No DHA data is connected in this demonstration API.",
        url="https://dha.gov.ae/uploads/112021/8ffadaa8-95d2-42e8-8c9a-f75fcc532873.pdf",
    ),
    USAGE_SOURCE,
    SourceMetadata(
        dataset="SFDA searchable herbal-drug listing reference",
        intended_future_source="Saudi SFDA Herbal Drugs searchable product listings and registration details",
        note="Reference only; no SFDA data is retrieved for this demonstration API. No downloadable dataset or API was verified during review.",
        url="https://www.sfda.gov.sa/en/herbal-drugs",
    ),
    ADVERSE_EVENT_SOURCE,
    REFERRAL_SOURCE,
]
