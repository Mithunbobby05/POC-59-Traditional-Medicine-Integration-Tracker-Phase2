# POC-59 UAT Checklist

**POC ID:** POC-59

**Title:** Traditional & Complementary Medicine Integration Tracker
**Purpose:** A Real Rails demonstration dashboard for reviewing practitioner licensing, synthetic usage and safety signals, and illustrative pathways between traditional/complementary care and conventional care across Gulf-market examples. It is not clinical decision support.

## UAT purpose and scope

This checklist records user acceptance checks for the implemented POC-59 dashboard. It covers loading and navigation through the single-page dashboard, synthetic-data communication, maps/charts/tables, filtering/search, referral-flow tooltips, source links, CSV export, provenance, responsive layout, empty states, and keyboard focus behavior.

UAT checks are not the same as code inspection or API verification. Results reported by the user before this checklist was created are explicitly marked **USER-REPORTED PASS** and are not represented as independently repeated browser tests. A case is **NOT TESTED** unless a result is recorded here or added by the tester. No formal Real Rails approval is claimed.

The original POC-59 Excel specification and separate official UAT instruction package were not found in the repository during the VAR review. These cases follow the POC-59 requirements and test areas available in the project conversation and documentation. Any additional official acceptance criteria must be confirmed from the authoritative instructions when available.

## Test environment and prerequisites

### Environment

| Item | Value / record during execution |
|---|---|
| Browser and version | Record when testing: ____________________ |
| Operating system | Record when testing: ____________________ |
| Frontend address | `http://localhost:3000` |
| Backend address | `http://127.0.0.1:8000` (or configured `NEXT_PUBLIC_API_BASE_URL`) |
| Viewport / zoom | Desktop: record dimensions and zoom. Mobile check: approximately 390 CSS pixels wide. |
| Test date and tester | ____________________ |

### Prerequisites

1. Use the project README’s local setup instructions. Prerequisites documented there are Node.js 20.9 or newer, npm, and Python 3.10 or newer.
2. Start FastAPI in one terminal from `backend/` with `python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` (activate/use the project virtual environment as appropriate).
3. Start Next.js in a separate terminal from `frontend/` with `npm run dev` after dependencies are already available. The frontend API defaults to `http://127.0.0.1:8000`; if configured differently, make sure `NEXT_PUBLIC_API_BASE_URL` points to the running backend.
4. Open `http://localhost:3000` in the browser. Confirm the backend is available at `/health` if the dashboard cannot load.
5. Treat every displayed count, percentage, trend, event, referral volume, and downloadable sample row as **SYNTHETIC / DEMONSTRATION DATA**. Do not interpret it as a real registry, clinical incident, usage count, or observed referral.
6. Use the same viewport and browser zoom when comparing results. Record screenshots or other evidence only if required by the authoritative Real Rails submission instructions; those instructions were not available in the repository.

### Result status meanings

- **PASS** — the tester performed the stated steps and observed the expected result.
- **FAIL** — the tester performed the steps and observed a material mismatch.
- **BLOCKED** — the test could not be performed due to an identified dependency or environment issue; explain it.
- **PARTIAL** — one part of a case passed while another part is blocked or unresolved; describe each separately.
- **NOT TESTED** — no test result has been recorded.
- **PASS (USER-REPORTED)** — the user previously reported a successful manual test; it has not been independently repeated for this checklist.

## Numbered test cases

### UAT-01 — Dashboard loading and section navigation

- **Steps:** Start the backend and frontend. Load the dashboard URL, wait for data to load, then scroll through the page from the header to the footer and locate each major panel.
- **Expected:** The dashboard loads without a persistent loading or error state. The title and all dashboard sections are reachable in the page. If the backend is unavailable, a clear error and retry control are shown.
- **Actual result:** **PASS (USER-REPORTED)** — the dashboard was refreshed successfully and was visible at the end of UAT.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `frontend/src/app/page.tsx`; VAR runtime evidence is documented in `VAR_REPORT.md`.

### UAT-02 — Summary cards and synthetic-data labels

- **Steps:** Inspect all summary cards and the provenance notice. Compare the displayed global totals and active-alert scope wording with the dashboard filters. Check that values are labelled synthetic/demo.
- **Expected:** Labels describe what each figure counts; global dataset totals are not mistaken for filtered totals, while active alerts reflect the stated region/modality scope. Synthetic values are visibly labelled and not presented as real-world measurements.
- **Actual result:** **PASS (USER-REPORTED)** — latest user-reported check of the summary cards succeeded. Detailed card-by-card values/calculation evidence was not recorded. Synthetic-data disclaimer was also reported visible; see UAT-21.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `summary-cards.tsx`, `data-provenance.tsx`, and `/api/dashboard/summary`.

