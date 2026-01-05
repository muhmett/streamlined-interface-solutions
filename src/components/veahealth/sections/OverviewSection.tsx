import { TrendingUp, Users, BarChart3, Calendar } from 'lucide-react';
import { markets, implementationPhases, getColorClasses } from '@/data/veahealth-data';

interface OverviewSectionProps {
  activeMarket: string;
  progress: Record<string, number>;
}

const OverviewSection = ({ activeMarket, progress }: OverviewSectionProps) => {
  const currentMarket = markets[activeMarket];
  const cc = getColorClasses(currentMarket.color);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${cc.bgLight} border-r-4 ${cc.border} rounded-2xl p-6 col-span-2`}>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            {currentMarket.flag} {currentMarket.name}
            <span className="text-sm font-normal px-3 py-1 bg-background rounded-full">{currentMarket.priority} أولوية</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-foreground/80 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> بيانات السوق
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="font-medium">قيمة السوق</span>
                  <span className="font-bold">{currentMarket.value}</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="font-medium">توفير متوسط</span>
                  <span className="font-bold text-vea-green">{currentMarket.avgSaving}</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="font-medium">ميزانية SEO مخصصة</span>
                  <span className="font-bold">{currentMarket.budget}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground/80 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> نفسية المريض
              </h3>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-foreground/80">{currentMarket.psycho}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-foreground/80 mb-2">النهج المقترح</h4>
                <div className="p-3 bg-vea-blue-light rounded-lg text-foreground/80">
                  {currentMarket.name === 'المملكة المتحدة' && 'تركيز على الشفافية + المخاطر + الشهادات'}
                  {currentMarket.name === 'أوروبا' && 'تركيز على القرب + معايير الجودة الأوروبية'}
                  {currentMarket.name === 'الشرق الأوسط' && 'تركيز على الرفاهية + VIP + التكنولوجيا'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            التقدم العام
          </h3>
          <div className="space-y-4">
            {implementationPhases.map(phase => {
              const phaseCC = getColorClasses(phase.color);
              return (
                <div key={phase.phase}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{phase.title}</span>
                    <span className="font-bold">{progress[`phase${phase.phase}`]}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${phaseCC.bg}`}
                      style={{ width: `${progress[`phase${phase.phase}`]}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-bold">المكتمل كلياً</span>
              <span className="text-2xl font-bold text-vea-blue">
                {Math.round((progress.phase1 + progress.phase2 + progress.phase3 + progress.phase4 + progress.phase5) / 5)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-vea-blue-light to-vea-green-light rounded-2xl shadow-card p-6 border border-vea-blue/20">
        <h3 className="text-xl font-bold mb-4">استراتيجية VeaHealth العامة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background rounded-xl p-5 border-r-4 border-vea-blue shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-vea-blue-light text-vea-blue flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-vea-blue">المرحلة 1: بريطانيا (الأشهر 1-4)</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">تركيز على "مشاكل الأسنان في تركيا" + الثقة. 70% موارد بريطانيا = أكبر سوق.</p>
          </div>
          <div className="bg-background rounded-xl p-5 border-r-4 border-vea-green shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-vea-green-light text-vea-green flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-vea-green">المرحلة 2: أوروبا (الأشهر 5-8)</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">تعدد اللغات. ترجمة + تكيف محلي. 20% موارد.</p>
          </div>
          <div className="bg-background rounded-xl p-5 border-r-4 border-vea-purple shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-vea-purple-light text-vea-purple flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-vea-purple">المرحلة 3: الشرق الأوسط (الأشهر 7-12)</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">تجربة VIP فاخرة. محتوى عربي. 10% موارد.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
