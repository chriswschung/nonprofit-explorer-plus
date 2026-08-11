import React, { useState, useRef, useEffect } from 'react';
import { Search, Database, X, Globe, Loader2 } from 'lucide-react';
import type { NonProfitData } from '../types/nonprofit';
import { searchProPublicaLive, fetchProPublicaOrgByEin, type ProPublicaOrgSummary } from '../services/propublicaApi';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalOrganizationsCount: number;
  allNonProfits: NonProfitData[];
  onSelectNonProfit: (id: string) => void;
  onAddLiveNonProfit?: (np: NonProfitData) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  totalOrganizationsCount,
  allNonProfits,
  onSelectNonProfit,
  onAddLiveNonProfit
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<'local' | 'live'>('local');
  const [liveResults, setLiveResults] = useState<ProPublicaOrgSummary[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live ProPublica search results if in live mode
  useEffect(() => {
    if (searchMode === 'live' && searchTerm.trim().length >= 3) {
      setIsLoadingLive(true);
      const timer = setTimeout(async () => {
        const results = await searchProPublicaLive(searchTerm);
        setLiveResults(results.slice(0, 8));
        setIsLoadingLive(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setLiveResults([]);
      setIsLoadingLive(false);
    }
  }, [searchTerm, searchMode]);

  // Local search results limit 8
  const displayLocalResults = searchTerm.trim()
    ? allNonProfits.filter(
        (np) =>
          np.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          np.ein.includes(searchTerm) ||
          np.nteeCategory.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8)
    : allNonProfits.slice(0, 6);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${(val / 1000).toFixed(0)}K`;
  };

  const handleSelectLive = async (summary: ProPublicaOrgSummary) => {
    setIsLoadingLive(true);
    const liveNp = await fetchProPublicaOrgByEin(summary.strein);
    setIsLoadingLive(false);
    if (liveNp) {
      if (onAddLiveNonProfit) onAddLiveNonProfit(liveNp);
      onSelectNonProfit(liveNp.id);
      setIsDropdownOpen(false);
      setSearchTerm(liveNp.name);
    }
  };

  return (
    <header
      style={{
        padding: '0.85rem 1.5rem',
        background: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 50
      }}
    >
      {/* Flush, Clean Search Box Container */}
      <div ref={containerRef} style={{ flex: 1, maxWidth: '680px', position: 'relative' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={16}
            color={searchMode === 'live' ? 'var(--accent-emerald)' : 'var(--accent-blue)'}
            style={{ position: 'absolute', left: '12px', pointerEvents: 'none', zIndex: 2 }}
          />

          <input
            type="text"
            placeholder={
              searchMode === 'live'
                ? 'Type name or EIN to query live online IRS 990 filings (ProPublica API)...'
                : 'Search 300+ nonprofits by name, EIN, or sector...'
            }
            value={searchTerm}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsDropdownOpen(false);
            }}
            style={{
              width: '100%',
              background: 'rgba(11, 15, 25, 0.95)',
              border: isDropdownOpen
                ? searchMode === 'live' ? '1px solid var(--accent-emerald)' : '1px solid var(--accent-blue)'
                : '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '0.6rem 8.5rem 0.6rem 2.4rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
              boxShadow: isDropdownOpen ? '0 0 12px rgba(56, 189, 248, 0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          />

          {/* Mode Toggle inside search box */}
          <div style={{ position: 'absolute', right: '35px', display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: '6px' }}>
            <button
              onClick={() => setSearchMode('local')}
              style={{
                background: searchMode === 'local' ? 'var(--accent-blue)' : 'transparent',
                color: searchMode === 'local' ? '#000' : 'var(--text-muted)',
                border: 'none',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Local Pre-Indexed Dataset"
            >
              <Database size={11} /> Dataset
            </button>
            <button
              onClick={() => setSearchMode('live')}
              style={{
                background: searchMode === 'live' ? 'var(--accent-emerald)' : 'transparent',
                color: searchMode === 'live' ? '#000' : 'var(--text-muted)',
                border: 'none',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Query Live ProPublica IRS 990 API Online"
            >
              <Globe size={11} /> Live API
            </button>
          </div>

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setIsDropdownOpen(true);
              }}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Floating Autocomplete Overlay - zIndex 9999 */}
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(16px)',
              border: searchMode === 'live' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--accent-blue-border)',
              borderRadius: '10px',
              padding: '0.5rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
              zIndex: 9999,
              maxHeight: '380px',
              overflowY: 'auto'
            }}
          >
            {/* Header label */}
            <div
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: searchMode === 'live' ? 'var(--accent-emerald)' : 'var(--accent-blue)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '0.35rem'
              }}
            >
              <span>{searchMode === 'live' ? '🌐 Live IRS 990 API Results (ProPublica Online)' : '📊 Indexed Nonprofits'}</span>
              <span>{searchMode === 'live' ? `${liveResults.length} live records` : `${displayLocalResults.length} matching`}</span>
            </div>

            {isLoadingLive && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Loader2 size={16} className="animate-spin" color="var(--accent-emerald)" />
                Fetching live Form 990 online data from ProPublica API...
              </div>
            )}

            {/* LIVE MODE RESULTS */}
            {searchMode === 'live' && !isLoadingLive && (
              <>
                {liveResults.length === 0 ? (
                  <div style={{ padding: '0.85rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {searchTerm.length < 3 ? 'Type at least 3 characters to query live online IRS 990 API...' : 'No online organizations found on ProPublica API for this query.'}
                  </div>
                ) : (
                  liveResults.map((org) => (
                    <div
                      key={org.ein}
                      onClick={() => handleSelectLive(org)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {org.name}
                          <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', padding: '1px 5px', borderRadius: '4px' }}>
                            EIN {org.strein}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          📍 {org.city}, {org.state} • NTEE: {org.ntee_code || '501(c)(3)'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                        Fetch 990 &rarr;
                      </span>
                    </div>
                  ))
                )}
              </>
            )}

            {/* LOCAL MODE RESULTS */}
            {searchMode === 'local' && (
              displayLocalResults.map((np) => (
                <div
                  key={np.id}
                  onClick={() => {
                    onSelectNonProfit(np.id);
                    setIsDropdownOpen(false);
                    setSearchTerm(np.name);
                  }}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {np.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {np.nteeCategory} • EIN {np.ein}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      {formatCurrency(np.totalRevenue)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                      Score: {np.overallScore}/10
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Global Org Counter & Live API Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--accent-blue)'
          }}
        >
          <Database size={13} color="var(--accent-blue)" />
          <span>{totalOrganizationsCount} Organizations Pre-Indexed</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--accent-emerald)'
          }}
        >
          <Globe size={13} color="var(--accent-emerald)" />
          <span>ProPublica Live IRS API Ready</span>
        </div>
      </div>
    </header>
  );
};
