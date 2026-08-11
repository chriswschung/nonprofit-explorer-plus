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
          <div style={{ fontSize: '0.72rem', color: '#ffb703', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            BIGQUERY + GEMINI AGENT AUDIT
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0.2rem 0 0 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#00f0ff" /> 990 ANOMALY & GOVERNANCE RISK RADAR
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Cross-referencing {nonprofit.name}'s Form 990 against 100,000+ BigQuery non-profit filings
          </p>
        </div>

        {/* Risk Meter Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15,23,42,0.85)', padding: '0.6rem 1.2rem', borderRadius: '10px', border: `1px solid ${riskColor}40` }}>
          {nonprofit.riskScore < 25 ? <ShieldCheck size={28} color="#00ff88" /> : <ShieldAlert size={28} color={riskColor} />}
          <div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>ANOMALY RISK SCORE</span>
            <span style={{ fontSize: '1.4rem', color: riskColor, fontWeight: 900 }}>
              {nonprofit.riskScore} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 100</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: riskColor, fontWeight: 700, display: 'block' }}>
              {nonprofit.riskLevel.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Risk Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>
          <span style={{ color: '#00ff88' }}>LOW RISK (0-25)</span>
          <span style={{ color: '#ffb703' }}>MODERATE RISK (26-55)</span>
          <span style={{ color: '#ff0055' }}>ELEVATED RISK (56-100)</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
          <div
            style={{
              width: `${nonprofit.riskScore}%`,
              height: '100%',
              background: `linear-gradient(90deg, #00ff88, ${riskColor})`,
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }}
          />
        </div>
      </div>

      {/* Audited Anomaly Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <AlertTriangle size={14} /> AUDITED 990 GOVERNANCE INDICATORS & ANOMALIES ({nonprofit.anomalies.length}):
        </span>

        {nonprofit.anomalies.map((anom, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(15,23,42,0.6)',
              padding: '0.85rem 1.1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
                {anom.title}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.68rem', background: 'rgba(0,240,255,0.1)', color: '#00f0ff', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(0,240,255,0.25)', fontWeight: 600 }}>
                  {anom.category}
                </span>
                <span style={{ fontSize: '0.68rem', background: anom.severity === 'LOW' ? 'rgba(0,255,136,0.1)' : 'rgba(255,183,3,0.1)', color: anom.severity === 'LOW' ? '#00ff88' : '#ffb703', padding: '1px 6px', borderRadius: '4px', border: `1px solid ${anom.severity === 'LOW' ? '#00ff88' : '#ffb703'}30`, fontWeight: 700 }}>
                  {anom.severity} SEVERITY
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
              {anom.description}
            </p>

            <div style={{ fontSize: '0.72rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px', fontFamily: 'monospace' }}>
              <FileText size={12} /> {anom.form990Citation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
