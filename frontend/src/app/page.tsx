"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAdverseEvents,
  getDashboardSummary,
  getLicensingMap,
  getLicensingRankings,
  getReferralFlow,
  getSources,
  getUsageTrends,
} from "@/lib/api";
import type {
  AdverseEventsResponse,
  DashboardSummary as DashboardSummaryData,
  LicensingMapResponse,
  LicensingRankingsResponse,
  ReferralFlowResponse,
  SourcesResponse,
  UsageTrendsResponse,
} from "@/lib/types";
import { AdverseEvents } from "@/components/dashboard/adverse-events";
import { ComplianceTable } from "@/components/dashboard/compliance-table";
import { DashboardFilters, type PeriodLength } from "@/components/dashboard/dashboard-filters";
import { DataProvenance } from "@/components/dashboard/data-provenance";
import { HowToRead } from "@/components/dashboard/how-to-read";
import { LicensingMap } from "@/components/dashboard/licensing-map";
import { ReferralFlow } from "@/components/dashboard/referral-flow";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { UsageTrends } from "@/components/dashboard/usage-trends";
import { WhyThisMatters } from "@/components/dashboard/why-this-matters";
import { WhoControlsRail } from "@/components/dashboard/who-controls-rail";

interface DashboardData {
  summary: DashboardSummaryData;
  licensingMap: LicensingMapResponse;
  usage: UsageTrendsResponse;
  adverseEvents: AdverseEventsResponse;
  rankings: LicensingRankingsResponse;
  referralFlow: ReferralFlowResponse;
  sources: SourcesResponse;
}

