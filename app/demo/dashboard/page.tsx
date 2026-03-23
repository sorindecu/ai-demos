"use client";
import { useState } from "react";
import Link from "next/link";

/* ── Synthetic data ─────────────────────────────────────────────── */

type Business = {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
  colorLight: string;
  revenue: number;
  revenuePrev: number;
  expenses: number;
  activeClients: number;
  pendingTasks: number;
  alerts: Alert[];
  kpis: KPI[];
};

type Alert = { level: "red" | "yellow" | "green"; text: string };
type KPI = { label: string; value: string; trend?: "up" | "down" | "flat" };

const businesses: Business[] = [
  {
    id: "accounting",
    name: "Franklin & Associates",
    type: "Accounting Firm",
    icon: "📊",
    color: "blue",
    colorLight: "bg-blue-50 border-blue-200 text-blue-700",
    revenue: 248500,
    revenuePrev: 231200,
    expenses: 162300,
    activeClients: 347,
    pendingTasks: 23,
    alerts: [
      { level: "red", text: "12 tax returns due within 7 days" },
      { level: "yellow", text: "3 client documents awaiting review" },
      { level: "green", text: "Q1 billing 94% collected" },
    ],
    kpis: [
      { label: "Returns Filed (YTD)", value: "1,284", trend: "up" },
      { label: "Avg Turnaround", value: "3.2 days", trend: "down" },
      { label: "Staff Utilization", value: "87%", trend: "up" },
      { label: "Client Satisfaction", value: "4.8/5", trend: "flat" },
    ],
  },
  {
    id: "senior-living-a",
    name: "Sunrise Gardens",
    type: "Senior Living Facility",
    icon: "🏡",
    color: "emerald",
    colorLight: "bg-emerald-50 border-emerald-200 text-emerald-700",
    revenue: 185400,
    revenuePrev: 178900,
    expenses: 143200,
    activeClients: 62,
    pendingTasks: 8,
    alerts: [
      { level: "yellow", text: "2 intake applications pending review" },
      { level: "green", text: "State inspection passed — no findings" },
      { level: "green", text: "Occupancy at 94%" },
    ],
    kpis: [
      { label: "Occupancy Rate", value: "94%", trend: "up" },
      { label: "Beds Available", value: "4 / 66", trend: "flat" },
      { label: "Avg Length of Stay", value: "2.4 yrs", trend: "up" },
      { label: "Staff-to-Resident", value: "1:4.1", trend: "flat" },
    ],
  },
  {
    id: "senior-living-b",
    name: "Maplewood Manor",
    type: "Senior Living Facility",
    icon: "🏠",
    color: "teal",
    colorLight: "bg-teal-50 border-teal-200 text-teal-700",
    revenue: 162800,
    revenuePrev: 159100,
    expenses: 131500,
    activeClients: 54,
    pendingTasks: 5,
    alerts: [
      { level: "red", text: "Kitchen equipment maintenance overdue" },
      { level: "yellow", text: "1 staff certification expiring in 14 days" },
      { level: "green", text: "Medication audit — 100% compliance" },
    ],
    kpis: [
      { label: "Occupancy Rate", value: "90%", trend: "flat" },
      { label: "Beds Available", value: "6 / 58", trend: "flat" },
      { label: "Avg Length of Stay", value: "1.9 yrs", trend: "up" },
      { label: "Staff-to-Resident", value: "1:3.8", trend: "flat" },
    ],
  },
  {
    id: "real-estate",
    name: "Franklin Properties",
    type: "Commercial & Residential RE",
    icon: "🏢",
    color: "amber",
    colorLight: "bg-amber-50 border-amber-200 text-amber-700",
    revenue: 94200,
    revenuePrev: 87600,
    expenses: 41800,
    activeClients: 28,
    pendingTasks: 11,
    alerts: [
      { level: "yellow", text: "4 lease renewals due this month" },
      { level: "yellow", text: "2 maintenance requests open > 48hrs" },
      { level: "green", text: "Vacancy rate at 6% (target: <10%)" },
    ],
    kpis: [
      { label: "Properties Managed", value: "19", trend: "up" },
      { label: "Vacancy Rate", value: "6%", trend: "down" },
      { label: "Avg Rent Collected", value: "97%", trend: "up" },
      { label: "Maintenance Backlog", value: "7 tickets", trend: "down" },
    ],
  },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function pctChange(curr: number, prev: number) {
  const pct = ((curr - prev) / prev) * 100;
  return pct >= 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`;
}

const trendIcon = (t?: "up" | "down" | "flat") =>
  t === "up" ? "↑" : t === "down" ? "↓" : "→";

const trendColor = (t?: "up" | "down" | "flat") =>
  t === "up"
    ? "text-emerald-600"
    : t === "down"
      ? "text-red-500"
      : "text-gray-400";

const alertDot = (l: Alert["level"]) =>
  l === "red"
    ? "bg-red-500"
    : l === "yellow"
      ? "bg-amber-400"
      : "bg-emerald-500";

/* ── Aggregate stats ─────────────────────────────────────────────── */

const totals = {
  revenue: businesses.reduce((s, b) => s + b.revenue, 0),
  revenuePrev: businesses.reduce((s, b) => s + b.revenuePrev, 0),
  expenses: businesses.reduce((s, b) => s + b.expenses, 0),
  clients: businesses.reduce((s, b) => s + b.activeClients, 0),
  tasks: businesses.reduce((s, b) => s + b.pendingTasks, 0),
  alerts: businesses.reduce((s, b) => s + b.alerts.filter((a) => a.level === "red").length, 0),
};

/* ── Components ──────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1 ${accent ?? "text-gray-900"}`}>
        {value}
      </p>
      {sub && (
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      )}
    </div>
  );
}

