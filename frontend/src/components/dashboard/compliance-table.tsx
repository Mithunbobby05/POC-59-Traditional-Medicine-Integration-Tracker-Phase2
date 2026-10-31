"use client";

import { useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { LicensingMapRegion, LicensingRankingsResponse } from "@/lib/types";
import { matchesSearchTerms, parseSearchTerms } from "@/lib/search";
import { Button } from "@/components/ui/button";

interface ComplianceTableProps {
  rankings: LicensingRankingsResponse;
  regions: LicensingMapRegion[];
  regionCode: string;
  modality: string;
  search: string;
}

type ComplianceRow = {
  region_code: string;
  region_name: string;
  country: string;
  modality: string;
  total_licenses: number;
  compliant_licenses: number;
  compliance_rate: number;
  rank: number;
};

function escapeCsv(value: string | number) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function ComplianceTable({ rankings, regions, regionCode, modality, search }: ComplianceTableProps) {
  const rankByRegion = useMemo(
    () => new Map(rankings.rankings.map((item) => [item.region_code, item.rank])),
    [rankings.rankings],
  );
  const searchTerms = useMemo(() => parseSearchTerms(search), [search]);
  const rows = useMemo(() => regions
    .filter((region) => regionCode === "all" || region.region.code === regionCode)
    .flatMap((region) => region.licensing
      .filter((row) => modality === "all" || row.modality === modality)
      .map((row) => ({ ...row, rank: rankByRegion.get(region.region.code) ?? 0 })))
    .filter((row) => matchesSearchTerms([row.region_name, row.country, row.region_code, row.modality], searchTerms))
    .sort((a, b) => a.rank - b.rank || b.compliance_rate - a.compliance_rate),
  [regions, regionCode, modality, searchTerms, rankByRegion]);

  const columns = useMemo<ColumnDef<ComplianceRow>[]>(() => [
    { accessorKey: "rank", header: "Rank", cell: ({ row }) => <span className={`rank-number ${row.index < 3 ? "rank-highlight" : ""}`}>{String(row.original.rank).padStart(2, "0")}</span> },
    { accessorKey: "region_name", header: "Region", cell: ({ row }) => <><span className="table-region">{row.original.region_name}</span><small className="table-country">{row.original.country}</small></> },
    { accessorKey: "modality", header: "Modality" },
    { accessorKey: "total_licenses", header: "Total licenses", cell: ({ getValue }) => Number(getValue()).toLocaleString() },
    { accessorKey: "compliant_licenses", header: "Compliant", cell: ({ getValue }) => Number(getValue()).toLocaleString() },
    { accessorKey: "compliance_rate", header: "Rate", cell: ({ getValue }) => <span className="rate-value">{Number(getValue()).toFixed(1)}%</span> },
  ], []);
  // TanStack Table exposes a mutable table instance; React Compiler intentionally skips memoizing it.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => `${row.region_code}-${row.modality}`,
  });

  const exportCsv = () => {
    const lines = [
      ["SYNTHETIC DATA — NOT REAL"].map(escapeCsv).join(","),
      ["Rank", "Region", "Country", "Modality", "Total Licenses", "Compliant Licenses", "Compliance Rate"].map(escapeCsv).join(","),
      ...rows.map((row) => [row.rank, row.region_name, row.country, row.modality, row.total_licenses, row.compliant_licenses, `${row.compliance_rate.toFixed(1)}%`].map(escapeCsv).join(",")),
    ];
    const file = new Blob([`\uFEFF${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "poc-59-synthetic-licensing-compliance.csv";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="panel compliance-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">REGULATORY COVERAGE</p>
          <h2>Licensing compliance</h2>
        </div>
        <div className="table-actions"><span className="panel-index">04 / RANKED</span><Button type="button" variant="outline" size="sm" onClick={exportCsv}>Export CSV</Button></div>
      </div>
      <p className="panel-description">Regions follow the API aggregate ranking; modality rows show the synthetic breakdown.</p>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Licensing compliance table; scroll horizontally to view all columns">
        <table className="compliance-table">
          <thead><tr>{table.getHeaderGroups().flatMap((group) => group.headers).map((header) => <th key={header.id} scope="col" className={["total_licenses", "compliant_licenses", "compliance_rate"].includes(header.column.id) ? "numeric" : undefined}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr></thead>
          <tbody>
            {table.getRowModel().rows.map((row) => <tr key={row.id}>{row.getVisibleCells().map((cell) => <td key={cell.id} className={["total_licenses", "compliant_licenses", "compliance_rate"].includes(cell.column.id) ? "numeric" : undefined}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}
            {!rows.length && <tr><td className="empty-cell" colSpan={6}>No licensing records match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="formula-note">
        <span className="formula-tag">FORMULA</span>
        <span>Compliance Rate = Compliant Licenses / Total Licenses × 100</span>
      </div>
    </section>
  );
}
