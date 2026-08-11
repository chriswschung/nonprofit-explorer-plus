import React, { useState } from 'react';
import type { NonProfitData } from '../types/nonprofit';
import { Award, PieChart, ExternalLink, Filter, Layers } from 'lucide-react';

interface SectorOverviewProps {
  allNonProfits: NonProfitData[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  onSelectNonProfit: (id: string) => void;
  onViewScorecard: (id: string) => void;
}

export const SectorOverview: React.FC<SectorOverviewProps> = ({
  allNonProfits,
  selectedCategory,
  setSelectedCategory,
  categories,
  onSelectNonProfit,
  onViewScorecard
}) => {
  const [hoveredOrg, setHoveredOrg] = useState<NonProfitData | null>(null);

  // Filter nonprofits for the selected category
  const sectorNonProfits = selectedCategory === 'All'
    ? allNonProfits
    : allNonProfits.filter((np) => np.nteeCategory === selectedCategory);

  // Sector Aggregate Statistics
  const totalSectorRevenue = sectorNonProfits.reduce((acc, np) => acc + np.totalRevenue, 0);
  const avgProgramEfficiency = sectorNonProfits.length
    ? Math.round((sectorNonProfits.reduce((acc, np) => acc + np.programExpenseRatio, 0) / sectorNonProfits.length) * 10) / 10
    : 0;
  const avgGovernanceScore = sectorNonProfits.length
    ? Math.round((sectorNonProfits.reduce((acc, np) => acc + (np.governanceScore || 8.5), 0) / sectorNonProfits.length) * 10) / 10
    : 0;
  const topRankedOrg = sectorNonProfits.length
    ? [...sectorNonProfits].sort((a, b) => b.overallScore - a.overallScore)[0]
    : null;

  // Chart Dimensions & Scales
  const svgWidth = 900;
  const svgHeight = 420;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // X Scale: Governance Score 5.0 to 10.0
  const minX = 5.0;
  const maxX = 10.0;
  const getX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * chartWidth;

  // Y Scale: Program Efficiency 50% to 100%
  const minY = 50;
  const maxY = 100;
  const getY = (val: number) => padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;

  // Smooth Logarithmic Bubble Scaling (Radius 8px to 26px) across revenue ranges ($1M to $30B+)
  const minRevenue = 1000000;
  const maxRevenue = Math.max(...allNonProfits.map((np) => np.totalRevenue), 10000000);
  const getRadius = (rev: number) => {
    const minLog = Math.log10(minRevenue);
    const maxLog = Math.log10(maxRevenue);
    const valLog = Math.log10(Math.max(rev, minRevenue));
    const normalized = Math.max(0, Math.min(1, (valLog - minLog) / (maxLog - minLog || 1)));
    return Math.round(8 + normalized * 18);
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${(val / 1000).toFixed(0)}K`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Header & Sector Selector */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-blue)" />
              Sector Overview & Form 990 Efficiency Matrix
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
              X-axis measures Governance & Board Oversight Score; Y-axis measures Program Efficiency %; Bubble size indicates Total Revenue.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
            <Filter size={14} color="var(--accent-blue)" />
            <span style={{ color: 'var(--text-secondary)' }}>Sector:</span>
            <strong style={{ color: '#fff' }}>{selectedCategory}</strong>
          </div>
        </div>

        {/* Sector Filter Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedCategory === cat ? '#38bdf8' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                padding: '0.3rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: selectedCategory === cat ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sector Summary Aggregate Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL SECTOR REVENUE</span>
            <span style={{ fontSize: '1.15rem', color: 'var(--accent-blue)', fontWeight: 700 }}>{formatCurrency(totalSectorRevenue)}</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AVG PROGRAM SPEND %</span>
            <span style={{ fontSize: '1.15rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>{avgProgramEfficiency}%</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AVG GOVERNANCE RATING</span>
            <span style={{ fontSize: '1.15rem', color: '#818cf8', fontWeight: 700 }}>{avgGovernanceScore} / 10</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOP RANKED ORGANIZER</span>
            <span style={{ fontSize: '0.88rem', color: '#f59e0b', fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {topRankedOrg ? topRankedOrg.name : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive SVG Bubble Chart Area */}
      <div className="glass-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PieChart size={15} color="var(--accent-blue)" /> Efficiency vs. Governance Bubble Matrix
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Click bubble to open 10-point scorecard
          </span>
        </div>

        {/* SVG Canvas */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', background: 'rgba(11, 15, 25, 0.9)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            {/* Background Grid Lines */}
            {[50, 60, 70, 80, 90, 100].map((val) => {
              const y = getY(val);
              return (
                <g key={`y-grid-${val}`}>
                  <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <text x={padding.left - 8} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">
                    {val}%
                  </text>
                </g>
              );
            })}

            {[6.0, 7.0, 8.0, 9.0, 10.0].map((val) => {
              const x = getX(val);
              return (
                <g key={`x-grid-${val}`}>
                  <line x1={x} y1={padding.top} x2={x} y2={svgHeight - padding.bottom} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <text x={x} y={svgHeight - padding.bottom + 18} fill="#64748b" fontSize="10" textAnchor="middle">
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Axis Labels */}
            <text x={svgWidth / 2} y={svgHeight - 10} fill="var(--text-secondary)" fontSize="11" fontWeight="600" textAnchor="middle">
              Governance & Board Oversight Score (Part VI/VII) →
            </text>
            <text x={16} y={svgHeight / 2} fill="var(--text-secondary)" fontSize="11" fontWeight="600" textAnchor="middle" transform={`rotate(-90 16 ${svgHeight / 2})`}>
              ← Program Efficiency Ratio (% Spend)
            </text>

            {/* Render Nonprofit Bubbles */}
            {sectorNonProfits.map((np) => {
              const x = getX(np.governanceScore || 8.5);
              const y = getY(np.programExpenseRatio);
              const radius = getRadius(np.totalRevenue);
              const isHovered = hoveredOrg?.id === np.id;
              const color = isHovered ? 'var(--accent-blue)' : 'rgba(56, 189, 248, 0.45)';

              return (
                <g key={np.id} style={{ cursor: 'pointer' }}>
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 6}
                      fill="none"
                      stroke="var(--accent-blue)"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={color}
                    stroke="var(--accent-blue)"
                    strokeWidth={isHovered ? '2' : '1'}
                    onMouseEnter={() => setHoveredOrg(np)}
                    onClick={() => {
                      onSelectNonProfit(np.id);
                      onViewScorecard(np.id);
                    }}
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {radius >= 20 && (
                    <text
                      x={x}
                      y={y + 3}
                      fill="#fff"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {np.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hovered Tooltip Floating Card */}
        {hoveredOrg && (
          <div
            className="glass-card"
            style={{
              marginTop: '0.85rem',
              padding: '0.85rem 1rem',
              background: 'var(--bg-sidebar)',
              border: '1px solid var(--accent-blue)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.85rem'
            }}
          >
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem' }}>{hoveredOrg.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.1rem' }}>
                EIN: {hoveredOrg.ein} • {hoveredOrg.nteeCategory}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>REVENUE</span>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>{formatCurrency(hoveredOrg.totalRevenue)}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>PROGRAM SPEND</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold', fontSize: '0.85rem' }}>{hoveredOrg.programExpenseRatio}%</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>GOVERNANCE</span>
                <span style={{ color: '#818cf8', fontWeight: 'bold', fontSize: '0.85rem' }}>{hoveredOrg.governanceScore}/10</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>SCORE</span>
                <span style={{ color: '#f59e0b', fontWeight: '800', fontSize: '1rem' }}>{hoveredOrg.overallScore}/10</span>
              </div>

              <button
                onClick={() => {
                  onSelectNonProfit(hoveredOrg.id);
                  onViewScorecard(hoveredOrg.id);
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-blue)',
                  border: '1px solid var(--accent-blue)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                SCORECARD <ExternalLink size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Sector Leaderboard Table */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 0.85rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={16} color="#f59e0b" />
          Sector Leaderboard
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.6rem 0.4rem' }}>ORGANIZATION</th>
                <th style={{ padding: '0.6rem 0.4rem' }}>NTEE SECTOR</th>
                <th style={{ padding: '0.6rem 0.4rem' }}>REVENUE</th>
                <th style={{ padding: '0.6rem 0.4rem' }}>PROGRAM SPEND</th>
                <th style={{ padding: '0.6rem 0.4rem' }}>3-YR CAGR</th>
                <th style={{ padding: '0.6rem 0.4rem' }}>SCORE</th>
                <th style={{ padding: '0.6rem 0.4rem', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {sectorNonProfits.slice(0, 12).map((np) => (
                <tr
                  key={np.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.6rem 0.4rem', fontWeight: 600, color: '#fff' }}>
                    {np.name}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EIN: {np.ein}</div>
                  </td>
                  <td style={{ padding: '0.6rem 0.4rem', color: 'var(--text-secondary)' }}>{np.nteeCategory}</td>
                  <td style={{ padding: '0.6rem 0.4rem', color: 'var(--accent-blue)', fontWeight: 600 }}>{formatCurrency(np.totalRevenue)}</td>
                  <td style={{ padding: '0.6rem 0.4rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>{np.programExpenseRatio}%</td>
                  <td style={{ padding: '0.6rem 0.4rem', color: (np.revenueGrowthCAGR || 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {(np.revenueGrowthCAGR || 0) > 0 ? '+' : ''}{np.revenueGrowthCAGR}%
                  </td>
                  <td style={{ padding: '0.6rem 0.4rem', color: '#f59e0b', fontWeight: 700 }}>{np.overallScore} / 10</td>
                  <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        onSelectNonProfit(np.id);
                        onViewScorecard(np.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-blue)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      SCORECARD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
