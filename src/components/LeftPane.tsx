import type { NonProfitData } from '../types/nonprofit';
import { Globe, MapPin, PieChart, Users, ArrowUpRight, Scale } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

interface LeftPaneProps {
  nonprofit: NonProfitData;
  onSelectPeer: (peerId: string) => void;
  onOpenPeerModal?: () => void;
}

export const LeftPane: React.FC<LeftPaneProps> = ({
  nonprofit,
  onSelectPeer,
  onOpenPeerModal
}) => {
  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const ceo = nonprofit.executives.find((e) => e.title.includes('CEO') || e.title.includes('President')) || nonprofit.executives[0];

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* 1. Organization Profile Header & Summary */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--accent-blue)',
                background: 'rgba(2, 132, 199, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {nonprofit.nteeCategory}
            </span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0.3rem 0 0.2rem 0', fontWeight: 800 }}>
              {nonprofit.name}
            </h2>
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span>EIN: <strong style={{ color: 'var(--text-primary)' }}>{nonprofit.ein}</strong></span>
              <span>• Tax Year: <strong style={{ color: 'var(--text-primary)' }}>{nonprofit.taxYear}</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <MapPin size={12} color="var(--accent-indigo)" /> {nonprofit.cityState}
              </span>
            </div>
          </div>

          <a
            href={nonprofit.website}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--accent-blue)',
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'rgba(2, 132, 199, 0.08)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Globe size={13} /> Official Web <ArrowUpRight size={13} />
          </a>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.75rem 0 0 0', lineHeight: '1.5' }}>
          {nonprofit.mission}
        </p>
      </div>

      {/* 2. Key Financial Stats Grid Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
        <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>ANNUAL REVENUE</span>
          <span style={{ fontSize: '1.05rem', color: 'var(--accent-blue)', fontWeight: 800 }}>{formatCurrency(nonprofit.totalRevenue)}</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Form 990 Part VIII</span>
        </div>

        <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>PROGRAM SPEND %</span>
          <span style={{ fontSize: '1.05rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>{nonprofit.programExpenseRatio}%</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Part IX Line 25 Column B</span>
        </div>

        <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>CEO SALARY</span>
          <span style={{ fontSize: '1.05rem', color: 'var(--accent-amber)', fontWeight: 800 }}>{formatCurrency(ceo ? ceo.compensation : 0)}</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>{ceo ? ceo.percentOfBudget : 0}% of budget</span>
        </div>

        <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>LIQUID RESERVES</span>
          <span style={{ fontSize: '1.05rem', color: 'var(--accent-indigo)', fontWeight: 800 }}>{nonprofit.operatingReserveMonths} mo</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Net Asset Buffer (Part X)</span>
        </div>
      </div>

      {/* 3. Revenue Mix Breakdown Summary */}
      <div style={{ background: 'var(--bg-main)', padding: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><PieChart size={13} color="var(--accent-blue)" /> REVENUE SOURCES BREAKDOWN</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Form 990 Part VIII</span>
        </div>

        <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border-subtle)', overflow: 'hidden', display: 'flex', margin: '0.4rem 0 0.6rem 0' }}>
          <div style={{ width: `${nonprofit.revenueSources.contributionsGrants}%`, background: 'var(--accent-blue)' }} title="Grants & Contributions" />
          <div style={{ width: `${nonprofit.revenueSources.programServiceFees}%`, background: 'var(--accent-emerald)' }} title="Program Service Fees" />
          <div style={{ width: `${nonprofit.revenueSources.investmentIncome}%`, background: 'var(--accent-amber)' }} title="Investment Income" />
          <div style={{ width: `${nonprofit.revenueSources.otherRevenue}%`, background: 'var(--text-muted)' }} title="Other Revenue" />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <span><span style={{ color: 'var(--accent-blue)' }}>■</span> Contributions: {nonprofit.revenueSources.contributionsGrants}%</span>
          <span><span style={{ color: 'var(--accent-emerald)' }}>■</span> Service Fees: {nonprofit.revenueSources.programServiceFees}%</span>
          <span><span style={{ color: 'var(--accent-amber)' }}>■</span> Investment: {nonprofit.revenueSources.investmentIncome}%</span>
        </div>
      </div>

      {/* 4. AI Form 990 Chat Assistant Card coming AFTER all summary cards */}
      <ChatWindow nonprofit={nonprofit} />

      {/* 5. Similar Sector Peers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={14} color="var(--accent-blue)" /> SIMILAR SECTOR PEERS
          </span>
          {onOpenPeerModal && (
            <button
              onClick={onOpenPeerModal}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-blue)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <Scale size={13} /> Compare Matrix
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {nonprofit.peers.map((peer) => (
            <div
              key={peer.id}
              onClick={() => onSelectPeer(peer.id)}
              style={{
                background: 'var(--bg-main)',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{peer.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Revenue: {formatCurrency(peer.totalRevenue)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>{peer.programExpenseRatio}%</span>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Prog ratio</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
