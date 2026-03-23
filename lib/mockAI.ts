// Mock AI responses — replace with real Claude API calls when key is available

export async function delay(ms = 1400) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Senior Living ─────────────────────────────────────────────────────────────

export interface ProspectData {
  name: string;
  dob: string;
  email: string;
  phone: string;
  careLevel: string;
  monthlyIncome: number;
  moveInTimeline: string;
  emergencyContact: string;
}

export interface EligibilityResult {
  status: "approved" | "rejected" | "waitlisted";
  reason: string;
  incomeCheck: boolean;
  availabilityCheck: boolean;
}

export async function parseIntakeForm(_file: File): Promise<ProspectData> {
  await delay(1600);
  return {
    name: "Margaret Thornton",
    dob: "1942-03-15",
    email: "m.thornton@email.com",
    phone: "(303) 555-0182",
    careLevel: "Assisted Living",
    monthlyIncome: 4200,
    moveInTimeline: "Within 30 days",
    emergencyContact: "James Thornton (son) · (303) 555-0199",
  };
}

export async function runEligibilityCheck(data: ProspectData): Promise<EligibilityResult> {
  await delay(1200);
  const incomeCheck = data.monthlyIncome >= 2500;
  const availabilityCheck = true; // beds available in demo
  const status = incomeCheck && availabilityCheck ? "approved" : !incomeCheck ? "rejected" : "waitlisted";
  return {
    status,
    incomeCheck,
    availabilityCheck,
    reason: status === "approved"
      ? "Income threshold met · Bed availability confirmed"
      : status === "rejected"
      ? `Monthly income ($${data.monthlyIncome.toLocaleString()}) below $2,500 threshold`
      : "Income threshold met · No beds currently available — added to waitlist",
  };
}

export async function generateIntakePDF(data: ProspectData): Promise<string> {
  await delay(1800);
  return `Intake_${data.name.replace(" ", "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
}

// ── Tax Filing ────────────────────────────────────────────────────────────────

export interface W2Data {
  employerName: string;
  employerEIN: string;
  wages: number;
  federalWithheld: number;
  socialSecurityWages: number;
  socialSecurityWithheld: number;
  medicareWages: number;
  medicareWithheld: number;
  stateWages: number;
  stateWithheld: number;
  state: string;
}

export interface Form1040 {
  filingStatus: string;
  wages: number;
  standardDeduction: number;
  taxableIncome: number;
  estimatedTax: number;
  totalWithheld: number;
  refundOrOwed: number;
}

export interface BrokerageData {
  totalDividends: number;
  qualifiedDividends: number;
  totalInterest: number;
  stocksSold: boolean;
  totalProceeds: number;
  totalCostBasis: number;
  netGainLoss: number;
  shortTermGainLoss: number;
  longTermGainLoss: number;
}

export interface ScheduleFlags {
  scheduleA: boolean;
  scheduleB: boolean;
  scheduleD: boolean;
  scheduleAData?: { totalItemized: number; standardDeduction: number };
  scheduleBData?: { dividends: number; interest: number };
  scheduleDData?: { shortTerm: number; longTerm: number; net: number };
}

export async function parseW2(_file: File): Promise<W2Data> {
  await delay(1800);
  return {
    employerName: "Meridian Healthcare Group LLC",
    employerEIN: "84-2910374",
    wages: 87500,
    federalWithheld: 14200,
    socialSecurityWages: 87500,
    socialSecurityWithheld: 5425,
    medicareWages: 87500,
    medicareWithheld: 1269,
    stateWages: 87500,
    stateWithheld: 3937,
    state: "CO",
  };
}

export async function populate1040(w2: W2Data, filingStatus = "Single"): Promise<Form1040> {
  await delay(1000);
  const standardDeduction = filingStatus === "Single" ? 14600 : 29200;
  const taxableIncome = Math.max(0, w2.wages - standardDeduction);
  // Simplified 2024 tax brackets (single)
  let estimatedTax = 0;
  if (taxableIncome > 578125) estimatedTax = 174238 + (taxableIncome - 578125) * 0.37;
  else if (taxableIncome > 231250) estimatedTax = 52832 + (taxableIncome - 231250) * 0.35;
  else if (taxableIncome > 100525) estimatedTax = 17400 + (taxableIncome - 100525) * 0.32;
  else if (taxableIncome > 47150) estimatedTax = 5147 + (taxableIncome - 47150) * 0.22;
  else if (taxableIncome > 11600) estimatedTax = 1160 + (taxableIncome - 11600) * 0.12;
  else estimatedTax = taxableIncome * 0.10;

  return {
    filingStatus,
    wages: w2.wages,
    standardDeduction,
    taxableIncome,
    estimatedTax: Math.round(estimatedTax),
    totalWithheld: w2.federalWithheld,
    refundOrOwed: w2.federalWithheld - Math.round(estimatedTax),
  };
}

export async function parseBrokerage(_file: File): Promise<BrokerageData> {
  await delay(1800);
  return {
    totalDividends: 2340.18,
    qualifiedDividends: 1890.44,
    totalInterest: 412.67,
    stocksSold: true,
    totalProceeds: 23450.00,
    totalCostBasis: 19200.00,
    netGainLoss: 4250.00,
    shortTermGainLoss: -320.00,
    longTermGainLoss: 4570.00,
  };
}

export async function determineSchedules(
  w2: W2Data,
  brokerage: BrokerageData | null,
  deductions: { mortgage: number; donations: number; salt: number; studentLoan: number }
): Promise<ScheduleFlags> {
  await delay(900);
  const totalItemized = deductions.mortgage + deductions.donations + Math.min(deductions.salt, 10000) + deductions.studentLoan;
  const standardDeduction = 14600;
  const scheduleA = totalItemized > standardDeduction;
  const scheduleB = brokerage ? (brokerage.totalDividends + brokerage.totalInterest) > 1500 : false;
  const scheduleD = brokerage ? brokerage.stocksSold : false;

  return {
    scheduleA,
    scheduleB,
    scheduleD,
    scheduleAData: scheduleA ? { totalItemized, standardDeduction } : undefined,
    scheduleBData: scheduleB && brokerage ? { dividends: brokerage.totalDividends, interest: brokerage.totalInterest } : undefined,
    scheduleDData: scheduleD && brokerage ? { shortTerm: brokerage.shortTermGainLoss, longTerm: brokerage.longTermGainLoss, net: brokerage.netGainLoss } : undefined,
  };
}
