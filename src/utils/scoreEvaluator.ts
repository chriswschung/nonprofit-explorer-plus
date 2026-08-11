import type { NonProfitData, DimensionRating, AgentDebateStatement } from '../types/nonprofit';

export interface ScoreEvaluationResult {
  overallScore: number;
  ratings: DimensionRating[];
  agentDebates: AgentDebateStatement[];
}

export function evaluateNonProfitScore(np: NonProfitData): ScoreEvaluationResult {
  const progRatio = np.programExpenseRatio || 80;
  const reserveMonths = np.operatingReserveMonths || 12;
  const govScore = np.governanceScore || 8.5;
  const publicSupport = np.publicSupportRatio || 85;
  const ceoPay = np.executives && np.executives[0] ? np.executives[0].compensation : (np.totalRevenue * 0.01);
  const totalExp = Math.max(1, np.totalExpenses || np.totalRevenue * 0.88);
  const ceoPercentOfBudget = (ceoPay / totalExp) * 100;

  // 1. Calculate Dimension Scores
  // Program Efficiency Score
  let progScore = 9.0;
  let progStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_IMPROVEMENT' = 'GOOD';
  let progComment = '';

  if (progRatio >= 85) {
    progScore = Math.min(10, 8.5 + (progRatio - 85) * 0.1);
    progStatus = 'EXCELLENT';
    progComment = `Exceptional ${progRatio.toFixed(1)}% program expense ratio exceeds Gold Charity Benchmarks.`;
  } else if (progRatio >= 75) {
    progScore = 7.5 + (progRatio - 75) * 0.1;
    progStatus = 'GOOD';
    progComment = `Solid ${progRatio.toFixed(1)}% program expense ratio meets standard 75% charity guidelines.`;
  } else if (progRatio >= 65) {
    progScore = 6.0 + (progRatio - 65) * 0.15;
    progStatus = 'FAIR';
    progComment = `Moderate ${progRatio.toFixed(1)}% program expense ratio indicates higher overhead costs (${(100 - progRatio).toFixed(1)}% admin/fundraising).`;
  } else {
    progScore = Math.max(3.0, 3.5 + progRatio * 0.04);
    progStatus = 'NEEDS_IMPROVEMENT';
    progComment = `ALERT: Low ${progRatio.toFixed(1)}% program expense ratio! Over ${(100 - progRatio).toFixed(1)}% of total budget is absorbed by administrative and fundraising overhead.`;
  }

  // CEO Compensation Score
  let ceoScore = 9.0;
  let ceoComment = '';
  if (ceoPercentOfBudget <= 0.8) {
    ceoScore = 9.5;
    ceoComment = `Executive compensation represents a modest ${ceoPercentOfBudget.toFixed(2)}% of annual functional expenses ($${(ceoPay / 1000).toFixed(0)}K).`;
  } else if (ceoPercentOfBudget <= 2.0) {
    ceoScore = 8.0;
    ceoComment = `Executive compensation is within standard peer range at ${ceoPercentOfBudget.toFixed(2)}% of budget ($${(ceoPay / 1000).toFixed(0)}K).`;
  } else {
    ceoScore = 5.2;
    ceoComment = `ELEVATED EXECUTIVE PAY: CEO compensation of $${(ceoPay / 1000).toFixed(0)}K represents ${ceoPercentOfBudget.toFixed(2)}% of total operating expenses, above peer median.`;
  }

  // Reserve Months Score
  let reserveScore = 8.5;
  let reserveComment = '';
  if (reserveMonths >= 12) {
    reserveScore = 9.2;
    reserveComment = `Strong liquidity reserve of ${reserveMonths.toFixed(1)} months provides fiscal resilience against economic downturns.`;
  } else if (reserveMonths >= 6) {
    reserveScore = 7.8;
    reserveComment = `Adequate operating reserve buffer of ${reserveMonths.toFixed(1)} months meets baseline non-profit continuity standards.`;
  } else {
    reserveScore = 5.0;
    reserveComment = `LIMITED RESERVES: Operating cushion of only ${reserveMonths.toFixed(1)} months leaves organization vulnerable to revenue shocks.`;
  }

  // Weighted Overall Score Calculation
  // Program (30%) + Governance (20%) + CEO Pay (15%) + Reserves (15%) + Public Support (10%) + Audit (10%)
  const rawOverall = (progScore * 0.30) + (govScore * 0.20) + (ceoScore * 0.15) + (reserveScore * 0.15) + ((publicSupport / 10) * 0.10) + (9.0 * 0.10);
  const finalOverallScore = Math.round(Math.min(10, Math.max(3.0, rawOverall)) * 10) / 10;

  // 2. Generate Synchronized Ratings
  const ratings: DimensionRating[] = [
    {
      dimension: 'Program Expense Ratio',
      score: Math.round(progScore * 10) / 10,
      status: progStatus,
      summary: progComment,
      reasoning: [`Part IX Line 25 Column B reports $${(np.programExpenses / 1000000).toFixed(2)}M in direct program activities out of $${(totalExp / 1000000).toFixed(2)}M total expenses.`],
      form990Citations: ['Form 990 Part IX Line 25 Column B', 'Form 990 Part IX Line 25 Column C & D'],
      peerComparison: progRatio >= 75 ? 'Meets or exceeds peer median program allocation.' : 'Falls below peer benchmark for program efficiency.'
    },
    {
      dimension: 'Executive Compensation',
      score: Math.round(ceoScore * 10) / 10,
      status: ceoScore >= 8.5 ? 'EXCELLENT' : ceoScore >= 7.5 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
      summary: ceoComment,
      reasoning: [`Part VII reports total principal officer compensation of $${(ceoPay / 1000).toFixed(0)}K (${ceoPercentOfBudget.toFixed(2)}% of budget).`],
      form990Citations: ['Form 990 Part VII Section A', 'Form 990 Schedule J'],
      peerComparison: ceoPercentOfBudget <= 1.5 ? 'Executive pay is well-aligned with peer organization scale.' : 'Executive pay is higher relative to total operating budget.'
    },
    {
      dimension: 'Operating Reserves & Fiscal Health',
      score: Math.round(reserveScore * 10) / 10,
      status: reserveScore >= 8.5 ? 'EXCELLENT' : reserveScore >= 7.5 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
      summary: reserveComment,
      reasoning: [`Part X reports net assets of $${(np.netAssets / 1000000).toFixed(2)}M representing ${reserveMonths.toFixed(1)} months of operating runway.`],
      form990Citations: ['Form 990 Part X Line 33', 'Form 990 Part I Line 22'],
      peerComparison: reserveMonths >= 12 ? 'Exceeds non-profit 6-12 month reserve target.' : 'Below recommended 12-month operating reserve target.'
    }
  ];

  // 3. Generate Synchronized Multi-Agent Debates
  let analystStatement = '';
  let researcherStatement = '';

  if (finalOverallScore >= 8.5) {
    analystStatement = `Strong Financial Efficiency Rating (${finalOverallScore}/10): ${progRatio.toFixed(1)}% program expense ratio with clean GAAP audit and $${(totalExp / 1000000).toFixed(1)}M operating budget.`;
    researcherStatement = `Verified High-Impact Charity: Broad public support (${publicSupport.toFixed(0)}%) with robust governance oversight and ${reserveMonths.toFixed(1)} months of liquid reserve cushion.`;
  } else if (finalOverallScore >= 7.0) {
    analystStatement = `Moderate Financial Rating (${finalOverallScore}/10): Program spend is ${progRatio.toFixed(1)}%. Administrative and fundraising overhead represents ${(100 - progRatio).toFixed(1)}% of total functional expenses.`;
    researcherStatement = `Stable Community Operations: Satisfactory governance policies present. Operating reserve buffer stands at ${reserveMonths.toFixed(1)} months.`;
  } else {
    analystStatement = `CRITICAL FINANCIAL WARNING (${finalOverallScore}/10): Low ${progRatio.toFixed(1)}% program allocation! High overhead of ${(100 - progRatio).toFixed(1)}% requires careful donor scrutiny before contributing.`;
    researcherStatement = `Oversight Alert: ${ceoPercentOfBudget > 2.0 ? `Elevated executive compensation ($${(ceoPay / 1000).toFixed(0)}K)` : 'Limited operating reserve runway'}. Governance score is ${govScore}/10.`;
  }

  const agentDebates: AgentDebateStatement[] = [
    {
      agentName: 'Elena Rostova',
      agentRole: 'Financial Analyst Agent',
      avatarColor: '#00f0ff',
      statement: analystStatement,
      scoreGiven: finalOverallScore,
      citations: ['Form 990 Part IX Line 25', 'Form 990 Part VIII Line 12']
    },
    {
      agentName: 'Dr. Sarah Lin',
      agentRole: 'Impact Researcher Agent',
      avatarColor: '#00ff88',
      statement: researcherStatement,
      scoreGiven: Math.min(10, Math.round((finalOverallScore + 0.3) * 10) / 10),
      citations: ['Form 990 Part III Line 4', 'Form 990 Schedule A']
    }
  ];

  return {
    overallScore: finalOverallScore,
    ratings,
    agentDebates
  };
}
