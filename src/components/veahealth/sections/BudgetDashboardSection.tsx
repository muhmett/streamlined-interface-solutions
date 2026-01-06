import { 
  DollarSign, TrendingUp, PieChart, BarChart3, 
  Calendar, Target, CheckCircle2, AlertCircle
} from 'lucide-react';

const monthlyBudget = {
  total: 4000,
  seo: 2000,
  paid: 2000,
  breakdown: [
    { category: 'Content Creation', amount: 800, type: 'SEO' },
    { category: 'Link Building', amount: 600, type: 'SEO' },
    { category: 'Technical SEO', amount: 400, type: 'SEO' },
    { category: 'Tools & Analytics', amount: 200, type: 'SEO' },
    { category: 'Meta Ads (FB+IG)', amount: 1700, type: 'Paid' },
    { category: 'Creative Production', amount: 300, type: 'Paid' }
  ]
};

const quarterlyBudget = [
  { quarter: 'Q1 2026', seo: 6000, paid: 6000, total: 12000, focus: 'Foundation + UK Launch' },
  { quarter: 'Q2 2026', seo: 6000, paid: 6000, total: 12000, focus: 'Scale UK + Europe Start' },
  { quarter: 'Q3 2026', seo: 6000, paid: 6000, total: 12000, focus: 'Europe + Middle East' },
  { quarter: 'Q4 2026', seo: 6000, paid: 6000, total: 12000, focus: 'Optimization + Scale' }
];

const roiProjections = [
  { period: 'شهر 3', investment: 12000, leads: 150, conversions: 8, revenue: 24000, roi: '100%' },
  { period: 'شهر 6', investment: 24000, leads: 400, conversions: 25, revenue: 75000, roi: '212%' },
  { period: 'شهر 9', investment: 36000, leads: 750, conversions: 50, revenue: 150000, roi: '316%' },
  { period: 'شهر 12', investment: 48000, leads: 1200, conversions: 80, revenue: 240000, roi: '400%' }
];

const budgetAllocation = [
  { name: 'SEO & Content', percentage: 50, color: 'bg-vea-green' },
  { name: 'Meta Ads', percentage: 42, color: 'bg-vea-blue' },
  { name: 'Creative', percentage: 8, color: 'bg-vea-purple' }
];

const BudgetDashboardSection = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-vea-green via-vea-blue to-vea-gold rounded-2xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              ميزانية التسويق 2026
            </h2>
            <p className="text-white/80 mt-1">Low Budget Strategy - أقل من $4,000/شهر - SEO + Paid Combined</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">$4,000</p>
              <p className="text-sm opacity-80">شهرياً</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">$48,000</p>
              <p className="text-sm opacity-80">سنوياً</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">400%</p>
              <p className="text-sm opacity-80">ROI متوقع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-vea-green-light border border-vea-green/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-vea-green">SEO & Content</h3>
            <span className="text-2xl font-bold text-vea-green">${monthlyBudget.seo}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">50% من الميزانية - استثمار طويل المدى</p>
          <div className="space-y-2">
            {monthlyBudget.breakdown.filter(b => b.type === 'SEO').map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-background rounded-lg">
                <span className="text-sm">{item.category}</span>
                <span className="font-bold">${item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-vea-blue-light border border-vea-blue/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-vea-blue">Paid Ads</h3>
            <span className="text-2xl font-bold text-vea-blue">${monthlyBudget.paid}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">50% من الميزانية - نتائج سريعة</p>
          <div className="space-y-2">
            {monthlyBudget.breakdown.filter(b => b.type === 'Paid').map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-background rounded-lg">
                <span className="text-sm">{item.category}</span>
                <span className="font-bold">${item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            توزيع الميزانية
          </h3>
          <div className="space-y-3">
            {budgetAllocation.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-bold">المجموع الشهري</span>
              <span className="text-2xl font-bold text-vea-green">${monthlyBudget.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly Budget */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-vea-purple" />
          الميزانية الفصلية 2026
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-3 font-bold">الفصل</th>
                <th className="text-center p-3 font-bold">SEO</th>
                <th className="text-center p-3 font-bold">Paid</th>
                <th className="text-center p-3 font-bold">المجموع</th>
                <th className="text-right p-3 font-bold">التركيز</th>
              </tr>
            </thead>
            <tbody>
              {quarterlyBudget.map((q, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-3 font-bold">{q.quarter}</td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-green-light text-vea-green px-2 py-1 rounded-full text-xs">${q.seo}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-blue-light text-vea-blue px-2 py-1 rounded-full text-xs">${q.paid}</span>
                  </td>
                  <td className="p-3 text-center font-bold text-vea-purple">${q.total}</td>
                  <td className="p-3 text-sm text-muted-foreground">{q.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Projections */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-vea-gold" />
          توقعات العائد على الاستثمار (ROI)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-3 font-bold">الفترة</th>
                <th className="text-center p-3 font-bold">الاستثمار</th>
                <th className="text-center p-3 font-bold">Leads</th>
                <th className="text-center p-3 font-bold">تحويلات</th>
                <th className="text-center p-3 font-bold">الإيرادات</th>
                <th className="text-center p-3 font-bold">ROI</th>
              </tr>
            </thead>
            <tbody>
              {roiProjections.map((roi, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-3 font-bold">{roi.period}</td>
                  <td className="p-3 text-center text-vea-red">${roi.investment.toLocaleString()}</td>
                  <td className="p-3 text-center">{roi.leads}</td>
                  <td className="p-3 text-center">{roi.conversions}</td>
                  <td className="p-3 text-center text-vea-green font-bold">${roi.revenue.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className="bg-vea-gold-light text-vea-gold px-3 py-1 rounded-full font-bold">{roi.roi}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-vea-gold-light rounded-xl border border-vea-gold/20">
          <p className="text-sm text-center">
            <strong className="text-vea-gold">ملاحظة:</strong> التوقعات مبنية على متوسط قيمة عميل $3,000 ومعدل تحويل 5-7%
          </p>
        </div>
      </div>

      {/* Budget Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-vea-green-light border border-vea-green/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-vea-green mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            كيف تحقق أقصى استفادة
          </h3>
          <ul className="space-y-3">
            {[
              'ابدأ بـ SEO أولاً - نتائج مستدامة',
              'اختبر الإعلانات بميزانية صغيرة قبل التوسع',
              'ركز على سوق واحد (UK) قبل التوسع',
              'استثمر في المحتوى عالي الجودة',
              'راقب KPIs أسبوعياً وعدّل',
              'أعد استخدام المحتوى عبر القنوات'
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-vea-green mt-0.5" />
                {tip}
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
              'لا توزع الميزانية على أسواق كثيرة',
              'لا تتوقع نتائج سريعة من SEO (3-6 أشهر)',
              'لا تهمل تتبع التحويلات (Pixel + Analytics)',
              'لا تنفق على الإعلانات بدون landing page محسنة',
              'لا تتوقف عن الاختبار والتحسين',
              'لا تهمل متابعة العملاء المحتملين'
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-vea-orange mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboardSection;
