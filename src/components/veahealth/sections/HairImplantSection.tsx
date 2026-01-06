import { 
  TrendingUp, Users, DollarSign, Globe, Target, 
  Star, CheckCircle2, BarChart3, Sparkles
} from 'lucide-react';
import { getColorClasses } from '@/data/veahealth-data';

interface HairService {
  name: string;
  description: string;
  pricesTurkey: string;
  pricesUK: string;
  pricesGermany: string;
  savings: string;
  duration: string;
}

const hairServices: HairService[] = [
  {
    name: 'FUE Hair Transplant',
    description: 'تقنية الاقتطاف الفردي - الأكثر شيوعاً',
    pricesTurkey: '$1,500 - $3,000',
    pricesUK: '£8,000 - £15,000',
    pricesGermany: '€6,000 - €12,000',
    savings: '70-80%',
    duration: '6-8 ساعات'
  },
  {
    name: 'DHI Sapphire',
    description: 'زراعة مباشرة بتقنية الياقوت',
    pricesTurkey: '$2,000 - $4,000',
    pricesUK: '£10,000 - £18,000',
    pricesGermany: '€8,000 - €15,000',
    savings: '75-80%',
    duration: '8-10 ساعات'
  },
  {
    name: 'Beard Transplant',
    description: 'زراعة شعر اللحية',
    pricesTurkey: '$1,200 - $2,500',
    pricesUK: '£5,000 - £8,000',
    pricesGermany: '€4,000 - €7,000',
    savings: '70-75%',
    duration: '4-6 ساعات'
  },
  {
    name: 'Eyebrow Transplant',
    description: 'زراعة شعر الحواجب',
    pricesTurkey: '$1,000 - $2,000',
    pricesUK: '£4,000 - £6,000',
    pricesGermany: '€3,500 - €5,500',
    savings: '70-75%',
    duration: '2-3 ساعات'
  }
];

const hairKeywords = [
  { term: 'hair transplant turkey', volume: '22,000/شهر', cpc: '£12.50', difficulty: 88, intent: 'تجاري' },
  { term: 'fue hair transplant istanbul', volume: '8,100/شهر', cpc: '£15.80', difficulty: 82, intent: 'معاملاتي' },
  { term: 'best hair transplant turkey', volume: '6,600/شهر', cpc: '£18.20', difficulty: 85, intent: 'تجاري' },
  { term: 'dhi hair transplant turkey cost', volume: '4,400/شهر', cpc: '£16.50', difficulty: 78, intent: 'معاملاتي' },
  { term: 'hair transplant turkey package', volume: '3,200/شهر', cpc: '£14.80', difficulty: 75, intent: 'معاملاتي' },
  { term: 'hair transplant turkey reviews', volume: '2,900/شهر', cpc: '£8.20', difficulty: 70, intent: 'بحثي' }
];

const hairContentPlan = [
  {
    title: 'دليل زراعة الشعر في تركيا 2026',
    priority: 'حرج',
    keywords: ['hair transplant turkey', 'fue vs dhi'],
    deadline: '30 يوم'
  },
  {
    title: 'أسعار زراعة الشعر تركيا مقارنة بأوروبا',
    priority: 'عالية',
    keywords: ['hair transplant turkey cost', 'cheap hair transplant'],
    deadline: '45 يوم'
  },
  {
    title: 'أفضل عيادات زراعة الشعر في إسطنبول',
    priority: 'عالية',
    keywords: ['best hair clinic istanbul', 'top surgeons'],
    deadline: '60 يوم'
  },
  {
    title: 'تجارب حقيقية: قبل وبعد زراعة الشعر',
    priority: 'عالية',
    keywords: ['hair transplant results', 'before after'],
    deadline: '30 يوم'
  }
];

