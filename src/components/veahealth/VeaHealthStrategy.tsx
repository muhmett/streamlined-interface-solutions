import { useState, useEffect } from 'react';
import { markets, implementationPhases } from '@/data/veahealth-data';
import Header from './Header';
import MarketSelector from './MarketSelector';
import SectionNav from './SectionNav';
import Footer from './Footer';
import OverviewSection from './sections/OverviewSection';
import KeywordsSection from './sections/KeywordsSection';
import CrownInfoSection from './sections/CrownInfoSection';
import ContentSection from './sections/ContentSection';
import ImplementationSection from './sections/ImplementationSection';
import TechnicalSection from './sections/TechnicalSection';
import CompetitionSection from './sections/CompetitionSection';
import QuickWinsSection from './sections/QuickWinsSection';
import KPIsSection from './sections/KPIsSection';
import MediaBuyingSection from './sections/MediaBuyingSection';
import HairImplantSection from './sections/HairImplantSection';
import TrafficGrowthSection from './sections/TrafficGrowthSection';
import BudgetDashboardSection from './sections/BudgetDashboardSection';

const VeaHealthStrategy = () => {
  const [activeMarket, setActiveMarket] = useState('uk');
  const [activeSection, setActiveSection] = useState('overview');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [progress, setProgress] = useState({
    phase1: 15, phase2: 0, phase3: 0, phase4: 0, phase5: 0
  });

  const calculateProgress = (phaseId: number) => {
    const phase = implementationPhases.find(p => p.phase === phaseId);
    if (!phase) return 0;
    const completed = phase.tasks.filter(t => completedTasks.includes(t.id) || t.status === 'مكتمل').length;
    return Math.round((completed / phase.tasks.length) * 100);
  };

  useEffect(() => {
    setProgress({
      phase1: calculateProgress(1),
      phase2: calculateProgress(2),
      phase3: calculateProgress(3),
      phase4: calculateProgress(4),
      phase5: calculateProgress(5)
    });
  }, [completedTasks]);

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const currentMarket = markets[activeMarket];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <Header />
        <MarketSelector activeMarket={activeMarket} setActiveMarket={setActiveMarket} />
        <SectionNav 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          activeMarket={activeMarket}
          currentMarketColor={currentMarket.color}
        />

        {activeSection === 'overview' && <OverviewSection activeMarket={activeMarket} progress={progress} />}
        {activeSection === 'budget' && <BudgetDashboardSection />}
        {activeSection === 'traffic' && <TrafficGrowthSection />}
        {activeSection === 'mediabuy' && <MediaBuyingSection />}
        {activeSection === 'hairimplant' && <HairImplantSection />}
        {activeSection === 'keywords' && <KeywordsSection activeMarket={activeMarket} />}
        {activeSection === 'crowninfo' && <CrownInfoSection />}
        {activeSection === 'content' && <ContentSection />}
        {activeSection === 'implementation' && (
          <ImplementationSection progress={progress} completedTasks={completedTasks} toggleTaskCompletion={toggleTaskCompletion} />
        )}
        {activeSection === 'technical' && <TechnicalSection />}
        {activeSection === 'competition' && <CompetitionSection />}
        {activeSection === 'quickwins' && <QuickWinsSection />}
        {activeSection === 'kpis' && <KPIsSection />}

        <Footer />
      </div>
    </div>
  );
};

export default VeaHealthStrategy;
