import { 
  TrendingUp, Globe, Search, Eye, MousePointer, 
  BarChart3, ArrowUpRight, Target, Calendar, CheckCircle2
} from 'lucide-react';
import { getColorClasses } from '@/data/veahealth-data';

const trafficGoals = [
  { period: 'الشهر 1-3', organic: '0 → 5K', paid: '2K → 8K', total: '10-13K', growth: '+∞' },
  { period: 'الشهر 4-6', organic: '5K → 15K', paid: '8K → 15K', total: '25-30K', growth: '+150%' },
  { period: 'الشهر 7-9', organic: '15K → 30K', paid: '15K → 20K', total: '45-50K', growth: '+70%' },
  { period: 'الشهر 10-12', organic: '30K → 50K', paid: '20K → 25K', total: '70-75K', growth: '+50%' }
];

const googleRankingPlan = [
  { keyword: 'dental crowns turkey', current: '-', target3m: 'Top 20', target6m: 'Top 10', target12m: 'Top 3' },
  { keyword: 'hair transplant turkey', current: '-', target3m: 'Top 30', target6m: 'Top 15', target12m: 'Top 5' },
  { keyword: 'turkey teeth', current: '-', target3m: 'Top 20', target6m: 'Top 10', target12m: 'Top 5' },
  { keyword: 'veneers turkey price', current: '-', target3m: 'Top 25', target6m: 'Top 10', target12m: 'Top 3' },
  { keyword: 'dental implants turkey uk', current: '-', target3m: 'Top 20', target6m: 'Top 8', target12m: 'Top 3' },
  { keyword: 'hollywood smile turkey', current: '-', target3m: 'Top 15', target6m: 'Top 5', target12m: 'Top 3' }
];

const seoActions = [
  { action: 'تحسين Core Web Vitals', impact: 'حرج', timeline: 'أسبوع 1-2', status: 'للعمل' },
  { action: 'إنشاء 50+ صفحة محسنة', impact: 'عالي', timeline: 'شهر 1-3', status: 'للعمل' },
  { action: 'بناء 100+ باكلينك DR40+', impact: 'عالي', timeline: 'شهر 1-12', status: 'مستمر' },
  { action: 'Schema Markup كامل', impact: 'متوسط', timeline: 'أسبوع 1-4', status: 'للعمل' },
  { action: 'محتوى مدونة 3x/أسبوع', impact: 'عالي', timeline: 'مستمر', status: 'للعمل' },
  { action: 'تحسين صور + Alt tags', impact: 'متوسط', timeline: 'أسبوع 1-2', status: 'للعمل' }
];

const reachChannels = [
  { channel: 'Google Search (SEO)', reach: '50K+/شهر', cost: 'طويل المدى', quality: 'ممتاز', icon: <Search className="w-5 h-5" /> },
  { channel: 'Google Ads', reach: '30K+/شهر', cost: '$1,500/شهر', quality: 'ممتاز', icon: <Target className="w-5 h-5" /> },
  { channel: 'Meta Ads (FB+IG)', reach: '100K+/شهر', cost: '$2,000/شهر', quality: 'جيد', icon: <Eye className="w-5 h-5" /> },
  { channel: 'Instagram Organic', reach: '20K+/شهر', cost: 'مجاني', quality: 'جيد', icon: <MousePointer className="w-5 h-5" /> }
];

