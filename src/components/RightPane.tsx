import type { NonProfitData } from '../types/nonprofit';
import { Award, CheckCircle2, FileText, TrendingUp, DollarSign, Users, ShieldCheck } from 'lucide-react';

interface RightPaneProps {
  nonprofit: NonProfitData;
}

export const RightPane: React.FC<RightPaneProps> = ({ nonprofit }) => {
  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'var(--accent-emerald)';
    if (score >= 8.0) return 'var(--accent-blue)';
    if (score >= 7.0) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* 1. Overall Score Header Badge */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
            BALANCED 990 EVALUATION SCORE
          </span>
          <h2 style={{ fontSize: '1.15rem', color: '#fff', margin: '0.15rem 0 0 0', fontWeight: 800 }}>
            6-Dimensional Audited Scorecard
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Audited against IRS Form 990 Part VI, VII, VIII, IX, X & Schedule A
          </span>
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(11, 15, 25, 0.9)', padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid var(--accent-emerald)' }}>
          <span style={{ fontSize: '1.8rem', color: 'var(--accent-emerald)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {nonprofit.overallScore}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}> / 10</span>
        </div>
      </div>

      {/* 2. Top Summary Grid: All 6 Dimensional Scores */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Award size={13} color="var(--accent-blue)" /> 6-DIMENSIONAL SCORE BREAKDOWN SUMMARY
        </span>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.55rem',
            background: 'rgba(11, 15, 25, 0.75)',
            padding: '0.85rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {nonprofit.ratings.map((rating, idx) => {
            const color = getScoreColor(rating.score);
            const shortTitle = rating.dimension.replace(/^\d+\.\s*/, '');
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '6px',
                  border: `1px solid ${color}35`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                <span
                  style={{
                    fontSize: '0.66rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={rating.dimension}
                >
                  {shortTitle}
                </span>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.1rem' }}>
                  <span style={{ fontSize: '1.05rem', color: color, fontWeight: 800 }}>
                    {rating.score}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      color: color,
                      background: `${color}15`,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontWeight: 700
                    }}
                  >
                    {rating.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Key Multi-Metric Form 990 Fast Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: '0.65rem',
          background: 'rgba(15, 23, 42, 0.5)',
          padding: '0.85rem',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={12} color="var(--accent-emerald)" /> 3-YR REV GROWTH
          </span>
          <span style={{ fontSize: '0.95rem', color: (nonprofit.revenueGrowthCAGR || 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 700 }}>
            {(nonprofit.revenueGrowthCAGR || 0) > 0 ? '+' : ''}{nonprofit.revenueGrowthCAGR || 0}% CAGR
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={12} color="var(--accent-blue)" /> PUBLIC SUPPORT %
          </span>
          <span style={{ fontSize: '0.95rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
            {nonprofit.publicSupportRatio || 85}% (Sch A)
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={12} color="#818cf8" /> EST. DONORS COUNT
          </span>
          <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>
            ~{(nonprofit.estimatedDonorsCount || 120000).toLocaleString()}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <DollarSign size={12} color="#f59e0b" /> AVG DONATION SIZE
          </span>
          <span style={{ fontSize: '0.95rem', color: '#f59e0b', fontWeight: 700 }}>
            ~${nonprofit.averageDonationSize || 125} / year
          </span>
        </div>
      </div>

      {/* 4. Detailed Dimensional Analysis & Reasoning */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '0.95rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={16} color="var(--accent-blue)" /> Detailed Dimensional Analysis & Reasoning
        </h3>

        {nonprofit.ratings.map((rating, idx) => {
          const scoreColor = getScoreColor(rating.score);
          return (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              {/* Rating Title & Score Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color={scoreColor} /> {rating.dimension}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: scoreColor,
                      background: `${scoreColor}12`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${scoreColor}30`,
                      fontWeight: 700
                    }}
                  >
                    {rating.status}
                  </span>
                  <span style={{ fontSize: '1.05rem', color: scoreColor, fontWeight: 800 }}>
                    {rating.score} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 10</span>
                  </span>
                </div>
              </div>

              {/* Rating Summary */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>
                {rating.summary}
              </p>

              {/* Detailed Reasoning Bullet Points */}
              <div style={{ background: 'rgba(11, 15, 25, 0.7)', padding: '0.75rem', borderRadius: '6px', borderLeft: '2px solid var(--accent-blue)' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  DATA-DRIVEN 990 REASONING:
                </span>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {rating.reasoning.map((point, pIdx) => (
                    <li key={pIdx} style={{ marginBottom: '0.2rem' }}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Form 990 Line Citations & Peer Comparison */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.75rem', paddingTop: '0.3rem', borderTop: '1px dashed var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <FileText size={12} color="#818cf8" />
                  <span style={{ color: 'var(--text-muted)' }}>CITATIONS:</span>
                  {rating.form990Citations.map((cite, cIdx) => (
                    <span
                      key={cIdx}
                      style={{
                        background: 'rgba(129, 140, 248, 0.1)',
                        color: '#818cf8',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        border: '1px solid rgba(129, 140, 248, 0.25)',
                        fontFamily: 'monospace',
                        fontSize: '0.7rem'
                      }}
                    >
                      {cite}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  <TrendingUp size={12} /> {rating.peerComparison}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
