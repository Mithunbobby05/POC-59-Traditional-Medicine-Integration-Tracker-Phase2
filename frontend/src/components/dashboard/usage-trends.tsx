"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UsageObservation } from "@/lib/types";
import { matchesSearchTerms, parseSearchTerms } from "@/lib/search";
import type { PeriodLength } from "./dashboard-filters";

const SERIES_COLORS = ["#86d7c0", "#8bb7e6", "#e2bd7a", "#bd9ce8", "#e38b7c"];

interface UsageTrendsProps {
  observations: UsageObservation[];
  modality: string;
  regionCode: string;
  period: PeriodLength;
  search: string;
}

function formatMonth(period: string) {
  return new Date(`${period}-01T00:00:00`).toLocaleDateString("en", { month: "short", year: "2-digit" });
}

export function UsageTrends({ observations, modality, regionCode, period, search }: UsageTrendsProps) {
  const searchTerms = useMemo(() => parseSearchTerms(search), [search]);
  const { chartData, modalities } = useMemo(() => {
    const filtered = observations.filter((item) =>
      (regionCode === "all" || item.region_code === regionCode)
      && (modality === "all" || item.modality === modality)
      && matchesSearchTerms([item.region_name, item.region_code, item.modality], searchTerms),
    );
    const periods = [...new Set(filtered.map((item) => item.period))].sort().slice(-period);
    const names = [...new Set(filtered.map((item) => item.modality))];
    const records = periods.map((month) => {
      const values: Record<string, string | number> = { period: month };
      for (const observation of filtered.filter((item) => item.period === month)) {
        values[observation.modality] = (Number(values[observation.modality]) || 0) + observation.usage_volume;
      }
      return values;
    });

    return { chartData: records, modalities: names };
  }, [observations, modality, regionCode, period, searchTerms]);

  return (
    <section className="panel trend-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">USAGE SIGNAL</p>
          <h2>Usage-volume trends</h2>
        </div>
        <span className="panel-index">02 / MONTHLY</span>
      </div>
      <p className="panel-description">Synthetic monthly totals for regions and modalities matching the current filters.</p>
      <div className="chart-wrap">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#23303a" strokeDasharray="3 5" vertical={false} />
              <XAxis
                dataKey="period"
                tickFormatter={formatMonth}
                tick={{ fill: "#81909b", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#2a3741" }}
                minTickGap={20}
              />
              <YAxis
                tick={{ fill: "#81909b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(value: number) => value.toLocaleString()}
              />
              <Tooltip
                labelFormatter={(label) => formatMonth(String(label))}
                formatter={(value, name) => [Number(value).toLocaleString(), name]}
                contentStyle={{ background: "#111a21", border: "1px solid #31404b", borderRadius: 8, color: "#e7eef1", fontSize: 12 }}
                labelStyle={{ color: "#91a0aa", marginBottom: 4 }}
              />
              {modalities.length > 1 && <Legend wrapperStyle={{ fontSize: 10, color: "#aab5bc", paddingTop: 12 }} />}
              {modalities.map((name) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  name={name}
                  stroke={SERIES_COLORS[observations.findIndex((item) => item.modality === name) % SERIES_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">No usage observations match these filters.</div>
        )}
      </div>
      <div className="chart-footnote"><span>PERIOD</span><span>{chartData.length ? `${formatMonth(String(chartData[0].period))} — ${formatMonth(String(chartData[chartData.length - 1].period))}` : "No matching periods"}</span></div>
    </section>
  );
}
