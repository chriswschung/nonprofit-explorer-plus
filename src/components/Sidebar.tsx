import React from 'react';
import { Building2, Layers, Award, Activity, Users, Calculator, Bookmark, ShieldCheck, ChevronRight, Sliders } from 'lucide-react';
import type { NonProfitData } from '../types/nonprofit';

interface SidebarProps {
  activeTab: 'sector' | 'scorecard' | 'architect' | 'risk' | 'agents' | 'calculator' | 'memory';
  setActiveTab: (tab: 'sector' | 'scorecard' | 'architect' | 'risk' | 'agents' | 'calculator' | 'memory') => void;
  currentNonProfit: NonProfitData;
  allNonProfits: NonProfitData[];
  onSelectNonProfit: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentNonProfit,
  allNonProfits,
  onSelectNonProfit
}) => {
  const navItems = [
    { id: 'sector', label: 'Sector Overview & Chart', icon: Layers, accent: '#38bdf8' },
    { id: 'scorecard', label: 'Balanced 990 Scorecard', icon: Award, accent: '#10b981' },
    { id: 'architect', label: 'Scorecard Architect Agent', icon: Sliders, accent: '#38bdf8' },
    { id: 'risk', label: '990 Governance Risk Radar', icon: Activity, accent: '#f43f5e' },
    { id: 'agents', label: 'Multi-Agent Debate Panel', icon: Users, accent: '#818cf8' },
    { id: 'calculator', label: 'Impact Allocation Calculator', icon: Calculator, accent: '#f59e0b' },
    { id: 'memory', label: 'Donor Portfolio & Memory', icon: Bookmark, accent: '#fbbf24' }
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${(val / 1000).toFixed(0)}K`;
  };

  return (
    <aside
      style={{
        width: '280px',
        minWidth: '280px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1.25rem 1rem',
        minHeight: '100vh'
      }}
    >
      {/* 1. App Title & Branding */}
      <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Building2 size={20} color="#38bdf8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800, letterSpacing: '-0.3px' }}>
              NonProfit<span style={{ color: 'var(--accent-blue)' }}>Explorer</span>
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={12} color="var(--accent-emerald)" /> Form 990 Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, paddingLeft: '0.5rem', marginBottom: '0.2rem' }}>
          NAVIGATION
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Icon size={17} color={isActive ? item.accent : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} color="var(--accent-blue)" />}
            </button>
          );
        })}
      </div>

      {/* 3. Active 990 Profile Card & Selector */}
      <div
        className="glass-card"
        style={{
          padding: '0.9rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}
      >
        <span style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
          ACTIVE 990 PROFILE
        </span>

        <select
          value={currentNonProfit.id}
          onChange={(e) => {
            onSelectNonProfit(e.target.value);
            setActiveTab('scorecard');
          }}
          style={{
            width: '100%',
            background: 'var(--bg-main)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.45rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {allNonProfits.map((np) => (
            <option key={np.id} value={np.id} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              {np.name} ({np.nteeCategory})
            </option>
          ))}
        </select>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
          <span>Revenue: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(currentNonProfit.totalRevenue)}</strong></span>
          <span>Score: <strong style={{ color: 'var(--accent-emerald)' }}>{currentNonProfit.overallScore}/10</strong></span>
        </div>
      </div>
    </aside>
  );
};
