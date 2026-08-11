import React, { useState } from 'react';
import type { NonProfitData } from '../types/nonprofit';
import { Sliders, Bot, Award, Scale, RefreshCw } from 'lucide-react';

interface ScorecardArchitectProps {
  nonprofit: NonProfitData;
  allNonProfits: NonProfitData[];
  onSelectNonProfit: (id: string) => void;
}

interface DimensionWeight {
  key: string;
  name: string;
  form990Source: string;
  defaultWeight: number;
  description: string;
  extractScore: (np: NonProfitData) => number;
}

export const ScorecardArchitect: React.FC<ScorecardArchitectProps> = ({
  nonprofit,
  allNonProfits,
  onSelectNonProfit
}) => {
  // 6 Core Form 990 Scorecard Dimensions
  const dimensionDefinitions: DimensionWeight[] = [
    {
      key: 'program',
      name: 'Program Efficiency Ratio',
      form990Source: 'Part IX Line 25 Col B',
      defaultWeight: 25,
      description: 'Percentage of total functional expenses allocated directly to mission activities vs admin/fundraising.',
      extractScore: (np) => {
        const rating = np.ratings.find((r) => r.dimension.includes('Program'));
        return rating ? rating.score : Math.min(10, (np.programExpenseRatio / 10));
      }
    },
    {
      key: 'governance',
      name: 'Governance & Executive Pay',
      form990Source: 'Part VI & Part VII Col D',
      defaultWeight: 20,
      description: 'Independent board majority %, CEO compensation percentile, conflict of interest and whistleblower policies.',
      extractScore: (np) => {
        const rating = np.ratings.find((r) => r.dimension.includes('Governance'));
        return rating ? rating.score : (np.governanceScore || 8.5);
      }
    },
    {
      key: 'growth',
      name: 'Revenue Growth & Reserves',
      form990Source: 'Part VIII Revenue & Part X Cushion',
      defaultWeight: 15,
      description: '3-Year Compound Revenue Growth Rate (CAGR %) and months of liquid operating reserve cushion.',
      extractScore: (np) => {
        const rating = np.ratings.find((r) => r.dimension.includes('Growth') || r.dimension.includes('Fiscal'));
        return rating ? rating.score : Math.min(10, Math.max(5, 7 + (np.revenueGrowthCAGR || 0) * 0.2));
      }
    },
    {
      key: 'publicSupport',
      name: 'Public Support Breadth',
      form990Source: 'Schedule A Part II/III',
      defaultWeight: 15,
      description: 'Public support ratio percentage, total estimated donor count, and reliance on broad public contributions.',
      extractScore: (np) => {
        const rating = np.ratings.find((r) => r.dimension.includes('Donor') || r.dimension.includes('Public'));
        return rating ? rating.score : Math.min(10, (np.publicSupportRatio || 85) / 10);
      }
    },
    {
      key: 'compliance',
      name: 'Audit Integrity & Compliance',
      form990Source: 'Part XII Line 2 / Sch O',
      defaultWeight: 15,
      description: 'Clean independent CPA audit opinion, GAAP compliance, and timely IRS tax filing disclosures.',
      extractScore: (np) => {
        const rating = np.ratings.find((r) => r.dimension.includes('Compliance') || r.dimension.includes('Audit'));
        return rating ? rating.score : 9.0;
      }
    },
    {
      key: 'impact',
      name: 'Quantifiable Mission Impact',
      form990Source: 'Part III Line 4 Program Statement',
      defaultWeight: 10,
      description: 'Verified unit cost per outcome metric and reported beneficiaries served per $1,000 contributed.',
      extractScore: (np) => {
        const rating = np.ratings.find((r) => r.dimension.includes('Impact') || r.dimension.includes('Mission'));
        return rating ? rating.score : 8.8;
      }
    }
  ];

  // User Weight State
  const [weights, setWeights] = useState<Record<string, number>>({
    program: 25,
    governance: 20,
    growth: 15,
    publicSupport: 15,
    compliance: 15,
    impact: 10
  });

  const totalWeightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  // Compute Custom Weighted Score for any nonprofit
  const computeCustomScore = (np: NonProfitData) => {
    if (totalWeightSum === 0) return np.overallScore;
    let weightedSum = 0;
    dimensionDefinitions.forEach((dim) => {
      const dimScore = dim.extractScore(np);
      const w = weights[dim.key] || 0;
      weightedSum += dimScore * w;
    });
    return Math.round((weightedSum / totalWeightSum) * 10) / 10;
  };

  const customScoreCurrent = computeCustomScore(nonprofit);

  // Reset Weights to IRS Default Benchmark
  const handleResetWeights = () => {
    setWeights({
      program: 25,
      governance: 20,
      growth: 15,
      publicSupport: 15,
      compliance: 15,
      impact: 10
    });
  };

  // Top Sector Nonprofits re-ranked under custom weights
  const sectorPeers = allNonProfits
    .filter((np) => np.nteeCategory === nonprofit.nteeCategory)
    .map((np) => ({
      ...np,
      customScore: computeCustomScore(np)
    }))
    .sort((a, b) => b.customScore - a.customScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Header Card */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={20} color="var(--accent-blue)" />
            Scorecard Architect Agent
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
            Learn how IRS Form 990 line items are converted into ratings, and customize sliding scales to match your personal donor values.
          </p>
        </div>

        <button
          onClick={handleResetWeights}
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-blue)',
            padding: '0.4rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RefreshCw size={13} /> Reset to IRS Default Benchmark
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
        {/* 2. Left Column: Interactive Sliding Scale Sliders */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={16} color="var(--accent-blue)" /> Customize Your Donor Weights
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                color: totalWeightSum === 100 ? 'var(--accent-emerald)' : '#f59e0b',
                fontWeight: 700,
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              Total Weight: {totalWeightSum}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dimensionDefinitions.map((dim) => {
              const currentW = weights[dim.key] || 0;
              const dimScore = dim.extractScore(nonprofit);

              return (
                <div
                  key={dim.key}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>
                      {dim.name}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', fontWeight: 800 }}>
                      {currentW}% <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Score: {dimScore}/10)</span>
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={currentW}
                    onChange={(e) => setWeights({ ...weights, [dim.key]: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      accentColor: 'var(--accent-blue)',
                      cursor: 'pointer'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>IRS Source: {dim.form990Source}</span>
                    <span>Default: {dim.defaultWeight}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Right Column: Agent Explanation & Impact Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Agent Analysis Box */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={18} color="var(--accent-blue)" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                  Architect Agent Impact Synthesis
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Active Non-Profit: <strong style={{ color: '#fff' }}>{nonprofit.name}</strong>
                </span>
              </div>
            </div>

            {/* Score Comparison Badge */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                background: 'rgba(11, 15, 25, 0.9)',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>IRS DEFAULT BENCHMARK</span>
                <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 800 }}>{nonprofit.overallScore}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>/ 10</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', display: 'block', fontWeight: 700 }}>YOUR CUSTOMIZED SCORE</span>
                <span style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>{customScoreCurrent}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'block', fontWeight: 700 }}>
                  {customScoreCurrent > nonprofit.overallScore ? `+${(customScoreCurrent - nonprofit.overallScore).toFixed(1)} Boost` : `${(customScoreCurrent - nonprofit.overallScore).toFixed(1)} Shift`}
                </span>
              </div>
            </div>

            {/* Agent Narrative Response */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-blue)', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                💡 Agent Insight:
              </span>
              Under your customized weighting strategy, {nonprofit.name}'s overall evaluation shifted to <strong>{customScoreCurrent} / 10</strong>.
              {weights.program > 30 && ` You placed a heavy emphasis on Program Efficiency (${weights.program}%), where ${nonprofit.name} excels with a ${nonprofit.programExpenseRatio}% direct spend ratio.`}
              {weights.governance > 25 && ` Your high priority on Governance Integrity (${weights.governance}%) rewards their independent board oversight.`}
              {weights.growth > 20 && ` Your focus on Financial Sustainability (${weights.growth}%) evaluates their ${nonprofit.operatingReserveMonths} months of liquid reserves.`}
            </div>
          </div>

          {/* Sector Leaderboard Shifts Table */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.92rem', color: '#fff', margin: '0 0 0.85rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} color="#f59e0b" /> Re-Ranked Sector Leaderboard ({nonprofit.nteeCategory})
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0.3rem' }}>RANK</th>
                    <th style={{ padding: '0.5rem 0.3rem' }}>ORGANIZATION</th>
                    <th style={{ padding: '0.5rem 0.3rem' }}>DEFAULT</th>
                    <th style={{ padding: '0.5rem 0.3rem' }}>YOUR SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorPeers.slice(0, 6).map((peer, idx) => (
                    <tr
                      key={peer.id}
                      onClick={() => onSelectNonProfit(peer.id)}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        background: peer.id === nonprofit.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '0.5rem 0.3rem', fontWeight: 800, color: idx === 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ padding: '0.5rem 0.3rem', fontWeight: 600, color: '#fff' }}>
                        {peer.name}
                      </td>
                      <td style={{ padding: '0.5rem 0.3rem', color: 'var(--text-secondary)' }}>
                        {peer.overallScore}
                      </td>
                      <td style={{ padding: '0.5rem 0.3rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>
                        {peer.customScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
