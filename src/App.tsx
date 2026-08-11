import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LeftPane } from './components/LeftPane';
import { RightPane } from './components/RightPane';
import { PeerComparisonModal } from './components/PeerComparisonModal';
import { RiskRadar } from './components/RiskRadar';
import { MultiAgentDebatePanel } from './components/MultiAgentDebatePanel';
import { ImpactCalculator } from './components/ImpactCalculator';
import { DonorMemoryPortfolio } from './components/DonorMemoryPortfolio';
import { SectorOverview } from './components/SectorOverview';
import { ScorecardArchitect } from './components/ScorecardArchitect';
import { allNonProfits } from './data/mock990Data';
import type { DonationPledge, NonProfitData } from './types/nonprofit';
import confetti from 'canvas-confetti';

export function App() {
  const [nonprofitsList, setNonprofitsList] = useState<NonProfitData[]>(allNonProfits);
  const [selectedId, setSelectedId] = useState<string>('wwf');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isPeerModalOpen, setIsPeerModalOpen] = useState<boolean>(false);

  const handleAddLiveNonProfit = (liveNp: NonProfitData) => {
    setNonprofitsList((prev) => {
      if (prev.some((item) => item.id === liveNp.id || item.ein === liveNp.ein)) {
        return prev;
      }
      return [liveNp, ...prev];
    });
  };

  // Default starting view: Sector Overview & Bubble Chart
  const [activeTab, setActiveTab] = useState<'sector' | 'scorecard' | 'architect' | 'risk' | 'agents' | 'calculator' | 'memory'>('sector');

  // Running Donation Ledger & Memory Bank Tab State
  const [donations, setDonations] = useState<DonationPledge[]>([
    {
      id: 'pledge-1',
      nonprofitId: 'wwf',
      nonprofitName: 'World Wildlife Fund (WWF)',
      nteeCategory: 'Environment & Wildlife',
      amount: 1000,
      estimatedTaxSavings: 350,
      quantifiableImpactUnits: 14,
      quantifiableImpactUnitName: 'Anti-poaching ranger patrol hours',
      pledgedAt: 'Today at 10:15 AM'
    },
    {
      id: 'pledge-2',
      nonprofitId: 'msf',
      nonprofitName: 'Doctors Without Borders (MSF)',
      nteeCategory: 'International Relief & Humanitarian',
      amount: 2500,
      estimatedTaxSavings: 875,
      quantifiableImpactUnits: 625,
      quantifiableImpactUnitName: 'Emergency field medical treatments',
      pledgedAt: 'Yesterday at 3:40 PM'
    }
  ]);

  const handleAddDonation = (nonprofit: NonProfitData, amount: number) => {
    const units = Math.round((amount / 1000) * nonprofit.impactPer1000Dollars * 10) / 10;
    const taxSavings = Math.round(amount * 0.35); // 35% estimated deduction

    const newPledge: DonationPledge = {
      id: `pledge-${Date.now()}`,
      nonprofitId: nonprofit.id,
      nonprofitName: nonprofit.name,
      nteeCategory: nonprofit.nteeCategory,
      amount,
      estimatedTaxSavings: taxSavings,
      quantifiableImpactUnits: units,
      quantifiableImpactUnitName: nonprofit.quantifiableImpactUnit,
      pledgedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDonations((prev) => [newPledge, ...prev]);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.7 } });
  };

  const handleRemoveDonation = (id: string) => {
    setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  // Filter Categories across all 10 sectors
  const categories = [
    'All',
    'Environment & Wildlife',
    'Health & Medical Research',
    'Education & Learning Technology',
    'Human Services & Food Banks',
    'International Relief & Humanitarian',
    'Arts, Culture & Humanities',
    'Civil Rights & Social Justice',
    'Youth & Child Development',
    'Animal Welfare & Shelters',
    'Science & Technology Research'
  ];

  // Filter Nonprofits based on Search & Category
  const filteredNonProfits = nonprofitsList.filter((np) => {
    const matchesSearch =
      np.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      np.ein.includes(searchTerm) ||
      np.nteeCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || np.nteeCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Current Selected NonProfit Data
  const currentNonProfit = nonprofitsList.find((np) => np.id === selectedId) || filteredNonProfits[0] || nonprofitsList[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* 1. Dignified Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentNonProfit={currentNonProfit}
        allNonProfits={nonprofitsList}
        onSelectNonProfit={(id: string) => {
          setSelectedId(id);
          setActiveTab('scorecard');
        }}
      />

      {/* 2. Main Work Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Search Bar Header */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalOrganizationsCount={nonprofitsList.length}
          allNonProfits={nonprofitsList}
          onSelectNonProfit={(id: string) => {
            setSelectedId(id);
            setActiveTab('scorecard');
          }}
          onAddLiveNonProfit={handleAddLiveNonProfit}
        />

        {/* Dynamic Workspace Body */}
        <main style={{ padding: '1.25rem 1rem 3rem 1rem', flex: 1 }}>
          {/* View 1: Sector Overview & Bubble Chart */}
          {activeTab === 'sector' && (
            <SectorOverview
              allNonProfits={nonprofitsList}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              onSelectNonProfit={(id: string) => setSelectedId(id)}
              onViewScorecard={(id: string) => {
                setSelectedId(id);
                setActiveTab('scorecard');
              }}
            />
          )}

          {/* View 2: Balanced 6-Dimensional Scorecard */}
          {activeTab === 'scorecard' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '1.25rem',
                alignItems: 'start'
              }}
            >
              <LeftPane
                nonprofit={currentNonProfit}
                onSelectPeer={(peerId: string) => setSelectedId(peerId)}
                onOpenPeerModal={() => setIsPeerModalOpen(true)}
              />

              <RightPane
                nonprofit={currentNonProfit}
              />
            </div>
          )}

          {/* View 3: Scorecard Architect Agent */}
          {activeTab === 'architect' && (
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <ScorecardArchitect
                nonprofit={currentNonProfit}
                allNonProfits={nonprofitsList}
                onSelectNonProfit={(id: string) => setSelectedId(id)}
              />
            </div>
          )}

          {/* View 4: 990 Governance Risk Radar */}
          {activeTab === 'risk' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <RiskRadar nonprofit={currentNonProfit} />
            </div>
          )}

          {/* View 5: Multi-Agent Debate Panel */}
          {activeTab === 'agents' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <MultiAgentDebatePanel nonprofit={currentNonProfit} />
            </div>
          )}

          {/* View 6: Impact Allocation Calculator */}
          {activeTab === 'calculator' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <ImpactCalculator
                nonprofit={currentNonProfit}
                onAddDonation={handleAddDonation}
              />
            </div>
          )}

          {/* View 7: Vertex AI Donor Memory Portfolio */}
          {activeTab === 'memory' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <DonorMemoryPortfolio
                currentNonProfit={currentNonProfit}
                allNonProfits={allNonProfits}
                onSelectNonProfit={(id: string) => setSelectedId(id)}
                donations={donations}
                onAddDonation={handleAddDonation}
                onRemoveDonation={handleRemoveDonation}
              />
            </div>
          )}
        </main>
      </div>

      {/* Peer Benchmarking Side-by-Side Modal */}
      {isPeerModalOpen && (
        <PeerComparisonModal
          nonprofit={currentNonProfit}
          onClose={() => setIsPeerModalOpen(false)}
          onSelectPeer={(peerId: string) => setSelectedId(peerId)}
        />
      )}
    </div>
  );
}
