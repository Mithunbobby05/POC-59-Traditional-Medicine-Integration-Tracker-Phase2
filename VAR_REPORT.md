# POC-59 VAR Report

**Project:** Traditional & Complementary Medicine Integration Tracker
**Purpose:** A Real Rails demonstration dashboard for exploring practitioner licensing, synthetic usage and safety signals, and stage-to-stage pathways between traditional/complementary care and conventional care across Gulf-market examples. It is an analytical POC, not clinical decision support.

## 1. Scope and evidence standard

This Verification and Acceptance Review (VAR) originally covered the repository state inspected on 13 October 2026: the frontend, backend, API routes and live local responses, mock-data files and documentation, README, package scripts, and Git status. During the final audit on 18 October 2026, frontend TypeScript, lint, and production build were rerun. Backend runtime checks could not be repeated because FastAPI is not installed in the available Python environment; dependencies were not installed.

The original Real Rails POC-59 Excel specification and separate official instruction or screenshot package were not found in the repository. This report therefore checks against the known POC-59 requirements supplied for this review and the repository documentation. Any requirement that depends on unavailable official materials is marked accordingly; the supplied list cannot establish whether additional spreadsheet-specific criteria apply.

Evidence labels:

- **Code inspection:** implementation exists in the cited component, helper, or route; this does not by itself prove browser behavior.
- **Automated/runtime verification:** command or local HTTP result obtained during this review.
- **USER-REPORTED PASS:** browser result reported by the user; not independently repeated here.
- **NOT VERIFIED:** evidence was unavailable or the check was not completed.

## 2. Requirements and acceptance results

