export interface ExecutivePay {
  title: string;
  name: string;
  compensation: number;
  percentOfBudget: number;
  peerPercentile: number; // e.g. 25th percentile, 50th, 75th
}

export interface DimensionRating {
  dimension: string;
  score: number; // 0 - 10
  status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_IMPROVEMENT';
  summary: string;
  reasoning: string[];
  form990Citations: string[];
  peerComparison: string;
}

export interface PeerNonProfit {
  id: string;
  name: string;
  ein: string;
  nteeCategory: string;
  totalRevenue: number;
  programExpenseRatio: number;
  overallScore: number;
  ceoPay: number;
}

// Feature 3: Risk Anomaly Types
export interface RiskAnomaly {
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'GOVERNANCE' | 'COMPENSATION' | 'FUNDRAISING' | 'RESERVES';
  title: string;
  description: string;
  form990Citation: string;
}

// Feature 4: Multi-Agent Consensus Debate Types
export interface AgentDebateStatement {
  agentName: string;
  agentRole: 'Financial Analyst Agent' | 'Governance Ombudsman Agent' | 'Impact Researcher Agent';
  avatarColor: string;
  statement: string;
  scoreGiven: number; // 0 - 10
  citations: string[];
}

export interface NonProfitData {
  id: string;
  name: string;
  ein: string;
  taxYear: string;
  nteeCategory: string;
  subCategory: string;
  mission: string;
  cityState: string;
  website: string;

  // Financial Stats (Form 990)
  totalRevenue: number;
  totalExpenses: number;
  netAssets: number;
  programExpenses: number;
  adminExpenses: number;
  fundraisingExpenses: number;
  programExpenseRatio: number; // e.g. 86.4%
  fundraisingEfficiency: number; // cost per $100 raised
  operatingReserveMonths: number; // e.g. 16.1 months

  // New Form 990 Multi-Dimensional Balanced Scorecard Metrics
  revenueGrowthCAGR: number; // 3-Year CAGR %, e.g., +6.5%
  publicSupportRatio: number; // Schedule A % public support, e.g. 84.5%
  estimatedDonorsCount: number; // e.g. 145000
  averageDonationSize: number; // e.g. $125
  complianceAuditStatus: string; // e.g. "Independent CPA Clean Audit"
  governanceScore: number; // 0 - 10 score for Governance (X-axis in bubble chart)

  // Governance & Compensation
  executives: ExecutivePay[];
  independentBoardMembers: number;
  totalBoardMembers: number;
  conflictOfInterestPolicy: boolean;
  whistleblowerPolicy: boolean;

  // Revenue Breakdown (%)
  revenueSources: {
    contributionsGrants: number;
    programServiceFees: number;
    investmentIncome: number;
    otherRevenue: number;
  };

  // Feature 3: Risk Anomalies & Radar Score
  riskScore: number; // 0 - 100 (0 = Lowest Risk, 100 = Highest Risk)
  riskLevel: 'LOW_RISK' | 'MODERATE_RISK' | 'ELEVATED_RISK';
  anomalies: RiskAnomaly[];

  // Feature 4: Multi-Agent Debaters
  agentDebates: AgentDebateStatement[];

  // Feature 5: Quantifiable Impact Output Multiplier per $1,000
  quantifiableImpactUnit: string; // e.g., "Anti-poaching ranger patrol hours"
  impactPer1000Dollars: number; // e.g., 14 units per $1,000

  // Overall Score & Dimension Ratings (6-dimension balanced scorecard)
  overallScore: number; // 0 - 10
  ratings: DimensionRating[];

  // Similar Peers
  peers: PeerNonProfit[];
}

// Donation Pledge Record in Memory Bank
export interface DonationPledge {
  id: string;
  nonprofitId: string;
  nonprofitName: string;
  nteeCategory: string;
  amount: number;
  estimatedTaxSavings: number;
  quantifiableImpactUnits: number;
  quantifiableImpactUnitName: string;
  pledgedAt: string;
}

// Feature 1: Memory Bank Donor Portfolio Preferences
export interface DonorPreferences {
  savedFavorites: string[]; // Nonprofit IDs
  preferredCategories: string[];
  minProgramSpendRatio: number; // e.g. 80%
  maxCeoPayThreshold: number; // e.g. $1,500,000
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
}
