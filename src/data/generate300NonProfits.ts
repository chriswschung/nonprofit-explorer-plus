import type { NonProfitData, PeerNonProfit } from '../types/nonprofit';

const sectorTemplates = [
  {
    nteeCategory: 'Environment & Wildlife',
    subCategories: ['Conservation & Land Protection', 'Wildlife Protection', 'Climate Action & Energy', 'Ocean Conservation'],
    unit: 'Acres of Wildlife Habitat & Coral Reefs Protected',
    unitMultiplier: 22,
    baseNames: [
      'World Wildlife Fund', 'The Nature Conservancy', 'Sierra Club Foundation', 'Audubon Society', 'Ocean Conservancy',
      'Environmental Defense Fund', 'Natural Resources Defense Council', 'Greenpeace Fund', 'Rainforest Alliance', 'Trust for Public Land',
      'African Wildlife Foundation', 'Sea Shepherd Conservation', 'Jane Goodall Institute', 'WildAid Foundation', 'Conservation International',
      'Defenders of Wildlife', 'Surfrider Foundation', 'National Wildlife Federation', 'Earthjustice', 'Friends of the Earth',
      'Rocky Mountain Institute', 'World Resources Institute', 'Chesapeake Bay Foundation', 'Ecosystem Protection Trust', 'Global Green Alliance',
      'Clean Air Task Force', 'Waterkeeper Alliance', 'Parley for the Oceans', 'Marine Conservation Institute', 'Amazon Watch'
    ]
  },
  {
    nteeCategory: 'Health & Medical Research',
    subCategories: ['Pediatric Cancer Research', 'Disaster & Medical Relief', 'Heart & Lung Health', 'Mental Health Services', 'Alzheimer Research'],
    unit: 'Emergency Medical Treatments & Clinical Research Days',
    unitMultiplier: 15,
    baseNames: [
      'Doctors Without Borders', 'American Red Cross', 'St. Jude Children’s Research Hospital', 'American Heart Association', 'American Cancer Society',
      'Alzheimer’s Association', 'Leukemia & Lymphoma Society', 'Operation Smile', 'Direct Relief International', 'Project HOPE',
      'Partners In Health', 'Cystic Fibrosis Foundation', 'Juvenile Diabetes Research Foundation', 'National Alliance on Mental Illness', 'Mayo Clinic Philanthropy',
      'Cleveland Clinic Foundation', 'March of Dimes', 'ALS Association', 'Prevent Cancer Foundation', 'Parkinson’s Foundation',
      'Fred Hutchinson Cancer Center', 'Dana-Farber Cancer Institute', 'Sloan Kettering Research Fund', 'Shriners Hospitals Philanthropy', 'Mercy Ships',
      'International Medical Corps', 'Heart to Heart International', 'Aids Healthcare Foundation', 'Brain & Behavior Research Foundation', 'Global Health Council',
      'End Sickle Cell Foundation', 'National Multiple Sclerosis Society', 'Hearing Health Foundation', 'Kidney Fund America', 'Lupus Research Alliance'
    ]
  },
  {
    nteeCategory: 'Education & Learning Technology',
    subCategories: ['Free STEM & AI Learning', 'Higher Education Endowments', 'Scholarship Funds', 'Early Childhood Literacy', 'Vocational Training'],
    unit: 'Students Provided Free 1-Year STEM Learning & Tutoring',
    unitMultiplier: 120,
    baseNames: [
      'Khan Academy', 'Code.org', 'Wikimedia Foundation', 'Teach For America', 'United Negro College Fund',
      'Scholarship America', 'Reading Is Fundamental', 'DonorsChoose', 'First Robotics Foundation', 'New Teacher Center',
      'Gates Millennium Scholars Trust', 'Girls Who Code', 'EdX Open Education', 'Pencil of Promise', 'Room to Read',
      'Pratham Education Foundation', 'College Possible', 'KIPP Educational Network', 'Overcoming Obstacles', 'National Merit Scholarship Corp',
      'AVID Center', 'Junior Achievement USA', 'Jumpstart for Children', 'Early Literacy Trust', 'Reading Partners',
      'Great Minds Foundation', 'Code2040 Institute', 'Code With Klossie Foundation', 'Computer Science Teachers Association', 'EdTech Access Fund',
      'Global Education Initiative', 'Digital Inclusion Fund', 'Open Stax Educational', 'STEM Learning Alliance', 'University Futures Fund'
    ]
  },
  {
    nteeCategory: 'Human Services & Food Banks',
    subCategories: ['Food Insecurity & Hunger Relief', 'Housing & Homelessness', 'Veteran Support', 'Family Disaster Relief'],
    unit: 'Nutritious Meals & Family Shelter Nights Provided',
    unitMultiplier: 450,
    baseNames: [
      'Feeding America', 'Habitat for Humanity', 'Meals on Wheels America', 'Volunteers of America', 'The Salvation Army',
      'Goodwill Industries International', 'Catholic Charities USA', 'City Harvest', 'Covenant House', 'Wounded Warrior Project',
      'Semper Fi & America’s Fund', 'Homes For Our Troops', 'Fisher House Foundation', 'Coalition for the Homeless', 'National Diaper Bank Network',
      'No Kid Hungry (Share Our Strength)', 'God’s Love We Deliver', 'Red Cross Disaster Housing', 'Brotherhood Sister Sol', 'St. Vincent de Paul Society',
      'National Fallen Firefighters Foundation', 'Gary Sinise Foundation', 'Tunnels to Towers Foundation', 'Midwest Food Bank', 'Food Bank For New York City',
      'Central Texas Food Bank', 'Greater Chicago Food Depository', 'Second Harvest Food Bank', 'Atlanta Community Food Bank', 'Capital Area Food Bank',
      'Oregon Food Bank', 'St. Mary’s Food Bank', 'Community FoodBank of NJ', 'Placer Food Bank', 'North Texas Food Bank'
    ]
  },
  {
    nteeCategory: 'International Relief & Humanitarian',
    subCategories: ['Refugee & Crisis Aid', 'Clean Water Infrastructure', 'Global Poverty Alleviation', 'Disaster Emergency Response'],
    unit: 'Clean Water Installations & Refugee Emergency Kits',
    unitMultiplier: 38,
    baseNames: [
      'CARE USA', 'Save the Children', 'World Vision', 'IRC (International Rescue Committee)', 'Mercy Corps',
      'Water.org', 'Charity: Water', 'Heifer International', 'OXFAM America', 'Catholic Relief Services',
      'BRAC USA', 'TechnoServe', 'Trickle Up', 'Action Against Hunger', 'Relief International',
      'USA for UNHCR', 'Amnesty International USA', 'Human Rights Watch', 'Islamic Relief USA', 'Lutheran World Relief',
      'GlobalGiving Foundation', 'Operation USA', 'ChildFund International', 'Compassion International', 'Food for the Poor',
      'Seva Foundation', 'SightSavers International', 'Helen Keller International', 'FINCA International', 'Opportunity International',
      'International Justice Mission', 'Rise Against Hunger', 'Convoy of Hope', 'MAP International', 'World Emergency Relief'
    ]
  },
  {
    nteeCategory: 'Arts, Culture & Humanities',
    subCategories: ['Museums & Science Centers', 'Public Broadcasting & Media', 'Performing Arts Center', 'Historical Preservation'],
    unit: 'Public Cultural Access Passes & Student Museum Visits',
    unitMultiplier: 65,
    baseNames: [
      'Smithsonian Institution', 'Metropolitan Museum of Art', 'NPR (National Public Radio)', 'PBS Foundation', 'Kennedy Center for Performing Arts',
      'Lincoln Center', 'Art Institute of Chicago', 'Museum of Modern Art (MoMA)', 'Getty Trust', 'Boston Symphony Orchestra',
      'New York Philharmonic', 'Guggenheim Museum', 'National Geographic Society', 'Field Museum of Natural History', 'California Science Center',
      'National Trust for Historic Preservation', 'Alvin Ailey Dance Foundation', 'San Francisco Opera', 'Los Angeles County Museum of Art', 'High Museum of Art',
      'Shedd Aquarium Foundation', 'Monterey Bay Aquarium Trust', 'Denver Art Museum', 'Philadelphia Museum of Art', 'Seattle Art Museum Trust'
    ]
  },
  {
    nteeCategory: 'Civil Rights & Social Justice',
    subCategories: ['Legal Aid & Defense', 'Voting Rights Protection', 'Gender & LGBTQ+ Equality', 'Disability Rights Advocacy'],
    unit: 'Pro-Bono Legal Defense Cases & Civil Rights Advocacy Hours',
    unitMultiplier: 12,
    baseNames: [
      'ACLU Foundation', 'Southern Poverty Law Center', 'NAACP Legal Defense Fund', 'Equal Justice Initiative', 'Innocence Project',
      'Lambda Legal', 'Trevor Project', 'Human Rights Campaign Foundation', 'League of Women Voters Education Fund', 'Brennan Center for Justice',
      'Center for Reproductive Rights', 'National Urban League', 'MALDEF (Mexican American Legal Defense)', 'Native American Rights Fund', 'Disability Rights Education Fund',
      'Advancement Project', 'Lawyers’ Committee for Civil Rights', 'Southern Center for Human Rights', 'Vera Institute of Justice', 'Center for Constitutional Rights',
      'Freedom House', 'Common Cause Education Fund', 'Public Citizen Foundation', 'Electronic Frontier Foundation', 'Pen America Trust'
    ]
  },
  {
    nteeCategory: 'Youth & Child Development',
    subCategories: ['Boys & Girls Clubs', 'Mentorship & Big Brothers Big Sisters', 'Foster Youth Support', 'Youth Camping & Leadership'],
    unit: 'Youth Mentorship Hours & After-School Program Weeks',
    unitMultiplier: 85,
    baseNames: [
      'Boys & Girls Clubs of America', 'Big Brothers Big Sisters of America', 'YMCA of the USA', 'YWCA USA', 'Girl Scouts of the USA',
      'Boy Scouts of America (Scouting America)', 'Camp Fire National', 'National 4-H Council', 'Youth Build USA', 'Starlight Children’s Foundation',
      'Make-A-Wish Foundation of America', 'Children’s Miracle Network Hospitals', 'Court Appointed Special Advocates (CASA)', 'Foster Care Counts', 'Alex’s Lemonade Stand',
      'Children’s Defense Fund', 'Save the Children Action Network', 'KaBOOM! Playground Foundation', 'Playworks Education Energy', 'Active Minds Youth'
    ]
  },
  {
    nteeCategory: 'Animal Welfare & Shelters',
    subCategories: ['No-Kill Animal Shelters', 'Spay/Neuter Infrastructure', 'Service Dog Training', 'Marine Mammal Rescue'],
    unit: 'Rescued Animals Sheltered, Vaccinated & Adopted',
    unitMultiplier: 28,
    baseNames: [
      'ASPCA (American Society for Prevention of Cruelty to Animals)', 'Humane Society of the United States', 'Best Friends Animal Society', 'PetSmart Charities', 'Petco Love',
      'North Shore Animal League America', 'Mutts With A Mission', 'Canine Companions for Independence', 'Guide Dogs for the Blind', 'The Marine Mammal Center',
      'Bat World Sanctuary', 'Animal Legal Defense Fund', 'Wild Animal Sanctuary', 'Big Cat Rescue Foundation', 'Redrover Emergency Pet Relief',
      'Alley Cat Allies', 'Farm Sanctuary', 'Paws With A Cause', 'K9s For Warriors', 'Puppies Behind Bars',
      'International Fund for Animal Welfare (IFAW)', 'American Humane Association', 'Bissell Pet Foundation', 'Grey2K USA Worldwide', 'Hope for Paws'
    ]
  },
  {
    nteeCategory: 'Science & Technology Research',
    subCategories: ['Space & Astronomy Research', 'Clean Energy R&D', 'Oceanographic Research', 'Biomedical Innovation'],
    unit: 'Open-Source Scientific Datasets & Research Lab Hours',
    unitMultiplier: 14,
    baseNames: [
      'Planetary Society', 'Woods Hole Oceanographic Institution', 'Scripps Institution of Oceanography Trust', 'Santa Fe Institute', 'Howard Hughes Medical Institute',
      'Jackson Laboratory', 'Cold Spring Harbor Laboratory', 'Allen Institute for Brain Science', 'Broad Institute Philanthropy', 'Salk Institute for Biological Studies',
      'SRI International Foundation', 'Battelle Memorial Institute', 'Carnegie Institution for Science', 'SETI Institute', 'National Academy of Sciences',
      'American Association for Advancement of Science', 'Bulletin of the Atomic Scientists', 'XPRIZE Foundation', 'Breakthrough Initiatives Trust', 'Global Change Research'
    ]
  }
];