const TrafficGrowthSection = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-vea-blue via-vea-green to-vea-purple rounded-2xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              نمو الزيارات والوصول 2026
            </h2>
            <p className="text-white/80 mt-1">veahealthturkey.com | Google Search | SEO + Paid</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">0 → 75K</p>
              <p className="text-sm opacity-80">زيارات/شهر</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">Top 3</p>
              <p className="text-sm opacity-80">كلمات رئيسية</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">DR50+</p>
              <p className="text-sm opacity-80">Domain Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Growth Timeline */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-vea-blue" />
          خطة نمو الزيارات (12 شهر)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-3 font-bold">الفترة</th>
                <th className="text-center p-3 font-bold">زيارات عضوية</th>
                <th className="text-center p-3 font-bold">زيارات مدفوعة</th>
                <th className="text-center p-3 font-bold">المجموع</th>
                <th className="text-center p-3 font-bold">النمو</th>
              </tr>
            </thead>
            <tbody>
              {trafficGoals.map((goal, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-3 font-bold">{goal.period}</td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-green-light text-vea-green px-2 py-1 rounded-full text-xs">{goal.organic}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-blue-light text-vea-blue px-2 py-1 rounded-full text-xs">{goal.paid}</span>
                  </td>
                  <td className="p-3 text-center font-bold text-vea-purple">{goal.total}</td>
                  <td className="p-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-vea-green font-bold">
                      <ArrowUpRight className="w-4 h-4" />
                      {goal.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Ranking Plan */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-vea-green" />
          خطة الترتيب في Google
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-3 font-bold">الكلمة المفتاحية</th>
                <th className="text-center p-3 font-bold">الحالي</th>
                <th className="text-center p-3 font-bold">3 أشهر</th>
                <th className="text-center p-3 font-bold">6 أشهر</th>
                <th className="text-center p-3 font-bold">12 شهر</th>
              </tr>
            </thead>
            <tbody>
              {googleRankingPlan.map((kw, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-3 font-medium">{kw.keyword}</td>
                  <td className="p-3 text-center text-muted-foreground">{kw.current}</td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-orange-light text-vea-orange px-2 py-1 rounded-full text-xs">{kw.target3m}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-blue-light text-vea-blue px-2 py-1 rounded-full text-xs">{kw.target6m}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-green-light text-vea-green px-2 py-1 rounded-full text-xs font-bold">{kw.target12m}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Actions & Reach Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Actions */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-vea-green" />
            إجراءات SEO الرئيسية
          </h3>
          <div className="space-y-3">
            {seoActions.map((action, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    action.impact === 'حرج' ? 'bg-vea-red' : 
                    action.impact === 'عالي' ? 'bg-vea-orange' : 'bg-vea-blue'
                  }`} />
                  <span className="font-medium text-sm">{action.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{action.timeline}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    action.status === 'للعمل' ? 'bg-vea-orange-light text-vea-orange' :
                    action.status === 'مستمر' ? 'bg-vea-blue-light text-vea-blue' :
                    'bg-vea-green-light text-vea-green'
                  }`}>{action.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reach Channels */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-vea-purple" />
            قنوات الوصول
          </h3>
          <div className="space-y-3">
            {reachChannels.map((channel, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-vea-blue-light text-vea-blue flex items-center justify-center">
                    {channel.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{channel.channel}</p>
                    <p className="text-xs text-muted-foreground">{channel.cost}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-vea-blue">{channel.reach}</p>
                  <p className={`text-xs ${
                    channel.quality === 'ممتاز' ? 'text-vea-green' : 'text-vea-orange'
                  }`}>جودة {channel.quality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Website Optimization Checklist */}
      <div className="bg-gradient-to-r from-vea-blue-light to-vea-green-light rounded-2xl p-6 border border-vea-blue/20">
        <h3 className="text-lg font-bold mb-4">veahealthturkey.com - قائمة التحسينات</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background rounded-xl p-4">
            <h4 className="font-bold text-vea-blue mb-3">السرعة</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> LCP أقل من 2.5s</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> FID أقل من 100ms</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> CLS أقل من 0.1</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> PageSpeed 90+</li>
            </ul>
          </div>
          <div className="bg-background rounded-xl p-4">
            <h4 className="font-bold text-vea-green mb-3">الجوال</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Mobile-first design</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Touch-friendly CTAs</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Fast mobile loading</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Click-to-call buttons</li>
            </ul>
          </div>
          <div className="bg-background rounded-xl p-4">
            <h4 className="font-bold text-vea-purple mb-3">🔍 SEO</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Meta titles optimized</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Schema markup</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Internal linking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> XML sitemap</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficGrowthSection;
