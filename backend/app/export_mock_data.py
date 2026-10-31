"""Export the deterministic application fixtures as labelled sample files."""

import csv
import json
from pathlib import Path

from app import data
from app.schemas import SYNTHETIC_SNAPSHOT_GENERATED_AT


OUTPUT_DIR = Path(__file__).resolve().parents[2] / "mock_data"
SNAPSHOT_DATE = SYNTHETIC_SNAPSHOT_GENERATED_AT.isoformat()


def write_csv(filename: str, records: list[dict[str, object]]) -> None:
    fields = ["data_status", "snapshot_generated_at"]
    if records:
        fields.extend(key for key in records[0] if key not in fields)
    with (OUTPUT_DIR / filename).open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        for record in records:
            writer.writerow({
                "data_status": "SYNTHETIC DATA — NOT REAL",
                "snapshot_generated_at": SNAPSHOT_DATE,
                **record,
            })


def write_json(filename: str, records: list[dict[str, object]]) -> None:
    payload = {
        "data_status": "SYNTHETIC DATA — NOT REAL",
        "snapshot_generated_at": SNAPSHOT_DATE,
        "records": records,
    }
    (OUTPUT_DIR / filename).write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    regions = {region.code: region.model_dump() for region in data.REGIONS}
    licensing_records = []
    for row in data.LICENSING_RECORDS:
        region = regions[row.region_code]
        licensing_records.append({
            "region_code": region["code"],
            "region_name": region["name"],
            "country": region["country"],
            "latitude": region["latitude"],
            "longitude": region["longitude"],
            **row.model_dump(),
        })
    usage_records = [row.model_dump() for row in data.USAGE_OBSERVATIONS]
    adverse_records = [row.model_dump(mode="json") for row in data.ADVERSE_EVENTS]
    referral_records = [row.model_dump() for row in data.REFERRAL_FLOWS]

    write_csv("licensing_practitioners.csv", licensing_records)
    write_json("licensing_practitioners.json", licensing_records)
    write_csv("usage_volume.csv", usage_records)
    write_csv("adverse_events.csv", adverse_records)
    write_csv("referral_flow.csv", referral_records)


if __name__ == "__main__":
    main()