| Requirement | Result | Evidence |
|---|---|---|
| Practitioner licensing map by modality and region | **PASS** | Code inspection: `frontend/src/components/dashboard/licensing-map.tsx` renders geographic region markers from API region coordinates and modality-level licensing records. It applies region, modality, and search constraints. Runtime: `/api/licensing/map` returned HTTP success with 15 licensing records across UAE, Saudi Arabia, and Qatar. Map interaction is also USER-REPORTED PASS; no browser session was independently exercised. |
| Usage-volume trends by modality | **PASS** | Code inspection: `usage-trends.tsx` uses Recharts over API monthly observations, aggregates filtered modality/month records, and applies region, modality, period, and search. Runtime: `/api/usage/trends` returned synthetic observations (180). Filter interaction is USER-REPORTED PASS, not independently browser-verified. |
| Adverse-event alert panel | **PASS** | Code inspection: `adverse-events.tsx` displays API event severity, region, modality, date, status, and description with filtering. Runtime: `/api/adverse-events` returned four records. Region filtering is USER-REPORTED PASS. |
| Licensing-compliance ranking table | **PASS** | Code inspection: `compliance-table.tsx` uses TanStack Table, renders ranking and modality breakdown rows, and provides filtered CSV export. `backend/app/routes/dashboard.py` uses Pandas to aggregate regional compliant/total license counts and sorts by the resulting compliance rate. The rank is regional, so modality rows for one region share its rank; the table copy explains that distinction. Runtime: `/api/licensing/rankings` returned successfully. Table and CSV behavior are USER-REPORTED PASS. |
| Conventional-care referral flow | **PASS** | Code inspection: `referral-flow.tsx` renders source-to-target edges using API flow values and provides node/connection hover/focus tooltip content. Runtime: `/api/referrals/flow` returned three synthetic edges with volumes 180, 72, and 68. The API metadata explicitly says these are demonstration transitions, not observed referral counts. Visualization and tooltips are USER-REPORTED PASS. |
| “Why This Matters” panel | **PASS** | `frontend/src/components/dashboard/why-this-matters.tsx` contains the explanatory panel and relevant POC themes. The rendered panel was not independently browser-tested in this VAR. |
| “Who Controls the Rail” panel | **PASS** | `frontend/src/components/dashboard/who-controls-rail.tsx` presents stakeholder categories and links from source metadata. It opens external references in a new tab with `noopener noreferrer`. Links are USER-REPORTED PASS; actual destination loading was not independently checked here. |
| Search and filters | **PASS** | Code inspection: shared state in `frontend/src/app/page.tsx` passes region, modality, period, and search to the applicable panels. `frontend/src/lib/search.ts` splits comma-separated terms, trims whitespace, normalizes case, and matches all terms (AND semantics). The map, trends, adverse-event list, and ranking table use search alongside their applicable dropdown filters. Global and comma-separated search and region/modality controls are USER-REPORTED PASS; usage filters are USER-REPORTED PASS. |
| Tooltips and legends | **PASS** | Code inspection: Recharts tooltip/legend, map legend and hover/focus region details, and referral node/connection tooltip implementations are present. Referral tooltip behavior is USER-REPORTED PASS. Browser behavior for the remaining hover/focus states was not independently verified. |
| CSV export | **PASS** | Code inspection: the compliance table exports the filtered rows and prefixes the file with `SYNTHETIC DATA — NOT REAL`. Download is USER-REPORTED PASS; this review did not independently download and open the CSV in a browser. |
| Source links and data provenance | **PASS** | `data-provenance.tsx`, `who-controls-rail.tsx`, backend source metadata, and README identify synthetic status and intended future sources. The links are not represented as sources of current synthetic values. The user reports successful source-link interaction. The original external sites were not opened during this VAR. |
| Refresh/snapshot timestamp | **PASS** | Backend metadata and provenance UI expose a synthetic snapshot-generation date. README and mock-data documentation explicitly say it is not a source retrieval/update timestamp. |
| Synthetic labels | **PASS** | Live API responses for all seven endpoints identified `SYNTHETIC / DEMONSTRATION DATA`; source response records carry the same status. Mock files/documentation label their contents `SYNTHETIC DATA — NOT REAL`. README says no live healthcare source or external healthcare API is connected. |
| Downloadable mock data and data dictionary | **PASS** | `mock_data/` contains licensing CSV/JSON, usage CSV, adverse-event CSV, referral-flow CSV, `README.md`, and `data_dictionary.md`. Runtime/API and CSV row counts matched for licensing (15), usage (180), events (4), and referral flow (3). `backend/app/export_mock_data.py` exports the backend fixtures. Field-by-field values were not re-compared as part of this VAR. |
| Modular architecture and documentation | **PASS** | Dashboard panels are separate files under `frontend/src/components/dashboard/`; typed API helpers/types are under `frontend/src/lib/`; FastAPI routes, schemas, and fixtures are separated under `backend/app/`. Root README documents purpose, architecture, setup, endpoints, data limits, and known issues. |
| Qatar geographic scope | **PARTIAL** | Qatar is consistent with the other synthetic Gulf markets in runtime API response, README, and mock-data documentation. It is explicitly described as a synthetic example with no source connection. Whether Qatar satisfies the unavailable authoritative spreadsheet is **NOT VERIFIED**. |
| Compliance formula and values | **PASS** | Backend fixture formula is `compliant / total * 100`; ranking aggregation repeats that definition and displays one decimal place. README and data dictionary document it. API ranking metadata defines the regional aggregation. This does not make the synthetic values real-world measurements. |

## 3. Automated and runtime verification