const HairImplantSection = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-vea-gold via-vea-orange to-vea-red rounded-2xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              استراتيجية زراعة الشعر 2026
            </h2>
            <p className="text-white/80 mt-1">Hair Implant | FUE | DHI Sapphire | Beard & Eyebrow</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">$15B+</p>
              <p className="text-sm opacity-80">سوق عالمي 2025</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">500K+</p>
              <p className="text-sm opacity-80">عملية/سنة تركيا</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">70-80%</p>
              <p className="text-sm opacity-80">توفير</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hairServices.map((service, idx) => (
          <div key={idx} className="bg-card rounded-2xl shadow-card p-6 border-r-4 border-vea-gold">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <div className="bg-vea-green-light text-vea-green px-3 py-1 rounded-full text-sm font-bold">
                توفير {service.savings}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-vea-gold-light rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">🇹🇷 تركيا</p>
                <p className="font-bold text-vea-gold">{service.pricesTurkey}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">🇬🇧 بريطانيا</p>
                <p className="font-bold text-muted-foreground">{service.pricesUK}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">🇩🇪 ألمانيا</p>
                <p className="font-bold text-muted-foreground">{service.pricesGermany}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                المدة: {service.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Keywords for Hair Implant */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-vea-gold" />
          كلمات مفتاحية زراعة الشعر
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-3 font-bold">الكلمة المفتاحية</th>
                <th className="text-center p-3 font-bold">الحجم</th>
                <th className="text-center p-3 font-bold">CPC</th>
                <th className="text-center p-3 font-bold">الصعوبة</th>
                <th className="text-center p-3 font-bold">النية</th>
              </tr>
            </thead>
            <tbody>
              {hairKeywords.map((kw, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-3 font-medium">{kw.term}</td>
                  <td className="p-3 text-center text-vea-blue font-bold">{kw.volume}</td>
                  <td className="p-3 text-center">{kw.cpc}</td>
                  <td className="p-3 text-center">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${kw.difficulty > 80 ? 'bg-vea-red' : kw.difficulty > 70 ? 'bg-vea-orange' : 'bg-vea-green'}`}
                        style={{ width: `${kw.difficulty}%` }}
                      />
                    </div>
                    <span className="text-xs">{kw.difficulty}/100</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      kw.intent === 'تجاري' ? 'bg-vea-blue-light text-vea-blue' :
                      kw.intent === 'معاملاتي' ? 'bg-vea-green-light text-vea-green' :
                      'bg-vea-purple-light text-vea-purple'
                    }`}>{kw.intent}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Plan */}
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-vea-purple" />
          خطة المحتوى - زراعة الشعر
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hairContentPlan.map((content, idx) => (
            <div key={idx} className="bg-muted/50 rounded-xl p-4 border-r-4 border-vea-gold">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">{content.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  content.priority === 'حرج' ? 'bg-vea-red-light text-vea-red' : 'bg-vea-orange-light text-vea-orange'
                }`}>{content.priority}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {content.keywords.map((kw, i) => (
                  <span key={i} className="text-xs bg-vea-gold-light text-vea-gold px-2 py-1 rounded-full">{kw}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">⏰ {content.deadline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Market Opportunity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-vea-blue-light border border-vea-blue/20 rounded-2xl p-6 text-center">
          <Globe className="w-10 h-10 text-vea-blue mx-auto mb-3" />
          <h4 className="font-bold text-lg mb-2">🇬🇧 بريطانيا</h4>
          <p className="text-2xl font-bold text-vea-blue">60%</p>
          <p className="text-sm text-muted-foreground">من العملاء المحتملين</p>
          <p className="text-xs mt-2">22K+ بحث شهري</p>
        </div>
        <div className="bg-vea-green-light border border-vea-green/20 rounded-2xl p-6 text-center">
          <Globe className="w-10 h-10 text-vea-green mx-auto mb-3" />
          <h4 className="font-bold text-lg mb-2">🇪🇺 أوروبا</h4>
          <p className="text-2xl font-bold text-vea-green">25%</p>
          <p className="text-sm text-muted-foreground">ألمانيا، فرنسا، هولندا</p>
          <p className="text-xs mt-2">15K+ بحث شهري</p>
        </div>
        <div className="bg-vea-purple-light border border-vea-purple/20 rounded-2xl p-6 text-center">
          <Globe className="w-10 h-10 text-vea-purple mx-auto mb-3" />
          <h4 className="font-bold text-lg mb-2">🇦🇪 الشرق الأوسط</h4>
          <p className="text-2xl font-bold text-vea-purple">15%</p>
          <p className="text-sm text-muted-foreground">الإمارات، السعودية</p>
          <p className="text-xs mt-2">8K+ بحث شهري</p>
        </div>
      </div>
    </div>
  );
};

export default HairImplantSection;
