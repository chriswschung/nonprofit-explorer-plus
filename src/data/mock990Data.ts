import type { NonProfitData } from '../types/nonprofit';

export const mockNonProfits: NonProfitData[] = [
  {
    id: 'wwf',
    name: 'World Wildlife Fund, Inc.',
    ein: '52-1693387',
    taxYear: '2024 / 2025',
    nteeCategory: 'Environment & Wildlife',
    subCategory: 'Conservation & Environmental Protection',
    mission: 'To conserve nature and reduce the most pressing threats to the diversity of life on Earth through global scientific field programs.',
    cityState: 'Washington, DC',
    website: 'https://www.worldwildlife.org',

    totalRevenue: 412500000,
    totalExpenses: 385200000,
    netAssets: 518400000,
    programExpenses: 332812800, // 86.4%
    adminExpenses: 28890000, // 7.5%
    fundraisingExpenses: 23497200, // 6.1%
    programExpenseRatio: 86.4,
    fundraisingEfficiency: 6.80,
    operatingReserveMonths: 16.1,

    revenueGrowthCAGR: 7.4,
    publicSupportRatio: 88.5,
    estimatedDonorsCount: 340000,
    averageDonationSize: 145,
    complianceAuditStatus: 'Independent CPA Clean Unqualified Audit',
    governanceScore: 9.1,

    executives: [
      {
        name: 'Carter Roberts',
        title: 'President & CEO',
        compensation: 1120000,
        percentOfBudget: 0.27,
        peerPercentile: 32
      },
      {
        name: 'Margaret Ackerley',
        title: 'General Counsel & SVP',
        compensation: 512000,
        percentOfBudget: 0.12,
        peerPercentile: 45
      }
    ],

    independentBoardMembers: 28,
    totalBoardMembers: 30,
    conflictOfInterestPolicy: true,
    whistleblowerPolicy: true,

    revenueSources: {
      contributionsGrants: 78.5,
      programServiceFees: 12.2,
      investmentIncome: 6.8,
      otherRevenue: 2.5
    },

    riskScore: 12,
    riskLevel: 'LOW_RISK',
    anomalies: [
      {
        severity: 'LOW',
        category: 'COMPENSATION',
        title: 'Executive Pay Within Benchmark',
        description: 'CEO salary represents 0.27% of annual operating budget, well below peer median of 0.85%.',
        form990Citation: 'Form 990 Part VII Section A'
      }
    ],

    agentDebates: [
      {
        agentName: 'Elena Rostova',
        agentRole: 'Financial Analyst Agent',
        avatarColor: '#00f0ff',
        statement: 'WWF demonstrates exceptional capital allocation with an 86.4% program spend ratio and 16.1 months of net liquid reserves ($518.4M), ensuring operational stability across global climate crises.',
        scoreGiven: 9.4,
        citations: ['Form 990 Part IX Line 25', 'Form 990 Part X Line 33']
      },
      {
        agentName: 'Marcus Vance',
        agentRole: 'Governance Ombudsman Agent',
        avatarColor: '#a855f7',
        statement: 'Board independence is top-tier: 28 of 30 directors are independent. CEO pay ($1.12M) is modest relative to $412.5M in revenue.',
        scoreGiven: 9.1,
        citations: ['Form 990 Part VI Line 1b', 'Form 990 Part VII']
      },
      {
        agentName: 'Dr. Sarah Lin',
        agentRole: 'Impact Researcher Agent',
        avatarColor: '#00ff88',
        statement: 'Quantifiable efficiency: Each $1,000 in public contributions yields 18.2 habitat acres protected under global biodiversity initiatives.',
        scoreGiven: 9.3,
        citations: ['Form 990 Part III Statement of Accomplishments']
      }
    ],

    quantifiableImpactUnit: 'Acres of Critical Habitat & Coral Reef Protected',
    impactPer1000Dollars: 18.2,

    overallScore: 9.3,
    ratings: [
      {
        dimension: 'Program Efficiency & Spending Ratio',
        score: 9.2,
        status: 'EXCELLENT',
        summary: '86.4% of total expenditure directly funds frontline field programs.',
        reasoning: [
          'Direct program expenses account for $332.8M out of $385.2M in annual costs.',
          'Fundraising costs are controlled at $6.80 per $100 raised.'
        ],
        form990Citations: ['Form 990 Part IX Line 25 Column B'],
        peerComparison: 'Outperforms conservation sector median program ratio (81.2%).'
      },
      {
        dimension: 'Governance Integrity & Executive Pay',
        score: 9.1,
        status: 'EXCELLENT',
        summary: 'Strong independent board oversight (93.3% independent directors).',
        reasoning: [
          '28 out of 30 board members are independent.',
          'CEO compensation ($1,120,000) represents 0.27% of annual budget (32nd percentile).'
        ],
        form990Citations: ['Form 990 Part VI Line 1b', 'Form 990 Part VII Section A'],
        peerComparison: 'Executive pay percentile is lower than 68% of peer $400M+ nonprofits.'
      },
      {
        dimension: 'Revenue Growth & Fiscal Sustainability',
        score: 9.0,
        status: 'EXCELLENT',
        summary: '3-Year Revenue CAGR of +7.4% with 16.1 months of reserve buffer.',
        reasoning: [
          '3-Year revenue compound growth rate stands at +7.4%.',
          'Unrestricted net asset cushion ($518.4M) covers 16.1 months of operating expenses.'
        ],
        form990Citations: ['Form 990 Part VIII Revenue Statement', 'Form 990 Part X Balance Sheet'],
        peerComparison: 'Reserve cushion is 2.5x larger than the 6-month industry benchmark.'
      },
      {
        dimension: 'Donor Base & Public Support Breadth',
        score: 9.4,
        status: 'EXCELLENT',
        summary: '88.5% public support ratio across ~340,000 contributing donors.',
        reasoning: [
          '88.5% public support ratio verified on IRS Schedule A Part II.',
          'Broad individual donor base with average annual contribution size of $145.'
        ],
        form990Citations: ['Form 990 Schedule A Part II', 'Form 990 Part VIII Line 1'],
        peerComparison: 'Top tier donor diversification prevents funding concentration risk.'
      },
      {
        dimension: 'IRS Compliance & Audit Integrity',
        score: 9.6,
        status: 'EXCELLENT',
        summary: 'Clean, unqualified independent CPA audit report under Part XII.',
        reasoning: [
          'Full independent audit conducted with clean unqualified opinion.',
          'Form 990 Part VI Line 11a board review verified.'
        ],
        form990Citations: ['Form 990 Part XII Financial Reporting', 'Form 990 Part VI Line 11a'],
        peerComparison: 'Maintains 100% compliance record across all IRS tax schedules.'
      },
      {
        dimension: 'Quantifiable Mission Impact & Scale',
        score: 9.5,
        status: 'EXCELLENT',
        summary: 'Delivers 18.2 habitat acres protected per $1,000 donated.',
        reasoning: [
          'Operational scale delivers measurable conservation output across 100+ countries.',
          'Direct alignment between Part III accomplishments and financial allocations.'
        ],
        form990Citations: ['Form 990 Part III Statement of Accomplishments'],
        peerComparison: 'Highest impact output efficiency score among environmental peer group.'
      }
    ],

    peers: [
      {
        id: 'msf',
        name: 'Doctors Without Borders USA',
        ein: '13-3507204',
        nteeCategory: 'Health & Medical Research',
        totalRevenue: 620000000,
        programExpenseRatio: 88.1,
        overallScore: 9.5,
        ceoPay: 385000
      }
    ]
  },
  {
    id: 'msf',
    name: 'Doctors Without Borders USA (MSF)',
    ein: '13-3507204',
    taxYear: '2024 / 2025',
    nteeCategory: 'Health & Medical Research',
    subCategory: 'International Medical Crisis Relief',
    mission: 'Providing independent, impartial medical humanitarian assistance to populations in crisis, war zones, and epidemic outbreaks worldwide.',
    cityState: 'New York, NY',
    website: 'https://www.doctorswithoutborders.org',

    totalRevenue: 620000000,
    totalExpenses: 580000000,
    netAssets: 490000000,
    programExpenses: 510980000, // 88.1%
    adminExpenses: 29000000, // 5.0%
    fundraisingExpenses: 40020000, // 6.9%
    programExpenseRatio: 88.1,
    fundraisingEfficiency: 6.45,
    operatingReserveMonths: 10.1,

    revenueGrowthCAGR: 8.9,
    publicSupportRatio: 94.2,
    estimatedDonorsCount: 680000,
    averageDonationSize: 110,
    complianceAuditStatus: 'Independent CPA Clean Unqualified Audit',
    governanceScore: 9.5,

    executives: [
      {
        name: 'Avril Benoît',
        title: 'Executive Director',
        compensation: 385000,
        percentOfBudget: 0.06,
        peerPercentile: 12
      }
    ],

    independentBoardMembers: 14,
    totalBoardMembers: 15,
    conflictOfInterestPolicy: true,
    whistleblowerPolicy: true,

    revenueSources: {
      contributionsGrants: 95.2,
      programServiceFees: 0.5,
      investmentIncome: 3.8,
      otherRevenue: 0.5
    },

    riskScore: 8,
    riskLevel: 'LOW_RISK',
    anomalies: [],

    agentDebates: [
      {
        agentName: 'Elena Rostova',
        agentRole: 'Financial Analyst Agent',
        avatarColor: '#00f0ff',
        statement: 'MSF USA is a gold standard for humanitarian finance: 88.1% direct program spend and an extraordinary 95.2% private donation support.',
        scoreGiven: 9.6,
        citations: ['Form 990 Part IX Line 25', 'Form 990 Part VIII Line 1']
      },
      {
        agentName: 'Marcus Vance',
        agentRole: 'Governance Ombudsman Agent',
        avatarColor: '#a855f7',
        statement: 'Executive salary ($385k) is exceptionally modest for a $620M international relief operation (12th percentile).',
        scoreGiven: 9.5,
        citations: ['Form 990 Part VII Section A']
      },
      {
        agentName: 'Dr. Sarah Lin',
        agentRole: 'Impact Researcher Agent',
        avatarColor: '#00ff88',
        statement: '12.4 emergency surgical & medical care treatments per $1,000 in direct public funding.',
        scoreGiven: 9.4,
        citations: ['Form 990 Part III Line 4a']
      }
    ],

    quantifiableImpactUnit: 'Emergency Surgical & Clinical Medical Care Days Delivered',
    impactPer1000Dollars: 12.4,

    overallScore: 9.5,
    ratings: [
      {
        dimension: 'Program Efficiency & Spending Ratio',
        score: 9.5,
        status: 'EXCELLENT',
        summary: '88.1% of budget directly delivers emergency field medical care.',
        reasoning: ['Administrative overhead capped at 5.0%.'],
        form990Citations: ['Form 990 Part IX Line 25 Column B'],
        peerComparison: 'Ranks in top 5% for health relief efficiency.'
      },
      {
        dimension: 'Governance Integrity & Executive Pay',
        score: 9.5,
        status: 'EXCELLENT',
        summary: 'Executive director salary ($385k) represents only 0.06% of total revenue.',
        reasoning: ['Modest executive pay reflects medical mission purity.'],
        form990Citations: ['Form 990 Part VII Section A'],
        peerComparison: 'Far below $600M+ nonprofit median executive pay.'
      }
    ],

    peers: [
      {
        id: 'stjude',
        name: 'St. Jude Children’s Research Hospital',
        ein: '35-1044588',
        nteeCategory: 'Health & Medical Research',
        totalRevenue: 2100000000,
        programExpenseRatio: 82.3,
        overallScore: 9.2,
        ceoPay: 1850000
      }
    ]
  },
  {
    id: 'stjude',
    name: 'St. Jude Children’s Research Hospital (ALSAC)',
    ein: '35-1044588',
    taxYear: '2024 / 2025',
    nteeCategory: 'Health & Medical Research',
    subCategory: 'Pediatric Cancer Research & Treatment',
    mission: 'Finding cures and saving children with pediatric cancer and life-threatening diseases, ensuring no family ever receives a bill for treatment or travel.',
    cityState: 'Memphis, TN',
    website: 'https://www.stjude.org',

    totalRevenue: 2100000000,
    totalExpenses: 1750000000,
    netAssets: 8200000000,
    programExpenses: 1440250000, // 82.3%
    adminExpenses: 105000000, // 6.0%
    fundraisingExpenses: 204750000, // 11.7%
    programExpenseRatio: 82.3,
    fundraisingEfficiency: 9.75,
    operatingReserveMonths: 56.2,

    revenueGrowthCAGR: 11.2,
    publicSupportRatio: 91.0,
    estimatedDonorsCount: 11000000,
    averageDonationSize: 45,
    complianceAuditStatus: 'Independent CPA Clean Unqualified Audit',
    governanceScore: 8.8,

    executives: [
      {
        name: 'Richard C. Shadyac Jr.',
        title: 'President & CEO (ALSAC)',
        compensation: 1850000,
        percentOfBudget: 0.11,
        peerPercentile: 58
      }
    ],

    independentBoardMembers: 32,
    totalBoardMembers: 35,
    conflictOfInterestPolicy: true,
    whistleblowerPolicy: true,

    revenueSources: {
      contributionsGrants: 89.4,
      programServiceFees: 3.1,
      investmentIncome: 6.8,
      otherRevenue: 0.7
    },

    riskScore: 18,
    riskLevel: 'LOW_RISK',
    anomalies: [
      {
        severity: 'LOW',
        category: 'RESERVES',
        title: 'Substantial Capital Endowment Reserve',
        description: 'Net liquid reserves ($8.2B) provide 56 months of cushion to fund research through economic downturns.',
        form990Citation: 'Form 990 Part X Line 33'
      }
    ],

    agentDebates: [
      {
        agentName: 'Elena Rostova',
        agentRole: 'Financial Analyst Agent',
        avatarColor: '#00f0ff',
        statement: 'St. Jude holds $8.2B in net assets (56 months reserves). While massive, it guarantees perpetual free pediatric cancer care without family bills.',
        scoreGiven: 9.1,
        citations: ['Form 990 Part X Line 33']
      },
      {
        agentName: 'Marcus Vance',
        agentRole: 'Governance Ombudsman Agent',
        avatarColor: '#a855f7',
        statement: 'CEO compensation ($1.85M) is higher in absolute terms but represents a low 0.11% of its massive $1.75B operating budget.',
        scoreGiven: 8.9,
        citations: ['Form 990 Part VII Section A']
      },
      {
        agentName: 'Dr. Sarah Lin',
        agentRole: 'Impact Researcher Agent',
        avatarColor: '#00ff88',
        statement: 'Unrivaled pediatric impact: Free clinical treatment and open-source genomic research shared globally.',
        scoreGiven: 9.5,
        citations: ['Form 990 Part III Line 4a']
      }
    ],

    quantifiableImpactUnit: 'Days of Free Inpatient Pediatric Cancer Care & Genomic Sequencing',
    impactPer1000Dollars: 8.5,

    overallScore: 9.2,
    ratings: [
      {
        dimension: 'Program Efficiency & Research Impact',
        score: 9.1,
        status: 'EXCELLENT',
        summary: '82.3% of budget powers free pediatric care and cancer research.',
        reasoning: ['Ensures zero cost for patient families.'],
        form990Citations: ['Form 990 Part IX Line 25 Column B'],
        peerComparison: 'Exceeds pediatric medical research peers.'
      }
    ],

    peers: [
      {
        id: 'khan',
        name: 'Khan Academy, Inc.',
        ein: '26-1544963',
        nteeCategory: 'Education & Learning Technology',
        totalRevenue: 105000000,
        programExpenseRatio: 86.0,
        overallScore: 9.2,
        ceoPay: 820000
      }
    ]
  },
  {
    id: 'khan',
    name: 'Khan Academy, Inc.',
    ein: '26-1544963',
    taxYear: '2024 / 2025',
    nteeCategory: 'Education & Learning Technology',
    subCategory: 'Free EdTech & AI Personalized Tutoring',
    mission: 'A 501(c)(3) nonprofit with the mission to provide a free, world-class education for anyone, anywhere.',
    cityState: 'Mountain View, CA',
    website: 'https://www.khanacademy.org',

    totalRevenue: 105000000,
    totalExpenses: 98000000,
    netAssets: 142000000,
    programExpenses: 84280000, // 86.0%
    adminExpenses: 7840000, // 8.0%
    fundraisingExpenses: 5880000, // 6.0%
    programExpenseRatio: 86.0,
    fundraisingEfficiency: 5.60,
    operatingReserveMonths: 17.3,

    revenueGrowthCAGR: 12.8,
    publicSupportRatio: 92.4,
    estimatedDonorsCount: 450000,
    averageDonationSize: 85,
    complianceAuditStatus: 'Independent CPA Clean Unqualified Audit',
    governanceScore: 9.0,

    executives: [
      {
        name: 'Salman Khan',
        title: 'Founder & CEO',
        compensation: 820000,
        percentOfBudget: 0.83,
        peerPercentile: 52
      }
    ],

    independentBoardMembers: 11,
    totalBoardMembers: 12,
    conflictOfInterestPolicy: true,
    whistleblowerPolicy: true,

    revenueSources: {
      contributionsGrants: 88.2,
      programServiceFees: 8.5,
      investmentIncome: 2.8,
      otherRevenue: 0.5
    },

    riskScore: 10,
    riskLevel: 'LOW_RISK',
    anomalies: [],

    agentDebates: [
      {
        agentName: 'Elena Rostova',
        agentRole: 'Financial Analyst Agent',
        avatarColor: '#00f0ff',
        statement: 'Khan Academy scales software efficiency: 86.0% program spend with $142M in net assets providing 17.3 months of runway.',
        scoreGiven: 9.3,
        citations: ['Form 990 Part IX Line 25']
      },
      {
        agentName: 'Marcus Vance',
        agentRole: 'Governance Ombudsman Agent',
        avatarColor: '#a855f7',
        statement: 'Sal Khan’s salary ($820k) represents 0.83% of budget, reflecting Silicon Valley engineering competitive rates.',
        scoreGiven: 8.9,
        citations: ['Form 990 Part VII Section A']
      },
      {
        agentName: 'Dr. Sarah Lin',
        agentRole: 'Impact Researcher Agent',
        avatarColor: '#00ff88',
        statement: 'High software leverage: 86.0% program efficiency serves 150M+ students at less than $0.60 per learner per year.',
        scoreGiven: 9.3,
        citations: ['Form 990 Part IX Line 25 Column B']
      }
    ],

    quantifiableImpactUnit: 'Students Supported with Free 1-Year AI Personalized Learning',
    impactPer1000Dollars: 1650.0,

    overallScore: 9.2,
    ratings: [
      {
        dimension: 'Program Efficiency & Technology Impact',
        score: 9.3,
        status: 'EXCELLENT',
        summary: '86.0% of budget directly powers free learning software for 150M+ students globally.',
        reasoning: ['Serves over 150 million registered learners at an operating cost of <$0.60 per student per year.'],
        form990Citations: ['Form 990 Part IX Line 25 Column B'],
        peerComparison: 'Exceeds EdTech nonprofit median program ratio (78.4%).'
      }
    ],

    peers: [
      {
        id: 'wwf',
        name: 'World Wildlife Fund',
        ein: '52-1693387',
        nteeCategory: 'Environment & Wildlife',
        totalRevenue: 412500000,
        programExpenseRatio: 86.4,
        overallScore: 9.3,
        ceoPay: 1120000
      }
    ]
  }
];

import { nonprofits300Data } from './generate300NonProfits';

// Deduplicate or append generated dataset to give 300+ nonprofits
export const allNonProfits: NonProfitData[] = [
  ...mockNonProfits,
  ...nonprofits300Data.filter(p => !mockNonProfits.some(m => m.name.toLowerCase() === p.name.toLowerCase()))
];

export { mockNonProfits as featuredNonProfits };
