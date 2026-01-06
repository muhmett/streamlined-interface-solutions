import React from 'react';
import { 
  Target, Search, FileText, Calendar, Settings, 
  Activity, Zap, BarChart3, DollarSign, Sparkles, TrendingUp, PieChart
} from 'lucide-react';
import { allKeywords, contentPillars, technicalSEO, quickWins, dentalCrownInfo, getColorClasses, ColorType } from '@/data/veahealth-data';

interface SectionNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeMarket: string;
  currentMarketColor: ColorType;
}

const SectionNav = ({ activeSection, setActiveSection, activeMarket, currentMarketColor }: SectionNavProps) => {
  const cc = getColorClasses(currentMarketColor);
  
  const sections = [
    { id: 'overview', label: 'نظرة عامة', icon: <Target />, count: null },
    { id: 'budget', label: 'الميزانية', icon: <PieChart />, count: null },
    { id: 'traffic', label: 'النمو والزيارات', icon: <TrendingUp />, count: null },
    { id: 'mediabuy', label: 'Meta Ads', icon: <DollarSign />, count: 3 },
    { id: 'hairimplant', label: 'زراعة الشعر', icon: <Sparkles />, count: 4 },
    { id: 'keywords', label: 'كلمات مفتاحية', icon: <Search />, count: allKeywords[activeMarket]?.length || 0 },
    { id: 'crowninfo', label: 'تيجان الأسنان', icon: <Target />, count: dentalCrownInfo.types.length },
    { id: 'content', label: 'محتوى', icon: <FileText />, count: contentPillars.length },
    { id: 'implementation', label: 'خطة 12 شهر', icon: <Calendar />, count: 5 },
    { id: 'technical', label: 'SEO تقني', icon: <Settings />, count: technicalSEO.length },
    { id: 'competition', label: 'منافسة', icon: <Activity />, count: 3 },
    { id: 'quickwins', label: 'انتصارات سريعة', icon: <Zap />, count: quickWins.length },
    { id: 'kpis', label: 'KPIs', icon: <BarChart3 />, count: 6 }
  ];

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-3 scrollbar-hide">
      {sections.map(section => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all relative ${
            activeSection === section.id
              ? `${cc.bg} text-primary-foreground shadow-lg`
              : 'bg-card text-muted-foreground hover:bg-muted hover:shadow-md'
          }`}
        >
          {React.cloneElement(section.icon, { className: 'w-5 h-5' })}
          {section.label}
          {section.count !== null && (
            <span className={`absolute -top-2 -right-2 text-xs font-bold px-2 py-1 rounded-full ${
              activeSection === section.id 
                ? 'bg-background text-vea-blue' 
                : 'bg-vea-blue-light text-vea-blue'
            }`}>
              {section.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SectionNav;
