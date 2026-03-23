import Link from "next/link";

const demos = [
  {
    id: "senior-living",
    label: "Demo 1",
    title: "Senior Living Intake",
    subtitle: "Automated resident onboarding",
    description:
      "Upload a prospect's intake form. AI checks eligibility, generates a PDF intake packet, and updates the CRM — all without manual data entry.",
    steps: ["Upload intake form", "AI eligibility check", "PDF packet generated", "CRM auto-updated", "Status email sent"],
    color: "blue",
    href: "/demo/senior-living",
    icon: "🏠",
  },
  {
    id: "tax-filing",
    label: "Demo 2",
    title: "W-2 Tax Filing",
    subtitle: "AI-powered return preparation",
    description:
      "Upload a W-2 and brokerage statement. AI extracts all fields, populates Form 1040, generates required schedules, and exports ProSeries-ready data.",
    steps: ["Upload W-2 PDF", "AI extracts all fields", "1040 auto-populated", "Schedules B & D generated", "Export for ProSeries"],
    color: "violet",
    href: "/demo/tax-filing",
    icon: "📄",
  },
];

const colorMap: Record<string, { badge: string; border: string; btn: string; dot: string; tag: string }> = {
  blue: {
    badge: "bg-blue-100 text-blue-700",
    border: "border-blue-200 hover:border-blue-400",
    btn: "bg-blue-600 hover:bg-blue-700",
    dot: "bg-blue-500",
    tag: "bg-blue-50 text-blue-700",
  },
  violet: {
    badge: "bg-violet-100 text-violet-700",
    border: "border-violet-200 hover:border-violet-400",
    btn: "bg-violet-600 hover:bg-violet-700",
    dot: "bg-violet-500",
    tag: "bg-violet-50 text-violet-700",
  },
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          AI Business Automation
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Two live demos showing how AI eliminates manual data entry across your
          accounting firm and senior living facilities.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-10 bg-white rounded-xl border border-gray-200 p-6">
        {[
          { label: "Hours saved per week", value: "40+" },
          { label: "Manual re-entry eliminated", value: "100%" },
          { label: "Demos ready for April 24", value: "2" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Demo cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {demos.map((demo) => {
          const c = colorMap[demo.color];
          return (
            <div
              key={demo.id}
              className={`bg-white rounded-2xl border-2 ${c.border} p-8 flex flex-col transition-all duration-200 shadow-sm hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{demo.icon}</span>
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                      {demo.label}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-1">{demo.title}</h2>
                    <p className="text-sm text-gray-500">{demo.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{demo.description}</p>

              {/* Steps */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Workflow</p>
                <ol className="space-y-2">
                  {demo.steps.map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className={`w-5 h-5 rounded-full ${c.dot} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <Link
                  href={demo.href}
                  className={`w-full block text-center ${c.btn} text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-150`}
                >
                  Launch Demo →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 mt-10">
        Vectis Consulting LLC · vectisco.ai · All demos use synthetic data only
      </p>
    </div>
  );
}