### UAT-03 — Practitioner Licensing Map interactions

- **Steps:** Inspect the map at the default filters. Hover over and select a region marker; inspect region details and modality metrics. Change the modality and search, then inspect which markers and details remain visible.
- **Expected:** Supported synthetic Gulf-market regions are mapped; details correspond to the hovered/selected visible region and active modality/search. No real-world licensing claim is implied.
- **Actual result:** **USER-REPORTED PASS** — successful licensing map interactions were reported. The exact hover/selection/filter combinations were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `licensing-map.tsx`; VAR independently verified that the API returned map data, not the browser interaction.

### UAT-04 — Region filter

- **Steps:** Select each available region and then restore “All regions.” Observe the panels affected by the shared filter.
- **Expected:** Applicable map, usage, adverse-event, and licensing records respond to the region selection. Clearing the filter restores records otherwise allowed by the remaining filters.
- **Actual result:** **USER-REPORTED PASS** — global region filtering was reported successful. Each individual region and each panel combination were not separately documented.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `dashboard-filters.tsx` and shared state in `frontend/src/app/page.tsx`.

### UAT-05 — Modality filter

- **Steps:** Select a modality and then restore “All modalities.” Check the map, trends, adverse events, and licensing table.
- **Expected:** Applicable panels show records for the selected modality; clearing the selection restores records permitted by other filters.
- **Actual result:** **USER-REPORTED PASS** — global modality filtering was reported successful. Individual modality-by-panel combinations were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `dashboard-filters.tsx`; panel-level scope is implemented in the dashboard components.

### UAT-06 — Usage Trends and modality comparison

- **Steps:** View Usage Trends with all modalities, then select one modality and one region. Compare the chart series and tooltip labels.
- **Expected:** The chart reflects filtered synthetic monthly observations and shows readable time axes, modality legend when applicable, and tooltip values.
- **Actual result:** **USER-REPORTED PASS** — Usage Trends filters were reported successful. Specific series/tooltips were not separately reported.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `usage-trends.tsx`; API observations are synthetic.

### UAT-07 — Usage period filtering

- **Steps:** Select each available usage window (3, 6, and 12 months). Compare the chart’s visible periods and period footnote.
- **Expected:** The chart shows no more than the selected number of latest available months after region, modality, and search filters are applied. Other filter selections remain intact.
- **Actual result:** **PASS (USER-REPORTED)** — the latest usage-period filter check succeeded. Exact selected periods and chart values were not recorded.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Period control is in `dashboard-filters.tsx`; slicing/aggregation is in `usage-trends.tsx`.

### UAT-08 — Global search, including comma-separated terms

- **Steps:** Search for a region, a modality, and a comma-separated region/modality query (for example, `Qatar,Ayurveda`). Inspect the map, Usage Trends, adverse-event panel, and compliance table. Clear the query.
- **Expected:** Search is case-insensitive; comma-separated terms use AND matching; matching records appear across searchable panels; clearing search restores results allowed by dropdown filters.
- **Actual result:** **USER-REPORTED PASS** — global search, including comma-separated queries, was reported successful. The exact terms, casing, whitespace variants, and each panel’s result were not recorded.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Search implementation in `frontend/src/lib/search.ts`; UI wiring in `frontend/src/app/page.tsx`.

### UAT-09 — Search syntax variants and AND matching

- **Steps:** Search for `Qatar`, `Ayurveda`, `Qatar,Ayurveda`, `Qatar Ayurveda`, and `XYZ12345`; observe the results for each query.
- **Expected:** Comma-separated terms use AND matching, so `Qatar,Ayurveda` matches records containing both terms. A space-separated query such as `Qatar Ayurveda` is not a supported format. A non-matching query such as `XYZ12345` displays the expected empty state.
- **Actual result:** **PASS (USER-REPORTED)** — the user reported that `Qatar`, `Ayurveda`, and `Qatar,Ayurveda` worked; `Qatar Ayurveda` was not supported because search uses comma-separated terms; and `XYZ12345` displayed the expected empty state. This result was not independently verified.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Search implementation in `frontend/src/lib/search.ts`; UI wiring in `frontend/src/app/page.tsx`.

### UAT-10 — Search combined with dropdown filters and reset