| Check | Result | Evidence / limitation |
|---|---|---|
| `npx tsc --noEmit` | **PASS** | Rerun in `frontend/` during the final audit on 18 October 2026; exit code 0. |
| `git diff --check` | **PASS** | Rerun after the final audit documentation changes; no whitespace errors. |
| `npm run lint` | **PASS** | Rerun in `frontend/` during the final audit on 18 October 2026; exit code 0. |
| `npm run build` | **PASS** | Rerun in `frontend/` during the final audit on 18 October 2026; exit code 0; production build completed. |
| Backend `/health` | **PASS — PREVIOUSLY VERIFIED; NOT RERUN** | A prior live GET to `http://127.0.0.1:8000/health` returned `{"status":"ok"}`. The final audit could not rerun it because FastAPI is not installed in the available Python environment. |
| Seven API endpoints | **PASS — PREVIOUSLY VERIFIED; NOT RERUN** | Prior live GETs to `/api/dashboard/summary`, `/api/licensing/map`, `/api/usage/trends`, `/api/adverse-events`, `/api/licensing/rankings`, `/api/referrals/flow`, and `/api/sources` returned parseable JSON and synthetic-data status. They could not be rerun in the final audit because FastAPI is unavailable. |
| Local CORS | **PASS** | Request with Origin `http://localhost:3000` returned `Access-Control-Allow-Origin: http://localhost:3000`. |
| Frontend/backend runtime connection | **PARTIAL** | The frontend local URL responded with dashboard content in the prior read-only review, and the backend endpoints were live. Full browser data rendering and interaction were not independently tested in this VAR. |
| Frontend test suite | **NOT VERIFIED** | `frontend/package.json` has dev/build/start/lint scripts and no test script. No backend test suite was found in the repository. |

## 4. User-reported browser UAT evidence

The following outcomes were reported by the user and are recorded as **USER-REPORTED PASS**, not independent VAR verification:

- Global search, including comma-separated queries
- Licensing map
- Usage Trends filters
- Licensing Compliance table
- CSV export
- Adverse Events and region filtering
- Referral Flow visualization and node/connection tooltips
- Who Controls the Rail source links
- Global region and modality filters
- Mobile layout at approximately 390px

No browser automation or interactive browser session was performed for this VAR. User-reported browser outcomes remain distinct from the recorded command results; neither establishes external-source availability.

## 5. Source scope and synthetic-data limitations

