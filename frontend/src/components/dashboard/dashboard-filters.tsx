import type { Region } from "@/lib/types";

export type PeriodLength = 3 | 6 | 12;

interface DashboardFiltersProps {
  regions: Region[];
  modalities: string[];
  regionCode: string;
  modality: string;
  period: PeriodLength;
  search: string;
  onRegionChange: (value: string) => void;
  onModalityChange: (value: string) => void;
  onPeriodChange: (value: PeriodLength) => void;
  onReset: () => void;
  onSearchChange: (value: string) => void;
}

export function DashboardFilters({
  regions,
  modalities,
  regionCode,
  modality,
  period,
  search,
  onRegionChange,
  onModalityChange,
  onPeriodChange,
  onReset,
  onSearchChange,
}: DashboardFiltersProps) {
  return (
    <section className="filter-bar" aria-label="Dashboard filters">
      <div className="filter-heading">
        <span className="section-kicker">VIEW</span>
        <span className="filter-label">Filter the intelligence</span>
      </div>
      <label className="filter-control">
        <span>Region</span>
        <select value={regionCode} onChange={(event) => onRegionChange(event.target.value)}>
          <option value="all">All regions</option>
          {regions.map((region) => (
            <option key={region.code} value={region.code}>{region.name}</option>
          ))}
        </select>
      </label>
      <label className="filter-control">
        <span>Modality</span>
        <select value={modality} onChange={(event) => onModalityChange(event.target.value)}>
          <option value="all">All modalities</option>
          {modalities.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>
      <label className="filter-control">
        <span>Usage window</span>
        <select value={period} onChange={(event) => onPeriodChange(Number(event.target.value) as PeriodLength)}>
          <option value={3}>Last 3 months</option>
          <option value={6}>Last 6 months</option>
          <option value={12}>12 months</option>
        </select>
      </label>
      <label className="filter-control search-control">
        <span>Search region or modality</span>
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="e.g. Qatar, Ayurveda" />
      </label>
      <button className="reset-button" type="button" onClick={onReset}>Reset filters</button>
    </section>
  );
}