- **Steps:** Set a region and modality, enter a search query, and change the usage period. Observe how the active filters combine across panels.
- **Expected:** Search and dropdown filters combine without one silently replacing another. Period affects Usage Trends only.
- **Actual result:** **PASS (USER-REPORTED)** — combined filters were reported working. Exact filter combinations were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `dashboard-filters.tsx`, `frontend/src/app/page.tsx`, and individual panel filter logic.

### UAT-11 — Licensing Compliance table

- **Steps:** Inspect rank, region, modality, total licenses, compliant licenses, and compliance rate. Apply search/region/modality filters and inspect the empty-result behavior if no record matches.
- **Expected:** Rows match the active filters. Regional ranks may repeat across modality rows because rank is regional. Displayed compliance rate follows compliant licenses divided by total licenses times 100, rounded to one decimal place; all values remain labelled synthetic.
- **Actual result:** **PASS (USER-REPORTED)** — latest check of the Licensing Compliance table succeeded. Formula, rank scope, and every filter combination were not separately reported in browser UAT.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `compliance-table.tsx`; ranking aggregation and formula metadata are in `backend/app/routes/dashboard.py`.

### UAT-12 — Adverse Events panel and region filtering

- **Steps:** Inspect the event list; select a region and compare the visible events. Also inspect modality/search effects if applicable.
- **Expected:** Each visible synthetic example shows severity, modality, region, date, description, and alert status. Region filtering affects the visible matching events. The panel does not imply these are real medical incidents.
- **Actual result:** **USER-REPORTED PASS** — Adverse Events and region filtering were reported successful. Modality/search combinations were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `adverse-events.tsx`; API events and descriptions are demonstration data.

### UAT-13 — Adverse-event no-match behavior

- **Steps:** Apply a region/modality/search combination that returns no events, then clear one constraint at a time.
- **Expected:** A clear empty state appears when no events match. Clearing constraints restores only the records allowed by the remaining selections.
- **Actual result:** **PASS (USER-REPORTED)** — adverse-event empty-state behavior was reported successful. The exact no-match query was not recorded.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Verify against `adverse-events.tsx` in the browser.

### UAT-14 — Conventional-Care Referral Flow

- **Steps:** Inspect the flow from Traditional / Complementary Care through Assessment / Referral and Conventional Care to Follow-up. Compare visible labels and edge volumes with the API response if needed.
- **Expected:** The visualization represents the API’s source-to-target relationships and synthetic volumes. It is presented as illustrative transition data, not real referral counts or a clinical funnel.
- **Actual result:** **USER-REPORTED PASS** — Referral Flow visualization was reported successful.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `referral-flow.tsx`; API provides three synthetic edges (180, 72, 68) and labels them demonstration transitions.

### UAT-15 — Referral-flow node tooltips

- **Steps:** Hover over each node, then use keyboard focus where available. Read the node label and incoming/outgoing details.
- **Expected:** A readable tooltip or accessible equivalent shows the node label and available existing incoming/outgoing transition volumes; no new or real-world statistics are implied.
- **Actual result:** **USER-REPORTED PASS** — referral-flow node tooltips were reported working. Keyboard-focus behavior was not reported.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `referral-flow.tsx`; focus-specific verification remains in UAT-23.

### UAT-16 — Referral-flow connection tooltips

- **Steps:** Hover over each connector, then use keyboard focus where available. Check source, destination, and volume.
- **Expected:** A readable tooltip or accessible equivalent identifies the API source, target, and synthetic volume for that connection.
- **Actual result:** **USER-REPORTED PASS** — referral-flow connection tooltips were reported working. Keyboard-focus behavior was not reported.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `referral-flow.tsx`; focus-specific verification remains in UAT-23.

### UAT-17 — Who Controls the Rail source links

- **Steps:** Open each displayed reference link and confirm it navigates to the linked reference. Return to the dashboard and verify the synthetic-data provenance copy remains clear.
- **Expected:** Links are clickable and open their intended future-reference destinations. The UI does not imply that those organizations supplied current synthetic values.
- **Actual result:** **PARTIAL / FAILED LINK ACCESS (USER-REPORTED)** — the user tested the updated MOHAP Practitioner Licensing Service link from the dashboard in a browser, and the attempted link did not load. This records only the observed link-access failure; it does not establish that the MOHAP service itself is unavailable. The previous facility-licensing URL also failed to load in the user's tested browsers and mobile network. The MOHAP source-verification gap remains documented.
- **Status:** PARTIAL (USER-REPORTED — LINK ACCESS FAILED)
- **Evidence / notes:** `who-controls-rail.tsx` and backend source metadata. The updated destination was attempted in a browser, but did not load. No conclusion about service availability or dashboard-code failure is supported by this result.

