import React, { useState } from 'react';
import type { NonProfitData, DonationPledge, DonorPreferences } from '../types/nonprofit';
import { Bookmark, CheckCircle2, ShieldCheck, Trash2, DollarSign, Calculator, Receipt, Sparkles, PlusCircle, Building2 } from 'lucide-react';

interface DonorMemoryPortfolioProps {
  currentNonProfit: NonProfitData;
  allNonProfits: NonProfitData[];
  onSelectNonProfit: (id: string) => void;
  donations: DonationPledge[];
  onAddDonation: (nonprofit: NonProfitData, amount: number) => void;
  onRemoveDonation: (id: string) => void;
}

export const DonorMemoryPortfolio: React.FC<DonorMemoryPortfolioProps> = ({
  currentNonProfit,
  allNonProfits,
  onSelectNonProfit,
  donations,
  onAddDonation,
  onRemoveDonation
}) => {
  const [preferences] = useState<DonorPreferences>({
    savedFavorites: ['wwf', 'msf'],
    preferredCategories: ['Environment & Wildlife', 'Health & Medical Research'],
    minProgramSpendRatio: 80,
    maxCeoPayThreshold: 1500000,
    notes: 'Prioritize international organizations with high emergency reserves and lean overhead.'
  });

  const [customDonateAmount, setCustomDonateAmount] = useState<number>(500);

  // Compute Running Totals
  const totalDonatedAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalTaxSavings = donations.reduce((sum, d) => sum + d.estimatedTaxSavings, 0);

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            VERTEX AI MEMORY BANK & DONOR LEDGER
          </div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0.2rem 0 0 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bookmark size={20} color="var(--accent-blue)" /> Donor Portfolio & Running Impact Tab
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Your pledged donations, 501(c)(3) tax deduction receipts, and field outputs are persisted across sessions in Vertex AI Memory Bank.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(2, 132, 199, 0.1)', padding: '0.45rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(2, 132, 199, 0.25)', color: 'var(--accent-blue)', fontSize: '0.78rem', fontWeight: 700 }}>
          <ShieldCheck size={14} /> PERSISTED MEMORY ACTIVE
        </div>
      </div>

      {/* 1. RUNNING TAB HIGHLIGHT CARDS (Total Donated, Tax Savings, Field Outputs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            <DollarSign size={13} color="var(--accent-emerald)" /> TOTAL PLEDGED & DONATED
          </span>
          <span style={{ fontSize: '1.6rem', color: 'var(--accent-emerald)', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(totalDonatedAmount)}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
            Across {donations.length} 501(c)(3) Organizations
          </span>
        </div>

        <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            <Receipt size={13} color="var(--accent-blue)" /> ESTIMATED TAX SAVINGS
          </span>
          <span style={{ fontSize: '1.6rem', color: 'var(--accent-blue)', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(totalTaxSavings)}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
            IRS 501(c)(3) Charitable Deduction (~35%)
          </span>
        </div>

        <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            <Sparkles size={13} color="var(--accent-amber)" /> AGGREGATED FIELD OUTPUTS
          </span>
          <span style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800, marginTop: '0.2rem', display: 'block' }}>
            {donations.length > 0 ? `${donations.reduce((sum, d) => sum + d.quantifiableImpactUnits, 0).toLocaleString()} Units Funded` : '0 Outputs'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>
            Direct Mission Accomplishments
          </span>
        </div>
      </div>

      {/* 2. QUICK DONATE TO ACTIVE PROFILE CARD */}
      <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            ACTIVE PROFILE DONATION
          </span>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0.1rem 0 0 0', fontWeight: 700 }}>
            Pledge a Donation to <span style={{ color: 'var(--accent-emerald)' }}>{currentNonProfit.name}</span>
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <input
            type="number"
            value={customDonateAmount}
            onChange={(e) => setCustomDonateAmount(Math.max(10, Number(e.target.value)))}
            style={{
              width: '110px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              outline: 'none'
            }}
          />
          <button
            onClick={() => onAddDonation(currentNonProfit, customDonateAmount)}
            style={{
              background: 'var(--accent-emerald)',
              border: 'none',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <PlusCircle size={15} /> DONATE
          </button>
        </div>
      </div>

      {/* 3. QUICK ORGANIZATION SELECTOR TO DONATE TO OTHER INDEXED NON-PROFITS */}
      <div style={{ background: 'var(--bg-main)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
          <Building2 size={13} color="var(--accent-blue)" /> EXPLORE INDEXED ORGANIZATIONS ({allNonProfits.length})
        </span>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto' }}>
          {allNonProfits.slice(0, 12).map((np) => (
            <button
              key={np.id}
              onClick={() => onSelectNonProfit(np.id)}
              style={{
                background: np.id === currentNonProfit.id ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-card)',
                border: np.id === currentNonProfit.id ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                color: np.id === currentNonProfit.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: np.id === currentNonProfit.id ? 700 : 500
              }}
            >
              {np.name} ({np.overallScore}/10)
            </button>
          ))}
        </div>
      </div>

      {/* 4. RUNNING DONATION LEDGER TABLE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <h3 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calculator size={16} color="var(--accent-emerald)" /> Running Donation Ledger & Tax Receipts ({donations.length})
        </h3>

        {donations.length === 0 ? (
          <div style={{ background: 'var(--bg-main)', padding: '1.5rem', textAlign: 'center', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No donation pledges recorded yet. Select an organization and click "DONATE" to add to your running impact tab!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.55rem 0.4rem' }}>ORGANIZATION</th>
                  <th style={{ padding: '0.55rem 0.4rem' }}>SECTOR</th>
                  <th style={{ padding: '0.55rem 0.4rem' }}>AMOUNT</th>
                  <th style={{ padding: '0.55rem 0.4rem' }}>EST. TAX SAVINGS</th>
                  <th style={{ padding: '0.55rem 0.4rem' }}>FIELD IMPACT</th>
                  <th style={{ padding: '0.55rem 0.4rem' }}>DATE</th>
                  <th style={{ padding: '0.55rem 0.4rem', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((pledge) => (
                  <tr
                    key={pledge.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-main)' }}
                  >
                    <td style={{ padding: '0.55rem 0.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {pledge.nonprofitName}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                      {pledge.nteeCategory}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>
                      ${pledge.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                      +${pledge.estimatedTaxSavings.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.75rem' }}>
                      ~{pledge.quantifiableImpactUnits} {pledge.quantifiableImpactUnitName}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {pledge.pledgedAt}
                    </td>
                    <td style={{ padding: '0.55rem 0.4rem', textAlign: 'right' }}>
                      <button
                        onClick={() => onRemoveDonation(pledge.id)}
                        style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', padding: '2px' }}
                        title="Remove Pledge"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. PREFERENCES SUMMARY CARD */}
      <div style={{ background: 'var(--bg-main)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', fontSize: '0.78rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>MIN PROGRAM SPEND TARGET</span>
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.95rem' }}>&gt;= {preferences.minProgramSpendRatio}%</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>MAX CEO PAY CAP</span>
          <span style={{ color: 'var(--accent-indigo)', fontWeight: 700, fontSize: '0.95rem' }}>&lt;= ${(preferences.maxCeoPayThreshold / 1000000).toFixed(1)}M</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>MEMORY PERSISTENCE STATUS</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={13} color="var(--accent-emerald)" /> Vertex AI Instance Connected
          </span>
        </div>
      </div>
    </div>
  );
};
