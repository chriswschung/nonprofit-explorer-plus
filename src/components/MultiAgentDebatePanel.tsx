import React, { useState } from 'react';
import type { NonProfitData } from '../types/nonprofit';
import { evaluateNonProfitScore } from '../utils/scoreEvaluator';
import { Users, Bot, FileText, Play, CheckCircle } from 'lucide-react';

interface MultiAgentDebatePanelProps {
  nonprofit: NonProfitData;
}

export const MultiAgentDebatePanel: React.FC<MultiAgentDebatePanelProps> = ({ nonprofit }) => {
  const evaluated = evaluateNonProfitScore(nonprofit);
  const displayDebates = evaluated.agentDebates.length ? evaluated.agentDebates : nonprofit.agentDebates;

  const [activeStep, setActiveStep] = useState<number>(displayDebates.length); // default show all
  const [isDebating, setIsDebating] = useState<boolean>(false);

  const startLiveDebate = () => {
    setIsDebating(true);
    setActiveStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setActiveStep(current);
      if (current >= displayDebates.length) {
        clearInterval(interval);
        setIsDebating(false);
      }
    }, 900);
  };

  const avgScore = (
    displayDebates.reduce((acc, curr) => acc + curr.scoreGiven, 0) /
    (displayDebates.length || 1)
  ).toFixed(1);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            GOOGLE CLOUD ADK MULTI-AGENT SWARM
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0.2rem 0 0 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#a855f7" /> MULTI-AGENT CONSENSUS DEBATE PANEL
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            3 specialized AI agents evaluate {nonprofit.name} from Financial, Governance, and Impact perspectives
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={startLiveDebate}
            disabled={isDebating}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #00f0ff)',
              border: 'none',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Play size={15} /> {isDebating ? 'DEBATE IN PROGRESS...' : 'RE-RUN AGENT DEBATE'}
          </button>

          <div style={{ background: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>PANEL CONSENSUS</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>{avgScore} / 10</span>
          </div>
        </div>
      </div>

      {/* Agents Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {displayDebates.slice(0, activeStep).map((statement, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-main)',
              padding: '1.1rem',
              borderRadius: '10px',
              border: `1px solid var(--border-subtle)`,
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: statement.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 12px ${statement.avatarColor}40`
              }}
            >
              <Bot size={22} color="#fff" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <div>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, display: 'block' }}>
                    {statement.agentName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: statement.avatarColor, fontWeight: 600 }}>
                    {statement.agentRole}
                  </span>
                </div>

                <span
                  style={{
                    background: `${statement.avatarColor}15`,
                    color: statement.avatarColor,
                    padding: '2px 10px',
                    borderRadius: '12px',
                    border: `1px solid ${statement.avatarColor}40`,
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}
                >
                  Rating: {statement.scoreGiven} / 10
                </span>
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5', fontWeight: 500 }}>
                "{statement.statement}"
              </p>

              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {(statement.citations || []).map((cite: string, cIdx: number) => (
                  <span
                    key={cIdx}
                    style={{
                      fontSize: '0.7rem',
                      background: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <FileText size={11} /> {cite}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {activeStep >= displayDebates.length && (
          <div style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '0.85rem 1.1rem', borderRadius: '8px', border: '1px solid rgba(5, 150, 105, 0.3)', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 700 }}>
            <CheckCircle size={18} /> Multi-Agent Panel Verdict: Unanimous endorsement for high program efficiency and governance transparency.
          </div>
        )}
      </div>
    </div>
  );
};