### UAT-18 — Why This Matters panel

- **Steps:** Locate the panel and review its explanatory points on licensing visibility, usage patterns, safety signals, and referral pathways.
- **Expected:** Panel is present, readable, and describes the dashboard’s purpose without presenting synthetic observations as factual healthcare findings.
- **Actual result:** **PASS (USER-REPORTED)** — the latest browser check of the Why This Matters panel succeeded. Detailed content checks were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Panel implementation is in `why-this-matters.tsx`; verify rendered content and layout in browser.

### UAT-19 — CSV export action

- **Steps:** Click “Export CSV” from the Licensing Compliance panel and confirm a file downloads.
- **Expected:** A CSV file is downloaded with a descriptive POC-59 filename.
- **Actual result:** **USER-REPORTED PASS** — CSV export was reported working. File contents were not part of that reported result.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Export implementation is in `compliance-table.tsx`.

### UAT-20 — CSV contents and filtered export

- **Steps:** Open the downloaded CSV. Check the synthetic warning, column headers, data rows, and whether rows reflect the current search/region/modality filters. Compare a few exported values with the visible table.
- **Expected:** The file begins with `SYNTHETIC DATA — NOT REAL`, includes the ranking/licensing fields, and contains the filtered displayed records with matching values. No data is described as real.
- **Actual result:** **PASS (USER-REPORTED)** — the user reported that the full CSV export worked and that the filtered UAE + Ayurveda export worked and its contents looked correct. This result was not independently verified.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Export implementation is in `compliance-table.tsx`; no independent download/content verification was performed for this checklist.

### UAT-21 — Source provenance and synthetic snapshot timestamp

- **Steps:** Inspect the provenance panel for data status, coverage, freshness, quality/limitations, intended sources, and snapshot date. Open a source link if needed.
- **Expected:** The current dataset is labelled synthetic; real-world coverage and source freshness say not applicable; timestamp is identified as generation time, not retrieval/update time; external organizations are future references only.
- **Actual result:** **PASS (USER-REPORTED)** — the synthetic-data disclaimer and snapshot timestamp were reported visible/clear in the latest check. The timestamp is a synthetic snapshot-generation time, not a source retrieval time; exact displayed timestamp was not recorded here. VAR code/API checks are independent evidence only for metadata, not browser rendering.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** `data-provenance.tsx`, `/api/sources`, `README.md`, and `mock_data/README.md`.

### UAT-22 — Empty states and no-match combinations

- **Steps:** Use search and filters to produce no map region, usage observations, adverse events, and licensing rows. Clear search/filter conditions individually.
- **Expected:** Each affected panel shows an understandable empty state without stale values, broken layout, or synthetic values that do not match the current view. Clearing constraints restores applicable results.
- **Actual result:** **PASS (USER-REPORTED)** — empty states were reported working. The specific panels and no-match combinations were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Check map, trend, event, and table empty states in the browser.

### UAT-23 — Keyboard accessibility and focus behavior

- **Steps:** Use Tab/Shift+Tab to reach filters, reset, map markers, table export, referral nodes/connectors, and source links. Activate controls with the keyboard and inspect visible focus indicators and tooltip/accessibility labels where applicable.
- **Expected:** Interactive controls can be reached and operated by keyboard; focus is visible; non-interactive decoration is not presented as a control; labels/tooltips provide useful context.
- **Actual result:** **PASS (USER-REPORTED)** — keyboard navigation was reported successful. Specific controls, key sequences, and focus indicators were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Relevant implementations include `dashboard-filters.tsx`, `licensing-map.tsx`, `referral-flow.tsx`, `compliance-table.tsx`, and `who-controls-rail.tsx`.

### UAT-24 — Mobile layout at approximately 390px

- **Steps:** Open the dashboard at approximately 390 CSS pixels wide. Scroll through the page, operate filters, inspect map/chart/table/flow and source links, and check for clipping or horizontal overflow.
- **Expected:** Panels remain readable and usable; charts and flow do not obscure content; table retains usable scroll behavior; controls do not overlap or clip.
- **Actual result:** **USER-REPORTED PASS** — mobile layout at approximately 390px was reported successful. The device/browser, tested panels, and overflow checks were not itemized.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** No independent viewport/browser check was performed for this checklist.

### UAT-25 — Reset filters

