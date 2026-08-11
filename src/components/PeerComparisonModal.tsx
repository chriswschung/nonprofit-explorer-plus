import type { NonProfitData } from '../types/nonprofit';
import { X, Scale } from 'lucide-react';

interface PeerComparisonModalProps {
  nonprofit: NonProfitData;
  onClose: () => void;
  onSelectPeer: (peerId: string) => void;
}

export const PeerComparisonModal: React.FC<PeerComparisonModalProps> = ({
  nonprofit,
  onClose,
  onSelectPeer
}) => {
  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val}`;
  };

  const ceo = nonprofit.executives.find((e) => e.title.includes('CEO') || e.title.includes('President')) || nonprofit.executives[0];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(2, 4, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={22} color="#a855f7" /> PEER BENCHMARK COMPARISON MATRIX
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Side-by-side Form 990 audit comparing {nonprofit.name} against sector peers in {nonprofit.nteeCategory}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              color: '#fff'
            }}
          >
            <thead>
              <tr style={{ background: 'rgba(0,240,255,0.08)', borderBottom: '2px solid rgba(0,240,255,0.3)' }}>
                <th style={{ padding: '0.85rem', textAlign: 'left', color: '#94a3b8' }}>METRIC / NONPROFIT</th>
                <th style={{ padding: '0.85rem', textAlign: 'center', color: '#00f0ff', background: 'rgba(0,240,255,0.1)' }}>
                  ★ {nonprofit.name} (ACTIVE)
                </th>
                {nonprofit.peers.map((peer) => (
                  <th key={peer.id} style={{ padding: '0.85rem', textAlign: 'center', color: '#a855f7' }}>
                    {peer.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Overall Rating */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '0.85rem', fontWeight: 600 }}>Explorer Overall Rating</td>
                <td style={{ padding: '0.85rem', textAlign: 'center', color: '#00ff88', fontWeight: 800, fontSize: '1.1rem', background: 'rgba(0,240,255,0.04)' }}>
                  {nonprofit.overallScore} / 10
                </td>
                {nonprofit.peers.map((peer) => (
                  <td key={peer.id} style={{ padding: '0.85rem', textAlign: 'center', color: '#ffb703', fontWeight: 700 }}>
                    {peer.overallScore} / 10
                  </td>
                ))}
              </tr>

              {/* Total Revenue */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '0.85rem', fontWeight: 600 }}>Total Annual Revenue</td>
                <td style={{ padding: '0.85rem', textAlign: 'center', color: '#00f0ff', fontWeight: 700, background: 'rgba(0,240,255,0.04)' }}>
                  {formatCurrency(nonprofit.totalRevenue)}
                </td>
                {nonprofit.peers.map((peer) => (
                  <td key={peer.id} style={{ padding: '0.85rem', textAlign: 'center', color: '#cbd5e1' }}>
                    {formatCurrency(peer.totalRevenue)}
                  </td>
                ))}
              </tr>

              {/* Program Expense Ratio */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '0.85rem', fontWeight: 600 }}>Program Expense Ratio (%)</td>
                <td style={{ padding: '0.85rem', textAlign: 'center', color: '#00ff88', fontWeight: 800, background: 'rgba(0,240,255,0.04)' }}>
                  {nonprofit.programExpenseRatio}%
                </td>
                {nonprofit.peers.map((peer) => (
                  <td key={peer.id} style={{ padding: '0.85rem', textAlign: 'center', color: '#00ff88', fontWeight: 600 }}>
                    {peer.programExpenseRatio}%
                  </td>
                ))}
              </tr>

              {/* CEO Compensation */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '0.85rem', fontWeight: 600 }}>CEO / Leader Pay</td>
                <td style={{ padding: '0.85rem', textAlign: 'center', color: '#a855f7', fontWeight: 700, background: 'rgba(0,240,255,0.04)' }}>
                  {formatCurrency(ceo.compensation)} ({ceo.percentOfBudget}% of budget)
                </td>
                {nonprofit.peers.map((peer) => (
                  <td key={peer.id} style={{ padding: '0.85rem', textAlign: 'center', color: '#cbd5e1' }}>
                    {formatCurrency(peer.ceoPay)}
                  </td>
                ))}
              </tr>

              {/* Operating Reserves */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '0.85rem', fontWeight: 600 }}>Operating Reserve Buffer</td>
                <td style={{ padding: '0.85rem', textAlign: 'center', color: '#ffb703', fontWeight: 700, background: 'rgba(0,240,255,0.04)' }}>
                  {nonprofit.operatingReserveMonths} Months
                </td>
                {nonprofit.peers.map(() => (
                  <td key={Math.random()} style={{ padding: '0.85rem', textAlign: 'center', color: '#cbd5e1' }}>
                    ~12.4 Months (Sector Avg)
                  </td>
                ))}
              </tr>

              {/* Action */}
              <tr>
                <td style={{ padding: '0.85rem', fontWeight: 600 }}>Switch Active NonProfit</td>
                <td style={{ padding: '0.85rem', textAlign: 'center', background: 'rgba(0,240,255,0.04)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#00ff88', fontWeight: 700 }}>● SELECTED</span>
                </td>
                {nonprofit.peers.map((peer) => (
                  <td key={peer.id} style={{ padding: '0.85rem', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        onSelectPeer(peer.id);
                        onClose();
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
                        border: 'none',
                        color: '#fff',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      Inspect 990
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