export function generate300NonProfits(): NonProfitData[] {
  const dataset: NonProfitData[] = [];
  let idCounter = 1;

  sectorTemplates.forEach((sector) => {
    sector.baseNames.forEach((name) => {
      const id = `np-${idCounter++}`;
      const einPrefix = Math.floor(10 + Math.random() * 88);
      const einSuffix = Math.floor(1000000 + Math.random() * 8999999);
      const ein = `${einPrefix}-${einSuffix}`;

      // Revenue range: $15M to $2.8B
      const isMega = Math.random() > 0.85;
      const totalRevenue = isMega
        ? Math.floor(800000000 + Math.random() * 2000000000)
        : Math.floor(25000000 + Math.random() * 450000000);

      // Program ratio: 76% to 92%
      const programExpenseRatio = Math.round((76 + Math.random() * 16) * 10) / 10;
      const adminRatio = Math.round(((100 - programExpenseRatio) * 0.45) * 10) / 10;
      const fundraisingRatio = Math.round((100 - programExpenseRatio - adminRatio) * 10) / 10;

      const programExpenses = Math.floor(totalRevenue * (programExpenseRatio / 100));
      const adminExpenses = Math.floor(totalRevenue * (adminRatio / 100));
      const fundraisingExpenses = Math.floor(totalRevenue * (fundraisingRatio / 100));
      const totalExpenses = programExpenses + adminExpenses + fundraisingExpenses;

      const netAssets = Math.floor(totalRevenue * (1.2 + Math.random() * 2.8));
      const operatingReserveMonths = Math.round(((netAssets / totalExpenses) * 12) * 10) / 10;
      const fundraisingEfficiency = Math.round((4.5 + Math.random() * 11.5) * 100) / 100;

      // CEO Compensation ($280k to $1.85M)
      const ceoCompensation = Math.floor(280000 + (totalRevenue / 1000000) * 1200 + Math.random() * 250000);
      const percentOfBudget = Math.round(((ceoCompensation / totalExpenses) * 100) * 100) / 100;
      const peerPercentile = Math.floor(20 + Math.random() * 65);

      // Governance Score (X-axis) between 6.5 and 9.8
      const governanceScore = Math.round((6.8 + Math.random() * 2.9) * 10) / 10;

      // Score 0 - 10
      const overallScore = Math.round(((programExpenseRatio / 10) * 0.5 + governanceScore * 0.5) * 10) / 10;

      // Growth CAGR & Donors
      const revenueGrowthCAGR = Math.round((-2.0 + Math.random() * 14.5) * 10) / 10; // -2.0% to +12.5%
      const publicSupportRatio = Math.round((75 + Math.random() * 22) * 10) / 10; // 75% to 97%
      const estimatedDonorsCount = Math.floor(12000 + (totalRevenue / 10000) * (0.8 + Math.random() * 1.5));
      const averageDonationSize = Math.floor(65 + Math.random() * 280);
      const complianceAuditStatus = 'Independent CPA Clean Unqualified Audit (Form 990 Part XII)';

      // Risk score (8 to 35)
      const riskScore = Math.floor(8 + Math.random() * 27);
      const riskLevel: 'LOW_RISK' | 'MODERATE_RISK' | 'ELEVATED_RISK' =
        riskScore < 25 ? 'LOW_RISK' : 'MODERATE_RISK';

      const subCategory = sector.subCategories[Math.floor(Math.random() * sector.subCategories.length)];

      const item: NonProfitData = {
        id,
        name,
        ein,
        taxYear: '2024 / 2025',
        nteeCategory: sector.nteeCategory,
        subCategory,
        mission: `Dedicated to advancing ${sector.nteeCategory.toLowerCase()} through high-impact, transparent programs, rigorous governance, and sustainable community empowerment.`,
        cityState: getRandomCityState(),
        website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,

        totalRevenue,
        totalExpenses,
        netAssets,
        programExpenses,
        adminExpenses,
        fundraisingExpenses,
        programExpenseRatio,
        fundraisingEfficiency,
        operatingReserveMonths,

        revenueGrowthCAGR,
        publicSupportRatio,
        estimatedDonorsCount,
        averageDonationSize,
        complianceAuditStatus,
        governanceScore,

        executives: [
          {
            name: getRandomExecutiveName(),
            title: 'President & CEO',
            compensation: ceoCompensation,
            percentOfBudget,
            peerPercentile
          }
        ],

        independentBoardMembers: Math.floor(12 + Math.random() * 18),
        totalBoardMembers: Math.floor(15 + Math.random() * 20),
        conflictOfInterestPolicy: true,
        whistleblowerPolicy: true,

        revenueSources: {
          contributionsGrants: Math.round((70 + Math.random() * 22) * 10) / 10,
          programServiceFees: Math.round((5 + Math.random() * 18) * 10) / 10,
          investmentIncome: Math.round((2 + Math.random() * 8) * 10) / 10,
          otherRevenue: 1.5
        },

        riskScore,
        riskLevel,
        anomalies: [
          {
            severity: 'LOW',
            category: 'GOVERNANCE',
            title: 'Board Independence & Review',
            description: `Over 90% of board directors maintain independent voting status with annual conflict disclosures.`,
            form990Citation: 'Form 990 Part VI Line 1b'
          }
        ],

        agentDebates: [
          {
            agentName: 'Elena Rostova',
            agentRole: 'Financial Analyst Agent',
            avatarColor: '#00f0ff',
            statement: `${name} maintains ${operatingReserveMonths} months of liquid operating reserves ($${(netAssets / 1000000).toFixed(1)}M), providing robust fiscal stability.`,
            scoreGiven: Math.min(10, Math.round((overallScore + 0.2) * 10) / 10),
            citations: ['Form 990 Part X Balance Sheet']
          },
          {
            agentName: 'Marcus Vance',
            agentRole: 'Governance Ombudsman Agent',
            avatarColor: '#a855f7',
            statement: `CEO compensation ($${(ceoCompensation / 1000).toFixed(0)}k) represents ${percentOfBudget}% of total budget, positioning executive pay within the ${peerPercentile}th percentile of peer non-profits.`,
            scoreGiven: Math.min(10, Math.round((overallScore - 0.1) * 10) / 10),
            citations: ['Form 990 Part VII Section A']
          },
          {
            agentName: 'Dr. Sarah Lin',
            agentRole: 'Impact Researcher Agent',
            avatarColor: '#00ff88',
            statement: `A ${programExpenseRatio}% program efficiency ratio guarantees $${(programExpenseRatio / 100).toFixed(2)} of every dollar directly funds mission programs.`,
            scoreGiven: overallScore,
            citations: ['Form 990 Part IX Line 25 Column B']
          }
        ],

        quantifiableImpactUnit: sector.unit,
        impactPer1000Dollars: Math.round((sector.unitMultiplier * (programExpenseRatio / 85)) * 10) / 10,

        overallScore,
        ratings: [
          {
            dimension: 'Program Efficiency & Spending Ratio',
            score: Math.min(10, Math.round((programExpenseRatio / 10) * 10) / 10),
            status: programExpenseRatio >= 85 ? 'EXCELLENT' : 'GOOD',
            summary: `${programExpenseRatio}% of total annual budget directly funds frontline programs.`,
            reasoning: [
              `Direct program spend ratio of ${programExpenseRatio}% outperforms sector benchmarks.`,
              `Administrative & overhead expense constrained at ${(adminExpenses / totalExpenses * 100).toFixed(1)}%.`
            ],
            form990Citations: ['Form 990 Part IX Line 25 Column B'],
            peerComparison: `Exceeds ${sector.nteeCategory} sector median program spend.`
          },
          {
            dimension: 'Governance Integrity & Executive Pay',
            score: governanceScore,
            status: governanceScore >= 8.5 ? 'EXCELLENT' : 'GOOD',
            summary: `Independent board oversight with CEO pay at ${percentOfBudget}% of budget.`,
            reasoning: [
              `CEO salary ($${(ceoCompensation / 1000).toFixed(0)}k) lies at the ${peerPercentile}th percentile for sector size.`,
              `Whistleblower, conflict of interest, and document retention policies fully enforced.`
            ],
            form990Citations: ['Form 990 Part VII Section A', 'Form 990 Part VI Lines 11-14'],
            peerComparison: `Independent board ratio aligns with best practice governance standards.`
          },
          {
            dimension: 'Revenue Growth & Fiscal Sustainability',
            score: Math.min(10, Math.max(5.0, Math.round((7.5 + revenueGrowthCAGR * 0.25) * 10) / 10)),
            status: revenueGrowthCAGR >= 5.0 ? 'EXCELLENT' : 'GOOD',
            summary: `3-Year Revenue CAGR of ${revenueGrowthCAGR > 0 ? '+' : ''}${revenueGrowthCAGR}% with ${operatingReserveMonths} months reserve buffer.`,
            reasoning: [
              `3-Year Revenue Compound Growth Rate sits at ${revenueGrowthCAGR > 0 ? '+' : ''}${revenueGrowthCAGR}%.`,
              `Unrestricted net asset reserves ($${(netAssets / 1000000).toFixed(1)}M) provide a ${operatingReserveMonths}-month cushion against economic shocks.`
            ],
            form990Citations: ['Form 990 Part VIII Revenue Statement', 'Form 990 Part X Balance Sheet'],
            peerComparison: `Reserve cushion exceeds Charity Navigator 6-month safety recommendation.`
          },
          {
            dimension: 'Donor Base & Public Support Breadth',
            score: Math.min(10, Math.round((publicSupportRatio / 10) * 10) / 10),
            status: publicSupportRatio >= 80 ? 'EXCELLENT' : 'GOOD',
            summary: `${publicSupportRatio}% public support test ratio with ~${estimatedDonorsCount.toLocaleString()} contributing donors.`,
            reasoning: [
              `Public support ratio of ${publicSupportRatio}% verified under IRS Schedule A Part II/III.`,
              `Broad individual donor base with average annual contribution size of ~$${averageDonationSize}.`
            ],
            form990Citations: ['Form 990 Schedule A (Public Support Test)', 'Form 990 Part VIII Line 1'],
            peerComparison: `Highly diversified donor base minimizes dependence on any single grantor.`
          },
          {
            dimension: 'IRS Compliance & Audit Integrity',
            score: 9.5,
            status: 'EXCELLENT',
            summary: complianceAuditStatus,
            reasoning: [
              `Clean, unqualified independent CPA audit report filed under Form 990 Part XII.`,
              `Form 990 review provided to full board prior to IRS filing (Part VI Line 11a).`
            ],
            form990Citations: ['Form 990 Part XII Financial Reporting', 'Form 990 Part VI Line 11a'],
            peerComparison: `Meets highest standard for federal non-profit disclosure compliance.`
          },
          {
            dimension: 'Quantifiable Mission Impact & Scale',
            score: Math.min(10, Math.round((8.0 + (programExpenseRatio - 80) * 0.1) * 10) / 10),
            status: 'EXCELLENT',
            summary: `Delivers ${Math.round(sector.unitMultiplier * (programExpenseRatio / 85) * 10) / 10} ${sector.unit.toLowerCase()} per $1,000 donated.`,
            reasoning: [
              `Operational efficiency transforms every $1,000 in funding into quantifiable frontline outcomes.`,
              `Transparent impact measurement tied directly to Part III Statement of Program Accomplishments.`
            ],
            form990Citations: ['Form 990 Part III Statement of Program Service Accomplishments'],
            peerComparison: `Top decile cost-per-outcome efficiency rating in ${sector.nteeCategory}.`
          }
        ],

        peers: []
      };

      dataset.push(item);
    });
  });

  // Populate peers within same sector
  dataset.forEach((item) => {
    const sameSector = dataset.filter((d) => d.nteeCategory === item.nteeCategory && d.id !== item.id);
    const selectedPeers: PeerNonProfit[] = sameSector.slice(0, 3).map((p) => ({
      id: p.id,
      name: p.name,
      ein: p.ein,
      nteeCategory: p.nteeCategory,
      totalRevenue: p.totalRevenue,
      programExpenseRatio: p.programExpenseRatio,
      overallScore: p.overallScore,
      ceoPay: p.executives[0]?.compensation || 500000
    }));
    item.peers = selectedPeers;
  });

  return dataset;
}

function getRandomCityState(): string {
  const cities = [
    'Washington, DC', 'New York, NY', 'Chicago, IL', 'Boston, MA', 'San Francisco, CA',
    'Atlanta, GA', 'Seattle, WA', 'Denver, CO', 'Austin, TX', 'Philadelphia, PA',
    'Los Angeles, CA', 'San Diego, CA', 'Minneapolis, MN', 'Portland, OR', 'Baltimore, MD'
  ];
  return cities[Math.floor(Math.random() * cities.length)];
}

function getRandomExecutiveName(): string {
  const firsts = ['David', 'Sarah', 'Michael', 'Jennifer', 'Robert', 'Elizabeth', 'James', 'Patricia', 'John', 'Linda', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Jessica'];
  const lasts = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  return `${firsts[Math.floor(Math.random() * firsts.length)]} ${lasts[Math.floor(Math.random() * lasts.length)]}`;
}

export const nonprofits300Data: NonProfitData[] = generate300NonProfits();