export default function Home() {
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
  const [projectInfoOpen, setProjectInfoOpen] = useState(false);
  const intelligenceTrigger = useRef<HTMLButtonElement>(null);
  const projectInfoTrigger = useRef<HTMLButtonElement>(null);
  const intelligenceClose = useRef<HTMLButtonElement>(null);
  const projectInfoClose = useRef<HTMLButtonElement>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regionCode, setRegionCode] = useState("all");
  const [modality, setModality] = useState("all");
  const [period, setPeriod] = useState<PeriodLength>(12);
  const [search, setSearch] = useState("");

  const fetchDashboardData = useCallback(() => Promise.all([
        getDashboardSummary(),
        getLicensingMap(),
        getUsageTrends(),
        getAdverseEvents(),
        getLicensingRankings(),
        getReferralFlow(),
        getSources(),
      ]), []);

  const loadDashboard = useCallback(async () => {
    try {
      const [summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources] = await fetchDashboardData();
      setError(null);
      setDashboard({ summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard data.");
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    let isCurrent = true;
    fetchDashboardData()
      .then(([summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources]) => {
        if (isCurrent) setDashboard({ summary, licensingMap, usage, adverseEvents, rankings, referralFlow, sources });
      })
      .catch((requestError: unknown) => {
        if (isCurrent) setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard data.");
      });

    return () => { isCurrent = false; };
  }, [fetchDashboardData]);

  const modalities = useMemo(() => dashboard
    ? [...new Set(dashboard.licensingMap.regions.flatMap((region) => region.licensing.map((item) => item.modality)))]
    : [], [dashboard]);

  const resetFilters = () => {
    setRegionCode("all");
    setModality("all");
    setPeriod(12);
    setSearch("");
  };

  useEffect(() => {
    if (intelligenceOpen) intelligenceClose.current?.focus();
    else if (intelligenceTrigger.current) intelligenceTrigger.current.focus();
  }, [intelligenceOpen]);

  useEffect(() => {
    if (projectInfoOpen) projectInfoClose.current?.focus();
    else if (projectInfoTrigger.current) projectInfoTrigger.current.focus();
  }, [projectInfoOpen]);

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Traditional & Complementary Medicine Integration Tracker home">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>Infocreon Internship <span className="brand-divider">/</span> Traditional &amp; Complementary Medicine Integration Tracker</span>
        </a>
        <div className="topbar-status">
          <span className="status-label"><span className="status-dot" /> {dashboard ? "API CONNECTED" : "CONNECTING TO API"}</span>
          <button ref={intelligenceTrigger} className="header-action" type="button" onClick={() => setIntelligenceOpen(true)} aria-expanded={intelligenceOpen} aria-controls="intelligence-drawer">Intelligence <span aria-hidden="true">↗</span></button>
          <button ref={projectInfoTrigger} className="info-button" type="button" onClick={() => setProjectInfoOpen(true)} aria-label="Project information" aria-haspopup="dialog">i</button>
        </div>
      </header>

      <div className="dashboard-layout">
        <section className="dashboard-primary" aria-label="Primary dashboard analysis">
          <section className="intro" id="main" aria-labelledby="page-title">
            <div className="intro-copy">
              <p className="eyebrow">HEALTH SYSTEMS <span>·</span> INTEGRATION TRACKER</p>
              <h1 id="page-title">Traditional &amp; Complementary Medicine Integration Tracker</h1>
              <p className="subtitle">A regional view of licensing, safety signals, usage patterns, and pathways into conventional care.</p>
            </div>
          </section>

          {!dashboard && !error && (
            <div className="loading-panel" role="status"><span className="loading-mark" /> Connecting to the local synthetic data API…</div>
          )}

          {error && (
            <div className="error-panel" role="alert">
              <div><strong>Dashboard data unavailable</strong><p>{error}</p><small>Confirm the FastAPI service is running at the configured local API address.</small></div>
              <button className="retry-button" type="button" onClick={() => void loadDashboard()}>Retry connection</button>
            </div>
          )}

          {dashboard && (
            <>
              <DashboardFilters
                regions={dashboard.licensingMap.regions.map((item) => item.region)}
                modalities={modalities}
                regionCode={regionCode}
                modality={modality}
                period={period}
                search={search}
                onRegionChange={setRegionCode}
                onModalityChange={setModality}
                onPeriodChange={setPeriod}
                onSearchChange={setSearch}
                onReset={resetFilters}
              />
              <div className="dashboard-grid primary-grid">
                <LicensingMap
                  regions={dashboard.licensingMap.regions}
                  modality={modality}
                  selectedRegion={regionCode}
                  search={search}
                  onRegionSelect={(selectedCode) => {
                    setRegionCode(selectedCode);
                    setIntelligenceOpen(true);
                  }}
                />
                <UsageTrends
                  observations={dashboard.usage.observations}
                  modality={modality}
                  regionCode={regionCode}
                  period={period}
                  search={search}
                />
              </div>
              <ReferralFlow flows={dashboard.referralFlow.flows} unit={dashboard.referralFlow.unit} />
            </>
          )}
        </section>

      </div>

      <div className={`drawer-backdrop${intelligenceOpen ? " is-open" : ""}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setIntelligenceOpen(false); }} aria-hidden="true" />
      <aside id="intelligence-drawer" className={`intelligence-drawer${intelligenceOpen ? " is-open" : ""}`} aria-label="Supporting intelligence" aria-hidden={!intelligenceOpen} inert={!intelligenceOpen} onKeyDown={(event) => {
        if (event.key === "Escape") setIntelligenceOpen(false);
        if (event.key === "Tab") {
          const focusable = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input, select, [tabindex]:not([tabindex="-1"])');
          if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1]?.focus(); }
          else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0]?.focus(); }
        }
      }}>
        <div className="drawer-heading"><div><p className="section-kicker">POC-59 / DEMONSTRATION</p><h2>Intelligence brief</h2></div><button ref={intelligenceClose} type="button" className="drawer-close" onClick={() => setIntelligenceOpen(false)} aria-label="Close intelligence panel">×</button></div>
        {dashboard && <div className="drawer-content">
          <SummaryCards summary={dashboard.summary} events={dashboard.adverseEvents.events} regionCode={regionCode} modality={modality} />
          <ComplianceTable rankings={dashboard.rankings} regions={dashboard.licensingMap.regions} regionCode={regionCode} modality={modality} search={search} />
          <AdverseEvents events={dashboard.adverseEvents.events} regionCode={regionCode} modality={modality} search={search} />
          <DataProvenance sources={dashboard.sources.sources} />
          <HowToRead />
          <WhyThisMatters />
          <WhoControlsRail sources={dashboard.sources.sources} />
        </div>}
      </aside>

      {projectInfoOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProjectInfoOpen(false); }}>
        <section className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description" onKeyDown={(event) => {
          if (event.key === "Escape") setProjectInfoOpen(false);
          if (event.key === "Tab") {
            const focusable = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input, select, [tabindex]:not([tabindex="-1"])');
            if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1]?.focus(); }
            else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0]?.focus(); }
          }
        }}>
          <div className="drawer-heading"><div><p className="section-kicker">PROJECT INFORMATION</p><h2 id="project-dialog-title">About this project</h2></div><button ref={projectInfoClose} type="button" className="drawer-close" onClick={() => setProjectInfoOpen(false)} aria-label="Close project information">×</button></div>
          <p id="project-dialog-description" className="dialog-intro">Infocreon Internship - Traditional &amp; Complementary Medicine Integration Tracker</p>
          <dl className="project-details">
            <div><dt>Architect / Developer</dt><dd>Mithun B Dev</dd></div><div><dt>Batch</dt><dd>Batch 2 Interns</dd></div><div><dt>POC ID</dt><dd>POC-59</dd></div><div><dt>GitHub Username</dt><dd>Mithunbobby05</dd></div><div><dt>Project</dt><dd>Traditional &amp; Complementary Medicine Integration Tracker</dd></div><div><dt>Stack</dt><dd>Next.js, FastAPI, Tailwind CSS, Recharts, react-simple-maps</dd></div>
          </dl>
        </section>
      </div>}

      {dashboard && (
        <footer className="footer-note">
          <span>Infocreon Internship · POC-59</span>
          <span>Illustrative analysis only · No external healthcare sources connected</span>
        </footer>
      )}
    </main>
  );
}
