"use client";

import { useMemo, useState } from "react";
import type { GeoJsonObject } from "geojson";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import world from "world-atlas/countries-110m.json";
import type { LicensingMapRegion } from "@/lib/types";
import { matchesSearchTerms, parseSearchTerms } from "@/lib/search";

interface LicensingMapProps {
  regions: LicensingMapRegion[];
  modality: string;
  selectedRegion: string;
  search: string;
  onRegionSelect: (regionCode: string) => void;
}

function getRegionMetrics(region: LicensingMapRegion, modality: string, searchTerms: readonly string[]) {
  const rows = region.licensing.filter((row) =>
    (modality === "all" || row.modality === modality)
    && matchesSearchTerms(
      [region.region.name, region.region.country, region.region.code, row.modality],
      searchTerms,
    ),
  );
  const total = rows.reduce((sum, row) => sum + row.total_licenses, 0);
  const compliant = rows.reduce((sum, row) => sum + row.compliant_licenses, 0);

  return {
    total,
    compliant,
    rate: total === 0 ? 0 : (compliant / total) * 100,
    modalities: rows.length,
  };
}

function complianceColor(rate: number) {
  if (rate >= 92) return "#7ed4ba";
  if (rate >= 88) return "#e0b66f";
  return "#df8277";
}

export function LicensingMap({ regions, modality, selectedRegion, search, onRegionSelect }: LicensingMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const searchTerms = useMemo(() => parseSearchTerms(search), [search]);
  const regionMetrics = useMemo(
    () => new Map(regions.map((region) => [region.region.code, getRegionMetrics(region, modality, searchTerms)])),
    [regions, modality, searchTerms],
  );
  const visibleRegions = regions.filter((region) =>
    (selectedRegion === "all" || region.region.code === selectedRegion)
    && (regionMetrics.get(region.region.code)?.modalities ?? 0) > 0,
  );
  const activeRegion = visibleRegions.find((item) => item.region.code === hoveredRegion)
    ?? visibleRegions.find((item) => item.region.code === selectedRegion);
  const activeMetrics = activeRegion ? regionMetrics.get(activeRegion.region.code) : undefined;

  return (
    <section className="panel map-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">LICENSING FOOTPRINT</p>
          <h2>Practitioner licensing map</h2>
        </div>
        <span className="panel-index">01 / GEOGRAPHY</span>
      </div>
      <p className="panel-description">Regional coordinates with synthetic licensing compliance by modality.</p>

      <div className="map-wrap">
        <ComposableMap
          className="regional-map"
          projection="geoMercator"
          projectionConfig={{ center: [60, 21], scale: 840 }}
          width={800}
          height={450}
          aria-label="Map showing synthetic licensing records in the United Arab Emirates, Saudi Arabia, and Qatar"
        >
          <ZoomableGroup center={[60, 21]} zoom={1} minZoom={1} maxZoom={1}>
            <Geographies geography={world as unknown as GeoJsonObject}>
              {({ geographies }) => geographies.map((geography) => (
                <Geography
                  key={geography.rsmKey}
                  geography={geography}
                  className="map-country"
                  tabIndex={-1}
                />
              ))}
            </Geographies>
            {visibleRegions.map((region) => {
              const metrics = regionMetrics.get(region.region.code);
              if (!metrics) return null;
              const isActive = selectedRegion === "all" || selectedRegion === region.region.code;
              const radius = 6 + Math.min(8, Math.sqrt(metrics.total) / 3.2);

              return (
                <Marker
                  key={region.region.code}
                  coordinates={[region.region.longitude, region.region.latitude]}
                  onMouseEnter={() => setHoveredRegion(region.region.code)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onFocus={() => setHoveredRegion(region.region.code)}
                  onBlur={() => setHoveredRegion(null)}
                  onClick={() => onRegionSelect(region.region.code)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${region.region.name}: ${metrics.rate.toFixed(1)} percent compliance, ${metrics.total} synthetic licenses. Select region.`}
                >
                  <circle
                    r={radius + 6}
                    fill={complianceColor(metrics.rate)}
                    opacity={isActive ? 0.12 : 0.035}
                  />
                  <circle
                    r={radius}
                    fill="#0c151b"
                    stroke={complianceColor(metrics.rate)}
                    strokeWidth={2.2}
                    opacity={isActive ? 1 : 0.28}
                  />
                  <circle r={3.2} fill={complianceColor(metrics.rate)} opacity={isActive ? 1 : 0.4} />
                  <text y={-radius - 9} textAnchor="middle" className="map-label" opacity={isActive ? 1 : 0.35}>
                    {region.region.code}
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="map-legend" aria-label="Map legend">
        <span><i className="legend-dot compliant" /> ≥92% compliance</span>
        <span><i className="legend-dot watch" /> 88–91.9%</span>
        <span><i className="legend-dot review" /> &lt;88%</span>
        <span className="legend-size">Marker size = licenses</span>
      </div>

      {activeRegion && activeMetrics ? (
        <div className="map-detail" aria-live="polite">
          <div>
            <span className="map-detail-code">{activeRegion.region.code}</span>
            <strong>{activeRegion.region.name}</strong>
            <span className="map-coordinates">{activeRegion.region.latitude.toFixed(2)}° N · {activeRegion.region.longitude.toFixed(2)}° E</span>
          </div>
          <div className="map-detail-metric">
            <span>{modality === "all" ? "ALL MODALITIES" : modality.toUpperCase()}</span>
            <strong>{activeMetrics.rate.toFixed(1)}%</strong>
            <small>{activeMetrics.compliant.toLocaleString()} / {activeMetrics.total.toLocaleString()} compliant</small>
          </div>
        </div>
      ) : <p className="panel-empty map-selection-prompt">Hover over or select a region to see its licensing details.</p>}
      <p className="map-footnote">Point placement uses API coordinates. Country outlines are for geographic orientation; all licensing values are synthetic.</p>
    </section>
  );
}