- **Steps:** Select UAE, Ayurveda, and enter a Qatar search query. Select “Reset filters.”
- **Expected:** Region and modality return to All regions and All modalities, search clears, and the dashboard returns to its normal state.
- **Actual result:** **PASS (USER-REPORTED)** — the user reported all filters reset correctly and the dashboard returned to its normal state. No independent browser verification was performed.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** Reset handler is in `frontend/src/app/page.tsx`; control is in `dashboard-filters.tsx`.

### UAT-26 — Browser Console

- **Steps:** Open the browser developer Console while the dashboard loads and is used; inspect for errors.
- **Expected:** No browser Console errors that prevent dashboard use.
- **Actual result:** **PASS (USER-REPORTED)** — the latest browser Console check was reported successful. Browser/version and a Console capture were not recorded.
- **Status:** PASS (USER-REPORTED)
- **Evidence / notes:** No independent browser Console inspection was performed for this checklist.

## UAT summary

| Measure | Result |
|---|---|
| Total cases | 26 |
| User-reported passes | 25 — not independently repeated |
| Independently performed browser UAT passes | 0 |
| Not tested | 0 |
| Partial | 1 (UAT-17: MOHAP link-access failure observations) |
| Cases marked FAIL | 0 (UAT-17 remains PARTIAL; failed link access is recorded within that case) |
| MOHAP failed link-access observations | 2 (previous facility-licensing URL and updated practitioner-licensing service link; UAT-17 records attempted link access only, not service availability) |
| UAT status | **IN PROGRESS — NOT COMPLETE** |

No cases are marked outright FAIL; UAT-17 remains PARTIAL and records the failed link-access observations.

### User-reported pass coverage

The reported successful checks are recorded only as **PASS (USER-REPORTED)**. These include dashboard refresh/final visibility (UAT-01), summary cards (UAT-02), map interactions (UAT-03), region and modality filters (UAT-04–05), Usage Trends and its period filter (UAT-06–07), global search and syntax variants (UAT-08–09), combined filters (UAT-10), Licensing Compliance (UAT-11), adverse events and empty behavior (UAT-12–13), referral visualization/tooltips (UAT-14–16), source-link interaction (UAT-17), Why This Matters (UAT-18), CSV export action and full/filtered contents (UAT-19–20), synthetic-data disclaimer/timestamp (UAT-21), empty states (UAT-22), keyboard navigation (UAT-23), responsive layout near 390px (UAT-24), filter reset using UAE, Ayurveda, and a Qatar search (UAT-25), and browser Console (UAT-26). Exact inputs and detailed evidence were not always recorded. All reported passes remain user-reported, not independently verified. For UAT-17, both the previous facility-licensing URL and the updated practitioner-licensing service link failed to load when attempted; the latter result is a user-reported browser observation and does not establish service availability.

## Known limitations and outstanding issues

These are carried forward from `VAR_REPORT.md` and are not marked resolved by this checklist:

- Technical verification rerun during the final audit on 18 October 2026: `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed with exit code 0. Prior backend health and seven API endpoint checks returned HTTP 200 but were not rerun because FastAPI was unavailable in the audit environment. These checks do not count as browser UAT.
- `npm audit --json` on 18 October 2026 reported five high-severity package findings associated with the unresolved `braces` advisory `GHSA-vfj7-8cjw-p6xm` in the development ESLint/Next.js dependency chain. The advisory lists no patched version; npm's suggested `eslint-config-next@14.2.35` remediation is a major downgrade and was not applied. No dependency change was made.
- Browser interactions in the VAR were user-reported and were not independently tested during that audit.
- The original POC-59 Excel specification and separate official instructions were unavailable in the repository; any additional official test criteria or deliverable rules remain to be confirmed.
- Qatar is documented as a synthetic Gulf-market example with no connected source, but its acceptance against the unavailable authoritative specification is not verified.
- VAR independently checked `/health`, all seven API endpoints, CORS, TypeScript, and `git diff --check`; these checks do not replace browser UAT.
- No automated frontend test script or backend test suite is documented in the repository.

## Completion and approval

UAT remains **IN PROGRESS**: 25 cases have user-reported passes, none are marked NOT TESTED, and UAT-17 is partial because the previous facility-licensing URL and the updated practitioner-licensing service link both failed to load when attempted. The updated-link observation does not establish that the MOHAP service itself is unavailable. No browser UAT pass was independently performed for this checklist. This checklist does not grant or imply formal Real Rails approval. Record the tester, date, environment, actual result, and evidence for any newly executed case; preserve USER-REPORTED labels unless a result is independently repeated.