The intended future references documented by the project are WHO Traditional Medicine Strategy, UAE MOHAP practitioner licensing, Dubai Health Authority TCAM materials, and Saudi SFDA herbal-product registration data. The MOHAP reference has been corrected to its official health-professional licensing application service. MOHAP also publishes a general [Medical Professionals Directory](https://mohap.gov.ae/en/about-us/medical-professionals-directory) and [Licensed Health Workforce Data 2023](https://mohap.gov.ae/en/w/licensed-health-workforce-data_2023-1). T&CM-specific directory filters or practitioner records remain unverified. The workforce dataset description lists emirate, sector, professional category, nationality, and gender, but its actual schema and rows were not inspected; T&CM-specific counts therefore remain unverified. No MOHAP API or live data integration has been verified, and the code does not query MOHAP. The specified registry/source-integration gap remains unresolved. The DHA reference description identifies the linked resource as the Health Regulation Department's August 2011 TCAM Scope of Practice guidance, which is related regulatory guidance rather than the specified reports. Indexed extraction from printed pp. 24–25 of the official [Dubai Health Investment Guide 2024](https://www.dha.gov.ae/uploads/122024/Dubai%20Health%20Investment%20Guide20241247378.pdf) reports that TCAM represented 1% of professionals by category in 2022 and lists 61 facilities in the “Traditional, Complementary and Alternate Medicine” category in 2022. The PDF downloaded successfully with HTTP 200 and matching file size, but the viewer timed out, so the figures were not independently confirmed against rendered page images. The guide is a broad investment publication, not a confirmed traditional-medicine department report. The [Dubai Medical Registry](https://services.dha.gov.ae/sheryan/wps/portal/home/medical-directory) is a separate practitioner directory with a TCIM category and relevant specialty filters, not a report. DHA's June 2026 TCIM survey circular invites participation but contains no survey results. The exact DHA traditional-medicine department report requirement remains unverified, and no DHA data integration exists. The linked SFDA source is the official Herbal Drugs page with searchable herbal-drug product listings and registration details, making it relevant to the specified herbal-product registration requirement. No downloadable dataset or API was verified, and the code does not retrieve or integrate SFDA data. The synthetic licensing counts, usage volumes, alert examples, and referral transitions must not be interpreted as real registries, clinical events, observed patient volumes, or measured referrals.

The project documents Qatar as a synthetic Gulf-market example with no connected source. The original Excel specification was unavailable, so the suitability of Qatar cannot be confirmed against that source.

## 6. Repository and deliverable review

At review time, branch was `main`, latest commit was `a4d27af` (`Complete POC-59 integration tracker dashboard`), and no staged files were listed. Existing uncommitted changes were preserved. The working tree already contained 12 modified tracked files and one untracked file, `frontend/src/lib/search.ts`, before this report was created; they are not VAR-created changes.

Ignore rules cover `frontend/.env.local`, `frontend/node_modules`, `frontend/.next`, `backend/.venv`, and root `repomix-output.xml`. Git ignore/status inspection showed these paths absent from the current staged/worktree change list; `repomix-output.xml` is ignored and untracked. No credentials were found among tracked paths during the repository review. Review the intended staging set independently before any future commit.

Available documentation includes root `README.md`, `VAR_REPORT.md`, `UAT_CHECKLIST.md`, `mock_data/README.md`, and `mock_data/data_dictionary.md`. The README includes local setup, architecture, endpoints, data limitations, current verification caveats, and the known audit issue. The original POC-59 Excel specification and separate official Phase 1 submission instructions were not found in the repository. A screenshot package, demo video, standalone architecture document, and deployment materials were also not found; their submission status is unknown because no authoritative instructions confirming them as mandatory were located. Architecture is described in README; deployment setup is explicitly not included.

## 7. Outstanding risks and limitations

1. **npm audit finding remains unresolved.** `npm audit --json` on 18 October 2026 exited 1 with five high-severity package findings associated with one `braces` advisory, `GHSA-vfj7-8cjw-p6xm`, in the development chain `eslint-config-next@16.3.8` → `@next/eslint-plugin-next@16.3.8` → `fast-glob@3.3.1` → `micromatch@4.0.8` → `braces@3.0.3`. The official advisory currently lists no patched `braces` version. npm suggests `eslint-config-next@14.2.35`, a major downgrade from the project's Next.js 16 setup; this was not applied because compatibility is unverified. `npm ls --omit=dev` showed the affected packages absent from the production dependency tree, and `npm audit --omit=dev --json` reported zero findings. This does not establish that the application is secure or that the development-tooling issue cannot affect production. No dependency was changed.
2. **Official-spec coverage is incomplete.** The authoritative Excel and separate submission instructions were not present, so spreadsheet-specific requirements and deliverable mandates remain unknown.
3. **Some browser evidence is user-reported only.** The specified UAT list is recorded above, but not independently reproduced in this VAR.
4. **Qatar suitability is not confirmed against the original specification.** Documentation is clear that it is a synthetic Gulf-market example with no connected source.

## 8. Final VAR recommendation

**GAPS REMAIN — do not represent this audit as formal approval or completed Phase 1 submission.** Frontend TypeScript, lint, and production build passed in the final audit; prior backend health/API results remain recorded but could not be rerun because FastAPI is unavailable. UAT remains in progress with 25 user-reported passes, UAT-17 partial, and zero independently performed browser passes. The high-severity development dependency advisory remains unresolved. The specified MOHAP registry and DHA department-report source requirements remain unverified, all dashboard values remain synthetic, and the authoritative spreadsheet and Phase 1 submission instructions were not located. The actual mandatory deliverables and any approval workflow therefore cannot be confirmed from available project files.

This is a readiness assessment based on available evidence, not an approval. The project owner must obtain or identify the authoritative specification/submission instructions, complete or disposition UAT-17 and other required independent browser checks, and obtain reviewer disposition of the audit and source gaps before claiming submission readiness.
