interface Step { label: string; }

interface StepIndicatorProps {
  steps: Step[];
  current: number;
  color?: "blue" | "violet";
}

export function StepIndicator({ steps, current, color = "blue" }: StepIndicatorProps) {
  const activeColor = color === "blue" ? "bg-blue-600" : "bg-violet-600";
  const doneColor = color === "blue" ? "bg-blue-200 text-blue-700" : "bg-violet-200 text-violet-700";
  const lineActive = color === "blue" ? "bg-blue-600" : "bg-violet-600";

  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${i < current ? doneColor : i === current ? `${activeColor} text-white shadow-lg` : "bg-gray-200 text-gray-400"}`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium whitespace-nowrap ${i === current ? "text-gray-900" : "text-gray-400"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${i < current ? lineActive : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
