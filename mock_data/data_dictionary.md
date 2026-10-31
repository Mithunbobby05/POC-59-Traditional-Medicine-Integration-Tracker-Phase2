# POC-59 synthetic data dictionary

**SYNTHETIC DATA — NOT REAL**

All sample rows mirror the deterministic backend fixtures. The geographic records represent UAE, Saudi Arabia, and Qatar only for demonstration; no real-world market coverage is implied. Qatar has no connected or specified source in this POC.

## Common metadata

| Field | Meaning |
| --- | --- |
| `data_status` | Always `SYNTHETIC DATA — NOT REAL` in these files. |
| `snapshot_generated_at` | Date the synthetic fixture set was generated; not a source retrieval or update time. |

## `licensing_practitioners.csv` and `.json`

One row per region and modality, matching the backend licensing records with geographic context for mapping.

| Field | Meaning |
| --- | --- |
| `code` / `region_code` | ISO-style demonstration region code; these are not identifiers for real records. |
| `name` / `region_name` | Display label for the sample region. |
| `country` | Sample country label. |
| `latitude`, `longitude` | Approximate map marker position for the sample region. |
| `modality` | One of Ayurveda, Unani, Acupuncture, Cupping, or Herbal Medicine. |
| `total_licenses` | Synthetic total for the region/modality pair. |
| `compliant_licenses` | Synthetic compliant count, not a verified regulator count. |
| `compliance_rate` | `compliant_licenses / total_licenses * 100`, rounded to one decimal place. |

## `usage_volume.csv`

One synthetic monthly record per region and modality. `usage_volume` is an invented demonstration volume, not patient visits or population usage.

## `adverse_events.csv`

Fictional alert examples. `severity`, `alert_status`, and `short_description` are UI demonstration fields and are not clinical assessments or incident reports.

## `referral_flow.csv`

Synthetic transitions with `source`, `target`, and `volume`. Volumes illustrate stage-to-stage flow and are not observed referrals or patient counts.
