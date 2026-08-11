import React, { useState } from 'react';
import type { NonProfitData } from '../types/nonprofit';
import { Calculator, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ImpactCalculatorProps {
  nonprofit: NonProfitData;
  onAddDonation?: (nonprofit: NonProfitData, amount: number) => void;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({
  nonprofit,
  onAddDonation
}) => {
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [donateSuccess, setDonateSuccess] = useState<boolean>(false);

  const directProgramDollars = (donationAmount * (nonprofit.programExpenseRatio / 100)).toFixed(2);
  const adminDollars = (donationAmount * (nonprofit.adminExpenses / nonprofit.totalExpenses)).toFixed(2);
  const fundraisingDollars = (donationAmount * (nonprofit.fundraisingExpenses / nonprofit.totalExpenses)).toFixed(2);

  const quantifiableUnits = Math.round((donationAmount / 1000) * nonprofit.impactPer1000Dollars * 10) / 10;
  const estimatedTaxSavings = (donationAmount * 0.35).toFixed(2); // estimated 35% federal + state bracket

  const presetAmounts = [100, 250, 500, 1000, 2500, 5000];

  const handleDonate = () => {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.7 } });
    if (onAddDonation) {
      onAddDonation(nonprofit, donationAmount);
    }
    setDonateSuccess(true);
    setTimeout(() => setDonateSuccess(false), 3000);
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '1rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            FORM 990 PART IX ALLOCATION ENGINE
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0.2rem 0 0 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={20} color="var(--accent-emerald)" /> AI Donation Impact & Tax Savings Calculator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Simulate exact dollar allocation, field output, and 501(c)(3) tax deduction for a donation to {nonprofit.name}
          </p>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 700 }}>
          <Sparkles size={14} /> 100% AUDITED 990 RATIOS
        </div>
      </div>

      {donateSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <CheckCircle2 size={16} /> Donation pledged! Added ${donationAmount.toLocaleString()} to your Vertex AI Memory Bank running tab.
        </div>
      )}

      {/* Preset Buttons & Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>CHOOSE DONATION AMOUNT:</label>
          <span style={{ fontSize: '1.6rem', color: 'var(--accent-blue)', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
            ${donationAmount.toLocaleString()}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setDonationAmount(amt)}
              style={{
                background: donationAmount === amt ? 'var(--accent-blue)' : 'rgba(15, 23, 42, 0.8)',
                color: donationAmount === amt ? '#000' : 'var(--accent-blue)',
                border: donationAmount === amt ? 'none' : '1px solid rgba(56, 189, 248, 0.3)',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>

        <input
          type="range"
          min="50"
          max="10000"
          step="50"
          value={donationAmount}
          onChange={(e) => setDonationAmount(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
        />
      </div>

      {/* Allocation Dollar Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* Direct Program Mission */}
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>DIRECT PROGRAM IMPACT ({nonprofit.programExpenseRatio}%)</span>
          <span style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', fontWeight: 900 }}>
            ${Number(directProgramDollars).toLocaleString()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
            Goes directly to field mission & program services
          </span>
        </div>

        {/* Administration */}
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>OPERATIONAL ADMIN ({(nonprofit.adminExpenses / nonprofit.totalExpenses * 100).toFixed(1)}%)</span>
          <span style={{ fontSize: '1.5rem', color: 'var(--accent-blue)', fontWeight: 800 }}>
            ${Number(adminDollars).toLocaleString()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
            Supports governance, legal & compliance
          </span>
        </div>

        {/* Fundraising */}
        <div style={{ background: 'rgba(129, 140, 248, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(129, 140, 248, 0.25)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>FUNDRAISING & OUTREACH ({(nonprofit.fundraisingExpenses / nonprofit.totalExpenses * 100).toFixed(1)}%)</span>
          <span style={{ fontSize: '1.5rem', color: '#818cf8', fontWeight: 800 }}>
            ${Number(fundraisingDollars).toLocaleString()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
            Sustains future donor engagement
          </span>
        </div>
      </div>

      {/* Quantifiable Mission Output Card & Donate Action */}
      <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--accent-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            ESTIMATED FIELD MISSION OUTPUT
          </span>
          <h4 style={{ fontSize: '1.3rem', color: '#fff', margin: '0.2rem 0 0 0', fontWeight: 800 }}>
            ~{quantifiableUnits} {nonprofit.quantifiableImpactUnit}
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Estimated Tax Savings: <strong style={{ color: 'var(--accent-emerald)' }}>~${estimatedTaxSavings}</strong> (501(c)(3) tax deduction)
          </span>
        </div>

        <button
          onClick={handleDonate}
          style={{
            background: 'var(--accent-emerald)',
            border: 'none',
            color: '#000',
            padding: '0.8rem 1.6rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
          }}
        >
          <HeartHandshake size={19} /> DONATE (${donationAmount.toLocaleString()})
        </button>
      </div>
    </div>
  );
};
