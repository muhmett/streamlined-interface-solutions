import { 
  Facebook, Instagram, DollarSign, Target, TrendingUp, 
  Users, Eye, MousePointer, Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';
import { getColorClasses } from '@/data/veahealth-data';

interface AdCampaign {
  platform: string;
  icon: React.ReactNode;
  objective: string;
  budget: string;
  audience: string;
  placement: string[];
  kpis: string[];
  tips: string[];
  color: 'blue' | 'purple' | 'gold' | 'green';
}

const adCampaigns: AdCampaign[] = [
  {
    platform: 'Facebook Ads',
    icon: <Facebook className="w-6 h-6" />,
    objective: 'Lead Generation + Awareness',
    budget: '$600/شهر',
    audience: 'UK, Germany, France, UAE - 25-55 سنة',
    placement: ['News Feed', 'Stories', 'Marketplace', 'Video Feeds'],
    kpis: ['CPL: $15-25', 'CTR: 2-4%', 'Reach: 50K+/شهر', 'Leads: 30-50/شهر'],
    tips: [
      'فيديوهات قبل/بعد (15-30 ثانية)',
      'تجارب مرضى حقيقية',
      'Carousel مع مقارنة أسعار',
      'Retargeting زوار الموقع'
    ],
    color: 'blue'
  },
  {
    platform: 'Instagram Ads',
    icon: <Instagram className="w-6 h-6" />,
    objective: 'Brand Awareness + Engagement',
    budget: '$700/شهر',
    audience: 'UAE, Saudi, UK - 25-45 سنة - نساء 60%',
    placement: ['Reels', 'Stories', 'Feed', 'Explore'],
    kpis: ['Engagement: 5%+', 'Reach: 80K+/شهر', 'Profile Visits: 5K+', 'Leads: 40-60/شهر'],
    tips: [
      'Reels Hollywood Smile transformations',
      'Stories عروض محدودة',
      'UGC من المرضى',
      'Influencer partnerships micro (5-50K)'
    ],
    color: 'purple'
  },
  {
    platform: 'Meta Retargeting',
    icon: <Target className="w-6 h-6" />,
    objective: 'Conversion + Nurturing',
    budget: '$400/شهر',
    audience: 'زوار الموقع + Engaged Users',
    placement: ['Facebook + Instagram combined'],
    kpis: ['ROAS: 3-5x', 'Conversion Rate: 8-12%', 'Cost per Conversion: $30-50'],
    tips: [
      'Dynamic ads لزوار صفحات محددة',
      'Abandoned form retargeting',
      'Lookalike audiences من العملاء',
      'Testimonial ads للتردد'
    ],
    color: 'gold'
  }
];

const monthlyBudgetBreakdown = [
  { category: 'Facebook Ads', amount: 600, percentage: 30 },
  { category: 'Instagram Ads', amount: 700, percentage: 35 },
  { category: 'Retargeting', amount: 400, percentage: 20 },
  { category: 'Creative Production', amount: 200, percentage: 10 },
  { category: 'Testing & Optimization', amount: 100, percentage: 5 }
];

const adCalendar = [
  { week: 'الأسبوع 1', focus: 'Awareness', campaigns: ['Video ads introduction', 'Carousel services'], budget: '$400' },
  { week: 'الأسبوع 2', focus: 'Engagement', campaigns: ['Reels transformations', 'Stories testimonials'], budget: '$500' },
  { week: 'الأسبوع 3', focus: 'Consideration', campaigns: ['Lead forms', 'Website traffic'], budget: '$550' },
  { week: 'الأسبوع 4', focus: 'Conversion', campaigns: ['Retargeting hot leads', 'Promo offers'], budget: '$550' }
];

const MediaBuyingSection = () => {
  return (
    <div className="space-y-6">
      {/* Header with Budget Overview */}
      <div className="bg-gradient-to-r from-vea-blue via-vea-purple to-vea-gold rounded-2xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              استراتيجية Media Buying 2026
            </h2>
            <p className="text-white/80 mt-1">Meta Ads: Facebook + Instagram - Budget أقل من $2,000/شهر</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">$2,000</p>
              <p className="text-sm opacity-80">ميزانية شهرية</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">100-150</p>
              <p className="text-sm opacity-80">Leads متوقعة</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">3-5x</p>
              <p className="text-sm opacity-80">ROAS متوقع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-vea-blue" />
          توزيع الميزانية الشهرية ($2,000)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {monthlyBudgetBreakdown.map((item, idx) => (
            <div key={idx} className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-vea-blue">${item.amount}</p>
              <p className="text-sm text-muted-foreground">{item.category}</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full bg-vea-blue"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {adCampaigns.map((campaign, idx) => {
          const cc = getColorClasses(campaign.color);
          return (
            <div key={idx} className={`bg-card rounded-2xl shadow-card p-6 border-t-4 ${cc.border}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${cc.bgLight} ${cc.text} flex items-center justify-center`}>
                  {campaign.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{campaign.platform}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.objective}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">الميزانية</span>
                  <span className={`font-bold ${cc.text}`}>{campaign.budget}</span>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" /> الجمهور
                  </p>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">{campaign.audience}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Placements
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.placement.map((p, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded-full ${cc.bgLight} ${cc.text}`}>{p}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> KPIs المتوقعة
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {campaign.kpis.map((kpi, i) => (
                      <span key={i} className="text-xs p-2 bg-muted/50 rounded-lg text-center">{kpi}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-vea-green" /> نصائح
                  </p>
                  <ul className="space-y-1">
                    {campaign.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${cc.bg} mt-1.5`} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Calendar */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-vea-purple" />
          التقويم الشهري للحملات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {adCalendar.map((week, idx) => (
            <div key={idx} className="bg-muted/50 rounded-xl p-4 border-r-4 border-vea-purple">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold">{week.week}</h4>
                <span className="text-sm font-bold text-vea-blue">{week.budget}</span>
              </div>
              <p className="text-sm text-vea-purple font-medium mb-2">{week.focus}</p>
              <ul className="space-y-1">
                {week.campaigns.map((c, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <MousePointer className="w-3 h-3" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-vea-green-light border border-vea-green/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-vea-green mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            أفضل الممارسات
          </h3>
          <ul className="space-y-3">
            {[
              'ابدأ بميزانية صغيرة ($500) للاختبار قبل التوسع',
              'استخدم Pixel Facebook للتتبع الدقيق',
              'أنشئ Custom Audiences من زوار الموقع',
              'اختبر A/B للصور والنصوص باستمرار',
              'ركز على الفيديو (أعلى engagement)',
              'Retarget خلال 7 أيام من الزيارة'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-vea-green mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-vea-orange-light border border-vea-orange/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-vea-orange mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            تجنب هذه الأخطاء
          </h3>
          <ul className="space-y-3">
            {[
              'لا تستهدف جمهور واسع جداً (ضيّق)',
              'لا تهمل الـ Landing Page (سرعة + CTA)',
              'لا تستخدم صور مخزنة (استخدم حقيقية)',
              'لا تتوقف عن الاختبار والتحسين',
              'لا تنسى متابعة Leads بسرعة (< 5 دقائق)',
              'لا تستخدم نفس الإعلان لأكثر من 2 أسبوع'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-vea-orange mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MediaBuyingSection;
