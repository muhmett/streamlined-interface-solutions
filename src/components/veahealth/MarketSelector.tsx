import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { markets, getColorClasses, Market } from '@/data/veahealth-data';

interface MarketSelectorProps {
  activeMarket: string;
  setActiveMarket: (market: string) => void;
}

const MarketSelector = ({ activeMarket, setActiveMarket }: MarketSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {Object.entries(markets).map(([key, market]) => {
        const marketCC = getColorClasses(market.color);
        return (
          <button
            key={key}
            onClick={() => setActiveMarket(key)}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
              activeMarket === key
                ? `${marketCC.bg} text-primary-foreground shadow-elevated scale-105 border-transparent`
                : 'bg-card text-card-foreground hover:shadow-card border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{market.flag}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeMarket === key 
                  ? 'bg-background/20' 
                  : `${marketCC.bgLight} ${marketCC.text}`
              }`}>
                {market.priority} أولوية
              </span>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold mb-2">{market.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 justify-end">
                  <DollarSign className="w-4 h-4" />
                  <span>الميزانية: {market.budget}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <TrendingUp className="w-4 h-4" />
                  <span>{market.value}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Users className="w-4 h-4" />
                  <span>نفسية المريض: {market.psycho}</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MarketSelector;
