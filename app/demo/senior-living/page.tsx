"use client";
import { useState } from "react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";
import { StepIndicator } from "@/components/ui/StepIndicator";
import {
  parseIntakeForm, runEligibilityCheck, generateIntakePDF,
  ProspectData, EligibilityResult,
} from "@/lib/mockAI";

const STEPS = [
  { label: "Upload" },
  { label: "Parsing" },
  { label: "Eligibility" },
  { label: "PDF Ready" },
  { label: "Complete" },
];

type Step = 0 | 1 | 2 | 3 | 4;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-blue-50 rounded-lg p-3">
      <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
      <span>{ok ? "✓" : "✗"}</span> {label}
    </div>
  );
}

export default function SeniorLivingDemo() {
  const [step, setStep] = useState<Step>(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [prospect, setProspect] = useState<ProspectData | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [crmUpdated, setCrmUpdated] = useState(false);

  async function handleProcess() {
    if (!file) return;
    setLoading(true);
    setStep(1);
    const data = await parseIntakeForm(file);
    setProspect(data);
    setStep(2);
    const result = await runEligibilityCheck(data);
    setEligibility(result);
    if (result.status === "approved") {
      setStep(3);
      const pdf = await generateIntakePDF(data);
      setPdfName(pdf);
    }
    setStep(4);
    setCrmUpdated(true);
    setLoading(false);
  }

  function reset() {
    setStep(0); setFile(null); setProspect(null);
    setEligibility(null); setPdfName(null); setCrmUpdated(false);
  }

  const statusColors: Record<string, string> = {
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    waitlisted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 block">← Back to demos</Link>

      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Demo 1</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Senior Living Intake</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a prospect file — AI handles the rest</p>
      </div>

      <StepIndicator steps={STEPS} current={step} color="blue" />

      {/* Step 0 — Upload */}
      {step === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Upload Prospect File</h2>
          <p className="text-sm text-gray-500 mb-6">
            Upload the prospect&apos;s intake form. AI will extract all fields, run eligibility checks, and generate an intake packet automatically.
          </p>
          <FileUpload
            label="Drop intake form PDF here"
            hint="PDF · Max 20MB"
            onFile={setFile}
            color="blue"
          />
          {file && (
            <button
              onClick={handleProcess}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Process with AI →
            </button>
          )}
        </div>
      )}

      {/* Step 1 — Parsing */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <div className="text-4xl mb-4 animate-pulse">🤖</div>
          <h2 className="text-lg font-semibold">AI is reading the intake form…</h2>
          <p className="text-sm text-gray-400 mt-2">Extracting name, contact info, care level, income data</p>
          <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 bg-blue-500 rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3" />
          </div>
        </div>
      )}

      {/* Step 2+ — Results */}
      {step >= 2 && prospect && (
        <div className="space-y-4">
          {/* Extracted fields */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-500 font-bold text-lg">✓</span>
              <h2 className="font-semibold text-gray-900">Fields Extracted from PDF</h2>
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">AI Parsed</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name" value={prospect.name} />
              <Field label="Date of Birth" value={prospect.dob} />
              <Field label="Email" value={prospect.email} />
              <Field label="Phone" value={prospect.phone} />
              <Field label="Care Level" value={prospect.careLevel} />
              <Field label="Monthly Income" value={`$${prospect.monthlyIncome.toLocaleString()}`} />
              <Field label="Move-in Timeline" value={prospect.moveInTimeline} />
              <Field label="Emergency Contact" value={prospect.emergencyContact} />
            </div>
          </div>

          {/* Eligibility */}
          {step >= 2 && eligibility && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold mb-4">Eligibility Check</h2>
              <div className="space-y-2 mb-4">
                <Badge ok={eligibility.incomeCheck} label={`Income check · $${prospect.monthlyIncome.toLocaleString()}/mo vs $2,500 threshold`} />
                <Badge ok={eligibility.availabilityCheck} label="Bed availability · Confirmed" />
              </div>
              <div className={`border rounded-xl px-4 py-3 font-semibold text-sm ${statusColors[eligibility.status]}`}>
                Status: {eligibility.status.charAt(0).toUpperCase() + eligibility.status.slice(1)} — {eligibility.reason}
              </div>
            </div>
          )}

          {/* PDF */}
          {step >= 3 && pdfName && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📄</span>
                <div>
                  <h2 className="font-semibold text-gray-900">Intake PDF Generated</h2>
                  <p className="text-sm text-gray-500">{pdfName}</p>
                </div>
                <button className="ml-auto text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {/* CRM Updated */}
          {step === 4 && crmUpdated && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold mb-3">CRM Updated</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      {["Name", "Email", "Care Level", "Status", "PDF Link", "Updated At"].map(h => (
                        <th key={h} className="px-3 py-2 font-semibold text-gray-500 border-b border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-green-50">
                      <td className="px-3 py-2 font-medium">{prospect.name}</td>
                      <td className="px-3 py-2">{prospect.email}</td>
                      <td className="px-3 py-2">{prospect.careLevel}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${eligibility?.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {eligibility?.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-blue-600 underline cursor-pointer">{pdfName || "—"}</td>
                      <td className="px-3 py-2 text-gray-400">{new Date().toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-3">
                <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-center">
                  <span className="text-green-600 font-semibold">✓ Status email queued</span>
                  <p className="text-xs text-gray-400 mt-0.5">Approval email ready to send to {prospect.email}</p>
                </div>
                <button
                  onClick={reset}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
                >
                  Run Again
                </button>
              </div>
            </div>
          )}

          {loading && step < 4 && (
            <div className="text-center py-4">
              <div className="text-sm text-gray-400 animate-pulse">Processing…</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
