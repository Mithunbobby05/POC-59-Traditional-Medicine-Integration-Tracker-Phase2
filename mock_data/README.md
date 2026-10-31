# Synthetic sample data

**SYNTHETIC DATA — NOT REAL**

These files are deterministic demonstration fixtures exported from `backend/app/data.py`; they are not observations, registry extracts, or clinical reports. Regenerate them from the repository root with:

```powershell
cd backend
.\.venv\Scripts\python.exe -m app.export_mock_data
```

The snapshot date records when this synthetic fixture set was generated. It is not a source retrieval or update timestamp. UAE, Saudi Arabia, and Qatar are included as synthetic Gulf-market examples. Qatar has no source connection specified. The named WHO, MOHAP, DHA, and SFDA references are intended future sources only and did not provide these values.

CSV files repeat `data_status` and `snapshot_generated_at` on each record so the provenance remains visible when rows are copied. JSON files use the same metadata at the top level.
