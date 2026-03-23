"use client";
import { useState } from "react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";
import { StepIndicator } from "@/components/ui/StepIndicator";
import {
  parseW2, populate1040, parseBrokerage, determineSchedules,
  W2Data, Form1040, BrokerageData, ScheduleFlags,
} from "@/lib/mockAI";

const STEPS = [
  { label: "Upload W-2" },
  { label: "1040 Populated" },
  { label: "Deductions" },
  { label: "Investments" },
  { label: "Review" },
];

type Step = 0 | 1 | 2 | 3 | 4;

function Field({ label, value, source }: { label: string; value: string; source?: string }) {
  return (
    <div className="bg-violet-50 rounded-lg p-3">
      <p className="text-xs text-violet-500 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
      {source && <p className="text-xs text-gray-400 mt-0.5">Source: {source}</p>}
    </div>
  );
}

function ScheduleBadge({ active, label, detail }: { active: boolean; label: string; detail: string }) {
  return (
    <div className={`rounded-xl border p-4 ${active ? "border-violet-300 bg-violet-50" : "border-gray-200 bg-gray-50 opacity-50"}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-sm font-bold ${active ? "text-violet-700" : "text-gray-400"}`}>
          {active ? "✓" : "—"} {label}
        </span>
        {active && <span className="text-xs bg-violet-200 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Generated</span>}
      </div>
      <p className="text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function currency(n: number) {
  return n < 0
    ? `-$${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default function TaxFilingDemo() {
  const [step, setStep] = useState<Step>(0);
  const [w2File, setW2File] = useState<File | null>(null);
  const [brokerageFile, setBrokerageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [w2Data, setW2Data] = useState<W2Data | null>(null);
  const [form1040, setForm1040] = useState<Form1040 | null>(null);
  const [deductions, setDeductions] = useState({ mortgage: 0, donations: 0, salt: 0, studentLoan: 0 });
  const [brokerageData, setBrokerageData] = useState<BrokerageData | null>(null);
  const [schedules, setSchedules] = useState<ScheduleFlags | null>(null);
  const [selectedState, setSelectedState] = useState("CO");

  async function handleUploadW2() {
    if (!w2File) return;
    setLoading(true);
    setStep(1);
    const w2 = await parseW2(w2File);
    setW2Data(w2);
    const f1040 = await populate1040(w2);
    setForm1040(f1040);
    setLoading(false);
  }

  async function handleDeductions() {
    setStep(3);
  }

  async function handleBrokerage() {
    setLoading(true);
    let brokerage: BrokerageData | null = null;
    if (brokerageFile) {
      brokerage = await parseBrokerage(brokerageFile);
      setBrokerageData(brokerage);
    }
    const flags = await determineSchedules(w2Data!, brokerage, deductions);
    setSchedules(flags);
    setStep(4);
    setLoading(false);
  }

  function reset() {
    setStep(0); setW2File(null); setBrokerageFile(null);
    setW2Data(null); setForm1040(null); setBrokerageData(null);
    setSchedules(null); setDeductions({ mortgage: 0, donations: 0, salt: 0, studentLoan: 0 });
  }

  const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-violet-600 hover:underline mb-6 block">← Back to demos</Link>

      <div className="mb-6">
        <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-1 rounded-full">Demo 2</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">W-2 Tax Filing</h1>
        <p className="text-gray-500 text-sm mt-1">Upload your documents — AI populates your return</p>
      </div>

      <StepIndicator steps={STEPS} current={step} color="violet" />

      {/* Step 0 — Upload W-2 */}
      {step === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Upload Your W-2</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your employer&apos;s W-2 PDF (received by Jan 31). AI will extract all fields and populate Form 1040 automatically.
          </p>
          <FileUpload label="Drop W-2 PDF here" hint="PDF from your employer · Max 20MB" onFile={setW2File} color="violet" />
          {w2File && (
            <button onClick={handleUploadW2} className="mt-6 w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Extract & Populate 1040 →
            </button>
          )}
        </div>
      )}

      {/* Step 1 — Parsing W2 */}
      {step === 1 && loading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <div className="text-4xl mb-4 animate-pulse">🤖</div>
          <h2 className="text-lg font-semibold">AI is reading your W-2…</h2>
          <p className="text-sm text-gray-400 mt-2">Extracting wages, withholdings, employer info</p>
          <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 bg-violet-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Step 1 — W2 + 1040 shown */}
      {step >= 1 && !loading && w2Data && form1040 && (
        <div className="space-y-4">
          {/* W2 fields */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-500 font-bold">✓</span>
              <h2 className="font-semibold">W-2 Data Extracted</h2>
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">AI Parsed</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employer" value={w2Data.employerName} source="W-2 Header" />
              <Field label="EIN" value={w2Data.employerEIN} source="W-2 Header" />
              <Field label="Box 1 · Wages" value={currency(w2Data.wages)} source="W-2 Box 1" />
              <Field label="Box 2 · Fed Withheld" value={currency(w2Data.federalWithheld)} source="W-2 Box 2" />
              <Field label="Box 4 · SS Withheld" value={currency(w2Data.socialSecurityWithheld)} source="W-2 Box 4" />
              <Field label="Box 6 · Medicare" value={currency(w2Data.medicareWithheld)} source="W-2 Box 6" />
              <Field label="Box 16 · State Wages" value={currency(w2Data.stateWages)} source="W-2 Box 16" />
              <Field label="Box 17 · State Withheld" value={currency(w2Data.stateWithheld)} source="W-2 Box 17" />
            </div>
          </div>

          {/* 1040 summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Form 1040 — Auto-Populated</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Wages (Line 1a)", value: currency(form1040.wages) },
                { label: "Standard Deduction", value: `-${currency(form1040.standardDeduction)}` },
                { label: "Taxable Income (Line 15)", value: currency(form1040.taxableIncome) },
                { label: "Estimated Tax", value: currency(form1040.estimatedTax) },
                { label: "Federal Tax Withheld", value: `-${currency(form1040.totalWithheld)}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-mono font-medium">{row.value}</span>
                </div>
              ))}
              <div className={`flex justify-between py-3 rounded-lg px-3 font-bold ${form1040.refundOrOwed >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                <span>{form1040.refundOrOwed >= 0 ? "Estimated Refund" : "Amount Owed"}</span>
                <span className="font-mono">{currency(Math.abs(form1040.refundOrOwed))}</span>
              </div>
            </div>
            {step === 1 && (
              <button onClick={() => setStep(2)} className="mt-6 w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors">
                Next: Add Deductions →
              </button>
            )}
          </div>

          {/* Step 2 — Deductions */}
          {step >= 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold mb-1">Deductions Checklist</h2>
              <p className="text-sm text-gray-500 mb-4">Enter any deductions. If your total exceeds ${(14600).toLocaleString()} (standard deduction), Schedule A will be generated.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { key: "mortgage", label: "Mortgage Interest" },
                  { key: "donations", label: "Charitable Donations" },
                  { key: "salt", label: "State & Local Taxes (max $10k)" },
                  { key: "studentLoan", label: "Student Loan Interest" },
                ] .map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        className="w-full border border-gray-200 rounded-lg py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                        value={deductions[key as keyof typeof deductions] || ""}
                        onChange={e => setDeductions(d => ({ ...d, [key]: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {step === 2 && (
                <button onClick={handleDeductions} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  Next: Investment Accounts →
                </button>
              )}
            </div>
          )}

          {/* Step 3 — Brokerage */}
          {step >= 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold mb-1">Investment Accounts</h2>
              <p className="text-sm text-gray-500 mb-4">Did you have any investment accounts last year? Upload your brokerage tax statement (e.g., Robinhood 1099).</p>
              <FileUpload label="Drop brokerage statement here (optional)" hint="Robinhood, Fidelity, Schwab, etc. · PDF" onFile={setBrokerageFile} color="violet" />

              {/* State */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">State of Residence</label>
                <select
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                >
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {step === 3 && (
                <button onClick={handleBrokerage} className="mt-5 w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors" disabled={loading}>
                  {loading ? "Processing…" : "Generate Return Package →"}
                </button>
              )}
            </div>
          )}

          {/* Step 4 — Schedules + Review */}
          {step === 4 && schedules && (
            <div className="space-y-4">
              {/* Brokerage extracted */}
              {brokerageData && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-green-500 font-bold">✓</span>
                    <h2 className="font-semibold">Brokerage Statement Extracted</h2>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">AI Parsed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Total Dividends" value={currency(brokerageData.totalDividends)} source="1099-DIV Box 1a" />
                    <Field label="Qualified Dividends" value={currency(brokerageData.qualifiedDividends)} source="1099-DIV Box 1b" />
                    <Field label="Interest Income" value={currency(brokerageData.totalInterest)} source="1099-INT Box 1" />
                    <Field label="Net Gain / Loss" value={currency(brokerageData.netGainLoss)} source="1099-B Summary" />
                  </div>
                </div>
              )}

              {/* Schedules */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold mb-4">Schedules Generated</h2>
                <div className="grid grid-cols-1 gap-3">
                  <ScheduleBadge
                    active={schedules.scheduleA}
                    label="Schedule A — Itemized Deductions"
                    detail={schedules.scheduleAData
                      ? `Itemized total: ${currency(schedules.scheduleAData.totalItemized)} vs standard ${currency(schedules.scheduleAData.standardDeduction)}`
                      : "Standard deduction applies — Schedule A not required"}
                  />
                  <ScheduleBadge
                    active={schedules.scheduleB}
                    label="Schedule B — Interest & Dividend Income"
                    detail={schedules.scheduleBData
                      ? `Dividends: ${currency(schedules.scheduleBData.dividends)} · Interest: ${currency(schedules.scheduleBData.interest)} (exceeds $1,500 threshold)`
                      : "Total dividend + interest income under $1,500 — Schedule B not required"}
                  />
                  <ScheduleBadge
                    active={schedules.scheduleD}
                    label="Schedule D — Capital Gains & Losses"
                    detail={schedules.scheduleDData
                      ? `Short-term: ${currency(schedules.scheduleDData.shortTerm)} · Long-term: ${currency(schedules.scheduleDData.longTerm)} · Net: ${currency(schedules.scheduleDData.net)}`
                      : "No securities sold — Schedule D not required"}
                  />
                </div>
              </div>

              {/* State return */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <h2 className="font-semibold">State Return — {selectedState}</h2>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedState === "CO"
                    ? "Colorado Form DR 0104 pre-populated. State income: "
                    : `${selectedState} state return pre-populated. State income: `}
                  <strong>{currency(w2Data.stateWages)}</strong> · State withheld: <strong>{currency(w2Data.stateWithheld)}</strong>
                </p>
              </div>

              {/* Export */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold mb-3">Export Package</h2>
                <div className="space-y-2 mb-4">
                  {[
                    { icon: "📊", label: "ProSeries Import File", detail: "CSV · All 1040 fields mapped", ready: true },
                    { icon: "📄", label: "Form 1040 (filled PDF)", detail: "Federal return, all schedules attached", ready: true },
                    { icon: "📋", label: "State Return PDF", detail: `${selectedState} · Pre-populated`, ready: true },
                    { icon: "📝", label: "AI Extraction Log", detail: "All fields, sources, confidence scores", ready: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.detail}</p>
                      </div>
                      <button className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors">
                    ✓ Approve & Export All
                  </button>
                  <button onClick={reset} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm">
                    Run Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
