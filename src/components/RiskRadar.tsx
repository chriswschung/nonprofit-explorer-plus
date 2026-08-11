import React from 'react';
import type { NonProfitData } from '../types/nonprofit';
import { ShieldAlert, ShieldCheck, AlertTriangle, FileText, Activity } from 'lucide-react';

interface RiskRadarProps {
  nonprofit: NonProfitData;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ nonprofit }) => {
  const getRiskColor = (score: number) => {
    if (score < 25) return '#00ff88'; // Low Risk
    if (score < 55) return '#ffb703'; // Moderate Risk
    return '#ff0055'; // Elevated Risk
  };

  const riskColor = getRiskColor(nonprofit.riskScore);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            BIGQUERY + GEMINI AGENT AUDIT
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0.2rem 0 0 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--accent-blue)" /> 990 ANOMALY & GOVERNANCE RISK RADAR
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Cross-referencing {nonprofit.name}'s Form 990 against 100,000+ BigQuery non-profit filings
          </p>
        </div>

        {/* Risk Meter Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-main)', padding: '0.6rem 1.2rem', borderRadius: '10px', border: `1px solid ${riskColor}40` }}>
          {nonprofit.riskScore < 25 ? <ShieldCheck size={28} color="var(--accent-emerald)" /> : <ShieldAlert size={28} color={riskColor} />}
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ANOMALY RISK SCORE</span>
            <span style={{ fontSize: '1.4rem', color: riskColor, fontWeight: 900 }}>
              {nonprofit.riskScore} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: riskColor, fontWeight: 700, display: 'block' }}>
              {nonprofit.riskLevel.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Risk Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--accent-emerald)' }}>LOW RISK (0-25)</span>
          <span style={{ color: 'var(--accent-amber)' }}>MODERATE RISK (26-55)</span>
          <span style={{ color: 'var(--accent-rose)' }}>ELEVATED RISK (56-100)</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
          <div
            style={{
              width: `${nonprofit.riskScore}%`,
              height: '100%',
              background: `linear-gradient(90deg, #059669, ${riskColor})`,
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }}
          />
        </div>
      </div>

      {/* Audited Anomaly Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <AlertTriangle size={14} /> AUDITED 990 GOVERNANCE INDICATORS & ANOMALIES ({nonprofit.anomalies.length}):
        </span>

        {nonprofit.anomalies.map((anom, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-main)',
              padding: '0.85rem 1.1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                {anom.title}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.68rem', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-blue)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(2, 132, 199, 0.25)', fontWeight: 600 }}>
                  {anom.category}
                </span>
                <span style={{ fontSize: '0.68rem', background: anom.severity === 'LOW' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(217, 119, 6, 0.1)', color: anom.severity === 'LOW' ? 'var(--accent-emerald)' : 'var(--accent-amber)', padding: '1px 6px', borderRadius: '4px', border: `1px solid ${anom.severity === 'LOW' ? 'var(--accent-emerald)' : 'var(--accent-amber)'}30`, fontWeight: 700 }}>
                  {anom.severity} SEVERITY
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              {anom.description}
            </p>

            <div style={{ fontSize: '0.72rem', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px', fontFamily: 'monospace', fontWeight: 600 }}>
              <FileText size={12} /> {anom.form990Citation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