function BusinessCard({
  biz,
  expanded,
  onToggle,
}: {
  biz: Business;
  expanded: boolean;
  onToggle: () => void;
}) {
  const profit = biz.revenue - biz.expenses;
  const margin = ((profit / biz.revenue) * 100).toFixed(1);
  const revChange = pctChange(biz.revenue, biz.revenuePrev);
  const isUp = biz.revenue >= biz.revenuePrev;

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-200 ${
        expanded
          ? "border-gray-300 shadow-md"
          : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-6 flex items-start justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{biz.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{biz.name}</h3>
            <p className="text-sm text-gray-500">{biz.type}</p>
          </div>
        </div>

        <div className="text-right flex items-center gap-4">
          {/* Quick numbers */}
          <div>
            <p className="text-lg font-bold text-gray-900">{fmt(biz.revenue)}</p>
            <p
              className={`text-xs font-semibold ${
                isUp ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {revChange} vs prior
            </p>
          </div>

          {/* Alert count badges */}
          <div className="flex gap-1.5">
            {biz.alerts.filter((a) => a.level === "red").length > 0 && (
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">
                {biz.alerts.filter((a) => a.level === "red").length}
              </span>
            )}
            {biz.alerts.filter((a) => a.level === "yellow").length > 0 && (
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                {biz.alerts.filter((a) => a.level === "yellow").length}
              </span>
            )}
          </div>

          {/* Chevron */}
          <span
            className={`text-gray-400 transition-transform duration-200 text-lg ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5 space-y-5">
          {/* Financial row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase">Revenue</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">{fmt(biz.revenue)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase">Expenses</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">{fmt(biz.expenses)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase">Profit</p>
              <p className="text-base font-bold text-emerald-600 mt-0.5">{fmt(profit)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase">Margin</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">{margin}%</p>
            </div>
          </div>

          {/* KPIs */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Key Metrics
            </p>
            <div className="grid grid-cols-4 gap-3">
              {biz.kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-gray-50 rounded-lg p-3 flex flex-col"
                >
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    {kpi.label}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <p className="text-base font-bold text-gray-900">{kpi.value}</p>
                    <span
                      className={`text-xs font-semibold ${trendColor(kpi.trend)}`}
                    >
                      {trendIcon(kpi.trend)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Alerts &amp; Status
            </p>
            <div className="space-y-2">
              {biz.alerts.map((alert) => (
                <div
                  key={alert.text}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${alertDot(
                      alert.level
                    )}`}
                  />
                  {alert.text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats row */}
          <div className="flex gap-6 pt-2 border-t border-gray-100">
            <div className="text-sm">
              <span className="text-gray-400">Active Clients: </span>
              <span className="font-semibold text-gray-900">
                {biz.activeClients}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Pending Tasks: </span>
              <span className="font-semibold text-gray-900">
                {biz.pendingTasks}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Revenue bar visualization ───────────────────────────────────── */

function RevenueBar({ businesses: bizList }: { businesses: Business[] }) {
  const total = bizList.reduce((s, b) => s + b.revenue, 0);
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-amber-500",
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Revenue Breakdown — Current Period
      </p>
      {/* Bar */}
      <div className="flex h-8 rounded-lg overflow-hidden">
        {bizList.map((b, i) => {
          const pct = (b.revenue / total) * 100;
          return (
            <div
              key={b.id}
              className={`${colors[i]} transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${b.name}: ${fmt(b.revenue)} (${pct.toFixed(0)}%)`}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
        {bizList.map((b, i) => (
          <div key={b.id} className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-sm ${colors[i]}`} />
            <span className="text-gray-600">{b.name}</span>
            <span className="text-gray-400 font-medium">
              {((b.revenue / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const profit = totals.revenue - totals.expenses;

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Back to demos
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            Demo 3
          </span>
          <span className="text-xs text-gray-400">Live data simulation</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Executive Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          All businesses at a glance — March 2026
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          label="Total Revenue"
          value={fmt(totals.revenue)}
          sub={`${pctChange(totals.revenue, totals.revenuePrev)} vs prior`}
          accent="text-blue-600"
        />
        <StatCard
          label="Total Expenses"
          value={fmt(totals.expenses)}
        />
        <StatCard
          label="Net Profit"
          value={fmt(profit)}
          sub={`${((profit / totals.revenue) * 100).toFixed(1)}% margin`}
          accent="text-emerald-600"
        />
        <StatCard
          label="Active Clients"
          value={totals.clients.toLocaleString()}
          sub="Across all entities"
        />
        <StatCard
          label="Action Items"
          value={totals.tasks.toString()}
          sub={`${totals.alerts} critical alert${totals.alerts !== 1 ? "s" : ""}`}
          accent={totals.alerts > 0 ? "text-red-600" : "text-gray-900"}
        />
      </div>

      {/* Revenue breakdown */}
      <RevenueBar businesses={businesses} />

      {/* Business cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Business Units</h2>
          <button
            type="button"
            onClick={() =>
              setExpandedId(expandedId === "all" ? null : "all")
            }
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            {expandedId === "all" ? "Collapse All" : "Expand All"}
          </button>
        </div>
        <div className="space-y-4">
          {businesses.map((biz) => (
            <BusinessCard
              key={biz.id}
              biz={biz}
              expanded={
                expandedId === "all" || expandedId === biz.id
              }
              onToggle={() =>
                setExpandedId(
                  expandedId === biz.id ? null : biz.id
                )
              }
            />
          ))}
        </div>
      </div>

      {/* AI Insights teaser */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="font-bold text-lg">AI Insights — Coming Soon</h3>
            <p className="text-blue-100 text-sm mt-1 leading-relaxed">
              Vectis AI will analyze patterns across all four business units —
              flagging cash flow anomalies, predicting occupancy trends, surfacing
              lease renewal opportunities, and auto-generating weekly executive
              summaries. One dashboard, zero manual reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400">
        Vectis Consulting LLC · vectisco.ai · All data is synthetic for
        demonstration purposes
      </p>
    </div>
  );
}
