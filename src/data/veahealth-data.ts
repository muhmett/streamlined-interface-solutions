import { 
  FileText, Shield, Users, MapPin, Target, TrendingUp, 
  BarChart3, Layers
} from 'lucide-react';
import React from 'react';

export type ColorType = 'blue' | 'green' | 'purple' | 'orange' | 'gold' | 'indigo' | 'red';

export interface Market {
  name: string;
  flag: string;
  icon: string;
  value: string;
  avgSaving: string;
  psycho: string;
  color: ColorType;
  priority: string;
  budget: string;
}

export interface Keyword {
  term: string;
  volume: string;
  priority: string;
  intent: string;
  cpc: string;
  difficulty: number;
  opportunity: number;
  country?: string;
}

export interface ContentPage {
  title: string;
  market: string;
  keywords: string[];
  priority: string;
  status: string;
  deadline: string;
  actions: string[];
}

export interface ContentPillar {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: ColorType;
  progress: number;
  pages: ContentPage[];
}

export interface PhaseTask {
  id: string;
  task: string;
  status: string;
  estimated: string;
  assigned: string;
}

export interface ImplementationPhase {
  phase: number;
  title: string;
  subtitle: string;
  color: ColorType;
  budget: string;
  roi: string;
  tasks: PhaseTask[];
}

export interface TechnicalItem {
  task: string;
  check: boolean;
  impact: string;
}

export interface TechnicalSEO {
  category: string;
  priority: string;
  progress: number;
  items: TechnicalItem[];
}

export interface QuickWin {
  id: number;
  action: string;
  impact: string;
  effort: string;
  days: string;
  market: string;
  roi: string;
  status: string;
}

export interface Competitor {
  competitor: string;
  url: string;
  dr: number;
  traffic: string;
  backlinks: string;
  strengths: string[];
  weaknesses: string[];
  opportunity: string;
}

export interface KPI {
  metric: string;
  current: string;
  target3m: string;
  target6m: string;
  target12m: string;
  icon: React.ReactNode;
  color: ColorType;
}

export interface DentalCrownType {
  name: string;
  description: string;
  price: string;
  durability: string;
}

export interface MarketPrices {
  zircon: string;
  emax: string;
  porcelain: string;
}

export interface DentalCrownInfo {
  types: DentalCrownType[];
  marketComparison: Record<string, MarketPrices>;
}

export const markets: Record<string, Market> = {
  uk: {
    name: 'المملكة المتحدة',
    flag: '🇬🇧',
    icon: 'uk',
    value: '150-200 ألف مريض/عام',
    avgSaving: '70%',
    psycho: 'الخوف من النصب + البحث على الجودة',
    color: 'blue',
    priority: 'عالية',
    budget: '£15K/شهر'
  },
  europe: {
    name: 'أوروبا',
    flag: '🇪🇺',
    icon: 'eu',
    value: 'نمو 10-15%/عام',
    avgSaving: '60-70%',
    psycho: 'القرب + المعايير الأوروبية',
    color: 'green',
    priority: 'متوسطة',
    budget: '€10K/شهر'
  },
  middleeast: {
    name: 'الشرق الأوسط',
    flag: '🇦🇪',
    icon: 'me',
    value: '$855 مليون (دبي 2030)',
    avgSaving: '40-50%',
    psycho: 'الرفاهية + التكنولوجيا + خدمة VIP',
    color: 'purple',
    priority: 'منخفضة',
    budget: '$8K/شهر'
  }
};

export const allKeywords: Record<string, Keyword[]> = {
  uk: [
    { term: 'turkey teeth', volume: '3200/شهر', priority: 'حرج', intent: 'معلوماتي', cpc: '£8.50', difficulty: 85, opportunity: 92 },
    { term: 'dental crown turkey cost', volume: '1800/شهر', priority: 'عالية', intent: 'معاملاتي', cpc: '£15.20', difficulty: 75, opportunity: 85 },
    { term: 'zirconia crowns turkey', volume: '1200/شهر', priority: 'عالية', intent: 'تجاري', cpc: '£16.80', difficulty: 78, opportunity: 82 },
    { term: 'veneers turkey price', volume: '2100/شهر', priority: 'عالية', intent: 'معاملاتي', cpc: '£14.20', difficulty: 72, opportunity: 88 },
    { term: 'turkey teeth gone wrong', volume: '1900/شهر', priority: 'عالية', intent: 'بحثي', cpc: '£6.80', difficulty: 65, opportunity: 95 },
    { term: 'dental implants turkey uk', volume: '1600/شهر', priority: 'عالية', intent: 'تجاري', cpc: '£16.50', difficulty: 82, opportunity: 80 },
    { term: 'istanbul dental clinic', volume: '1400/شهر', priority: 'متوسطة', intent: 'تجاري', cpc: '£9.40', difficulty: 68, opportunity: 75 },
    { term: 'porcelain crown turkey', volume: '950/شهر', priority: 'متوسطة', intent: 'معاملاتي', cpc: '£13.50', difficulty: 70, opportunity: 78 }
  ],
  europe: [
    { term: 'zahnimplantate türkei', volume: '1800/شهر', priority: 'عالية', country: '🇩🇪', intent: 'تجاري', cpc: '€14.80', difficulty: 79, opportunity: 82 },
    { term: 'zahnkrone türkei preis', volume: '1100/شهر', priority: 'عالية', country: '🇩🇪', intent: 'معاملاتي', cpc: '€17.30', difficulty: 76, opportunity: 80 },
    { term: 'zirkonkrone türkei', volume: '850/شهر', priority: 'متوسطة', country: '🇩🇪', intent: 'تجاري', cpc: '€18.90', difficulty: 80, opportunity: 75 },
    { term: 'zahnarzt istanbul', volume: '1200/شهر', priority: 'عالية', country: '🇩🇪', intent: 'تجاري', cpc: '€11.20', difficulty: 71, opportunity: 78 },
    { term: 'soins dentaires turquie', volume: '1300/شهر', priority: 'عالية', country: '🇫🇷', intent: 'معلوماتي', cpc: '€9.80', difficulty: 68, opportunity: 81 },
    { term: 'couronne dentaire turquie prix', volume: '950/شهر', priority: 'عالية', country: '🇫🇷', intent: 'معاملاتي', cpc: '€16.40', difficulty: 72, opportunity: 79 },
    { term: 'implant dentaire turquie', volume: '1100/شهر', priority: 'عالية', country: '🇫🇷', intent: 'تجاري', cpc: '€15.30', difficulty: 76, opportunity: 83 },
    { term: 'couronne zircone turquie', volume: '680/شهر', priority: 'متوسطة', country: '🇫🇷', intent: 'تجاري', cpc: '€19.20', difficulty: 77, opportunity: 76 }
  ],
  middleeast: [
    { term: 'dental tourism turkey dubai', volume: '920/شهر', priority: 'عالية', country: '🇦🇪', intent: 'تجاري', cpc: '$18.50', difficulty: 75, opportunity: 85 },
    { term: 'hollywood smile turkey', volume: '1600/شهر', priority: 'حرج', country: '🌍', intent: 'تجاري', cpc: '$22.80', difficulty: 88, opportunity: 90 },
    { term: 'turkey dental packages uae', volume: '680/شهر', priority: 'عالية', country: '🇦🇪', intent: 'معاملاتي', cpc: '$16.40', difficulty: 71, opportunity: 82 },
    { term: 'cosmetic dentistry istanbul', volume: '1100/شهر', priority: 'عالية', country: '🌍', intent: 'تجاري', cpc: '$14.90', difficulty: 73, opportunity: 79 },
    { term: 'dental crown turkey price', volume: '1200/شهر', priority: 'عالية', country: '🇸🇦', intent: 'معاملاتي', cpc: '$20.50', difficulty: 74, opportunity: 84 },
    { term: 'zircon crowns turkey', volume: '750/شهر', priority: 'متوسطة', country: '🇦🇪', intent: 'تجاري', cpc: '$23.40', difficulty: 81, opportunity: 80 },
    { term: 'veneers turkey luxury', volume: '420/شهر', priority: 'متوسطة', country: '🇦🇪', intent: 'معاملاتي', cpc: '$19.30', difficulty: 66, opportunity: 76 },
    { term: 'emax crown turkey', volume: '550/شهر', priority: 'متوسطة', country: '🇶🇦', intent: 'معاملاتي', cpc: '$21.80', difficulty: 79, opportunity: 77 }
  ]
};

export const contentPillars: ContentPillar[] = [
  {
    title: 'الركيزة الأولى: المصداقية والتعليم',
    icon: React.createElement(FileText, { className: 'w-6 h-6' }),
    description: 'محتوى تعليمي باش يكون VeaHealth هو المرجع',
    color: 'blue',
    progress: 25,
    pages: [
      {
        title: 'الدليل الشامل لعلاج الأسنان في تركيا 2026',
        market: 'الجميع',
        keywords: ['علاج الأسنان في تركيا', 'سياحة علاجية تركيا'],
        priority: 'حرج',
        status: 'قيد التنفيذ',
        deadline: '15 يوم',
        actions: [
          'دليل 3000+ كلمة مع هيكل محسن',
          'مقارنة أسعار مفصلة تركيا ضد أوروبا',
          'قائمة تدقيق تفاعلية قبل السفر',
          'فيديوهات تجارب المرضى مع ترجمة',
          'رسومات توضيحية للعملية من البداية للنهاية',
          'علامات FAQ باش نطلعو في النتيجة الأولى'
        ]
      },
      {
        title: 'أسعار تيجان الأسنان والزرعات في تركيا',
        market: 'الجميع',
        keywords: ['سعر تاج الأسنان تركيا', 'زرع الأسنان تركيا سعر'],
        priority: 'حرج',
        status: 'مخطط',
        deadline: '30 يوم',
        actions: [
          'آلة حاسبة أسعار تفاعلية بالعملات',
          'جدول مقارنة بين أنواع التيجان (زركون، بورسلين، E-max)',
          'ضمانات واضحة',
          'CTA: عرض أسعار مجاني في 24 ساعة',
          'تجارب مرضى مع فواتير'
        ]
      }
    ]
  },
  {
    title: 'الركيزة الثانية: الثقة والأمان',
    icon: React.createElement(Shield, { className: 'w-6 h-6' }),
    description: 'نعالجو المخاوف وبنو الثقة',
    color: 'green',
    progress: 10,
    pages: [
      {
        title: 'مشاكل علاج الأسنان في تركيا: كيف VeaHealth يحميك',
        market: 'المملكة المتحدة',
        keywords: ['مشاكل تيجان الأسنان تركيا', 'علاج أسنان تركيا فاشل'],
        priority: 'حرج',
        status: 'أولوية',
        deadline: '10 أيام',
        actions: [
          'نعترفو بكل المخاطر بصراحة',
          'بروتوكول اختيار العيادات في VeaHealth',
          'شهادات دولية (JCI, ISO)',
          'ضمان استرجاع المال أو الإصلاح',
          'شراكة مع أطباء في بريطانيا للمتابعة',
          'تأمين ضد المضاعفات'
        ]
      },
      {
        title: 'عياداتنا الشريكة: اختيار صارم',
        market: 'الجميع',
        keywords: ['أحسن عيادة أسنان في تركيا'],
        priority: 'عالية',
        status: 'مخطط',
        deadline: '45 يوم',
        actions: [
          'صور عالية الجودة + جولات 360° للعيادات',
          'سير أطباء (شهادات دولية)',
          'شهادات ISO, JCI, TÜV واضحة',
          'آخر التقنيات والمعدات',
          'شرح كيفاش نختارو العيادات'
        ]
      }
    ]
  },
  {
    title: 'الركيزة الثالثة: تجارب المرضى والإثبات',
    icon: React.createElement(Users, { className: 'w-6 h-6' }),
    description: 'إثباتات اجتماعية باش نحولو الزوار لمرضى',
    color: 'purple',
    progress: 40,
    pages: [
      {
        title: 'آراء مرضى VeaHealth: 500+ تجربة موثقة',
        market: 'الجميع',
        keywords: ['تقييمات علاج الأسنان تركيا'],
        priority: 'عالية',
        status: 'قيد التنفيذ',
        deadline: '20 يوم',
        actions: [
          'أداة Trustpilot/Google Reviews في الموقع',
          'فيديوهات قبل وبعد مع مقابلات المرضى',
          'قصص إنستغرام مباشرة من المرضى',
          'شارة "4.8/5 - 500+ تقييم موثق"',
          'تجارب مصنفة حسب الجنسية',
          'قسم المشاكل المعالجة (شفافية)'
        ]
      }
    ]
  },
  {
    title: 'الركيزة الرابعة: SEO محلي لكل بلد',
    icon: React.createElement(MapPin, { className: 'w-6 h-6' }),
    description: 'تحسين محلي لكل سوق على حدة',
    color: 'orange',
    progress: 5,
    pages: [
      {
        title: 'صفحات المدن: إسطنبول، أنطاليا، إزمير',
        market: 'الجميع',
        keywords: ['عيادة أسنان إسطنبول', 'طبيب أسنان إسطنبول'],
        priority: 'عالية',
        status: 'مخطط',
        deadline: '60 يوم',
        actions: [
          '3 صفحات مخصصة بمحتوى فريد',
          'خريطة تفاعلية للعيادات الشريكة',
          'دليل السفر: فنادق، مطاعم، أنشطة',
          'باقات "علاج + إقامة" حسب الوجهة',
          'رحلات مباشرة من المدن الأوروبية'
        ]
      },
      {
        title: 'صفحات الدول: UK, DE, FR, NL, ES, AE',
        market: 'متعدد الأسواق',
        keywords: ['علاج أسنان تركيا بريطانيا'],
        priority: 'حرج',
        status: 'أولوية',
        deadline: '90 يوم',
        actions: [
          'مجلدات فرعية /uk/ /de/ /fr/ /nl/ /es/ /ae/',
          'ترجمة محترفة',
          'أسعار بالعملة المحلية',
          'رحلات مباشرة من البلد',
          'تجارب مرضى من نفس البلد',
          'شراكات محلية (تأمين، أطباء)'
        ]
      }
    ]
  }
];

export const implementationPhases: ImplementationPhase[] = [
  {
    phase: 1,
    title: 'الأشهر 1-2: أساسيات SEO',
    subtitle: 'البنية التقنية والبحث',
    color: 'blue',
    budget: '€8,000',
    roi: 'ماكاينش',
    tasks: [
      { id: '1-1', task: 'فحص تقني كامل (السرعة، الجوال، Core Web Vitals)', status: 'للعمل', estimated: '3 أيام', assigned: 'فريق التقنية' },
      { id: '1-2', task: 'تثبيت Google Search Console + GA4', status: 'للعمل', estimated: '2 أيام', assigned: 'التحليلات' },
      { id: '1-3', task: 'بحث كلمات مفتاحية 300+ مصطلح', status: 'قيد العمل', estimated: '5 أيام', assigned: 'SEO' },
      { id: '1-4', task: 'هيكل موقع متعدد اللغات', status: 'للعمل', estimated: '4 أيام', assigned: 'المطورين' },
      { id: '1-5', task: 'كتابة 5 صفحات أساسية (تركيز بريطانيا)', status: 'للعمل', estimated: '10 أيام', assigned: 'المحتوى' },
      { id: '1-6', task: 'علامات Schema للموقع', status: 'للعمل', estimated: '2 أيام', assigned: 'SEO' },
      { id: '1-7', task: 'تهيئة CDN أوروبا + الشرق الأوسط', status: 'مكتمل', estimated: '1 يوم', assigned: 'فريق التقنية' }
    ]
  },
  {
    phase: 2,
    title: 'الأشهر 3-4: إنتاج محتوى بريطانيا',
    subtitle: 'تركيز على بريطانيا - أكبر تحويل',
    color: 'green',
    budget: '€15,000',
    roi: '2:1 متوقع',
    tasks: [
      { id: '2-1', task: 'صفحة "مشاكل علاج الأسنان في تركيا" (أولوية #1)', status: 'أولوية', estimated: '7 أيام', assigned: 'المحتوى' },
      { id: '2-2', task: 'نشر 12 مقال مدونة بريطانيا (3/أسبوع)', status: 'للعمل', estimated: '30 يوم', assigned: 'المحتوى' },
      { id: '2-3', task: 'صنع 10 فيديوهات تجارب مرضى بريطانيا', status: 'للعمل', estimated: '20 يوم', assigned: 'الفيديو' },
      { id: '2-4', task: 'تحسين كل صفحات بريطانيا', status: 'للعمل', estimated: '5 أيام', assigned: 'SEO' },
      { id: '2-5', task: 'إطلاق إعلانات جوجل بريطانيا (£2K تجريبي)', status: 'للعمل', estimated: '2 أيام', assigned: 'PPC' },
      { id: '2-6', task: 'شراكة مع مؤثرين بريطانيا صغار (50-100K)', status: 'للعمل', estimated: '14 يوم', assigned: 'التسويق' },
      { id: '2-7', task: 'تهيئة Google Business Profile بريطانيا', status: 'للعمل', estimated: '1 يوم', assigned: 'SEO المحلي' }
    ]
  },
  {
    phase: 3,
    title: 'الأشهر 5-6: التوسع في أوروبا',
    subtitle: 'تعدد اللغات والتكيف الثقافي',
    color: 'purple',
    budget: '€12,000',
    roi: '1.5:1 متوقع',
    tasks: [
      { id: '3-1', task: 'ترجمة محترفة ألمانية، فرنسية، هولندية، إسبانية', status: 'للعمل', estimated: '15 يوم', assigned: 'المترجمين' },
      { id: '3-2', task: 'صفحات محلية /de/ /fr/ /nl/ /es/ كاملة', status: 'للعمل', estimated: '20 يوم', assigned: 'المحتوى' },
      { id: '3-3', task: 'باكلينكس من مدونات سفر أوروبية (30+)', status: 'للعمل', estimated: '30 يوم', assigned: 'العلاقات' },
      { id: '3-4', task: 'Google Business Profile لكل بلد', status: 'للعمل', estimated: '3 أيام', assigned: 'SEO المحلي' },
      { id: '3-5', task: 'حملة فيسبوك إعلانات ألمانيا/فرنسا', status: 'للعمل', estimated: '3 أيام', assigned: 'PPC' },
      { id: '3-6', task: 'شراكات مع شركات تأمين ألمانية', status: 'للعمل', estimated: '10 أيام', assigned: 'الشراكات' },
      { id: '3-7', task: 'فيديوهات تجارب مرضى أوروبيين', status: 'للعمل', estimated: '15 يوم', assigned: 'الفيديو' }
    ]
  },
  {
    phase: 4,
    title: 'الأشهر 7-8: الشرق الأوسط الفاخر',
    subtitle: 'تسيير الرفاهية وخدمة VIP',
    color: 'gold',
    budget: '€10,000',
    roi: '3:1 متوقع',
    tasks: [
      { id: '4-1', task: 'صفحة عربية + تصميم RTL', status: 'للعمل', estimated: '10 أيام', assigned: 'المطورين' },
      { id: '4-2', task: 'صفحة هبوط "هوليوود سمايل" فاخرة', status: 'للعمل', estimated: '7 أيام', assigned: 'التصميم' },
      { id: '4-3', task: 'إعلانات إنستغرام إماراتية/سعودية فاخرة', status: 'للعمل', estimated: '3 أيام', assigned: 'السوشيال' },
      { id: '4-4', task: 'شراكات مع وكالات سفر دبي', status: 'للعمل', estimated: '14 يوم', assigned: 'الشراكات' },
      { id: '4-5', task: 'باقة طيران الإمارات (أميال)', status: 'للعمل', estimated: '7 أيام', assigned: 'الشراكات' },
      { id: '4-6', task: 'خدمة كونسيرج 24/7 عربية', status: 'للعمل', estimated: '5 أيام', assigned: 'التشغيل' }
    ]
  },
  {
    phase: 5,
    title: 'الأشهر 9-12: بناء المصداقية',
    subtitle: 'باكلينكس جودة وتوسع رأسي',
    color: 'indigo',
    budget: '€8,000',
    roi: '4:1 متوقع',
    tasks: [
      { id: '5-1', task: 'الحصول على 50+ باكلينك DR50+ (صحة، سفر)', status: 'للعمل', estimated: '60 يوم', assigned: 'العلاقات' },
      { id: '5-2', task: 'مقالات ضيف في مجالات طبية', status: 'للعمل', estimated: '30 يوم', assigned: 'المحتوى' },
      { id: '5-3', task: 'برنامج تلقائي لآراء العملاء', status: 'للعمل', estimated: '5 أيام', assigned: 'التقنية' },
      { id: '5-4', task: 'اختبار A/B لصفحات التحويل', status: 'للعمل', estimated: '10 أيام', assigned: 'CRO' },
      { id: '5-5', task: 'حملة علاقات عامة (صحافة صحية دولية)', status: 'للعمل', estimated: '20 يوم', assigned: 'العلاقات العامة' },
      { id: '5-6', task: 'توسع محتوى 50+ مقال لكل الأسواق', status: 'للعمل', estimated: '60 يوم', assigned: 'المحتوى' }
    ]
  }
];

export const technicalSEO: TechnicalSEO[] = [
  {
    category: 'الهيكل التقني',
    priority: 'حرج',
    progress: 40,
    items: [
      { task: 'هيكل: veahealth.com/uk/, /de/, /fr/, /nl/, /es/, /ae/', check: true, impact: 'عالي' },
      { task: 'علامات Hreflang لكل صفحة', check: false, impact: 'عالي' },
      { task: 'Sitemap XML منفصل لكل لغة/سوق', check: true, impact: 'متوسط' },
      { task: 'Google Search Console لكل بلد', check: false, impact: 'عالي' },
      { task: 'CDN مع سيرفرات أوروبا + الشرق الأوسط', check: true, impact: 'عالي' }
    ]
  },
  {
    category: 'الأداء والسرعة',
    priority: 'حرج',
    progress: 20,
    items: [
      { task: 'Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1', check: false, impact: 'حرج' },
      { task: 'صور WebP + lazy loading', check: false, impact: 'عالي' },
      { task: 'تقليل CSS/JS/HTML', check: false, impact: 'متوسط' },
      { task: 'Caching قوي (Redis/Varnish)', check: false, impact: 'عالي' },
      { task: 'نتيجة PageSpeed 90+ جوال وكمبيوتر', check: false, impact: 'عالي' }
    ]
  },
  {
    category: 'علامات Schema',
    priority: 'عالية',
    progress: 10,
    items: [
      { task: 'Organization schema (VeaHealth)', check: false, impact: 'عالي' },
      { task: 'MedicalBusiness schema', check: false, impact: 'متوسط' },
      { task: 'FAQPage schema (للمركز 0)', check: false, impact: 'عالي' },
      { task: 'Review/AggregateRating schema', check: false, impact: 'عالي' },
      { task: 'VideoObject لتجارب المرضى', check: false, impact: 'متوسط' }
    ]
  }
];

export const quickWins: QuickWin[] = [
  { id: 1, action: 'صفحة "مشاكل علاج الأسنان في تركيا" بريطانيا', impact: 'ضخم', effort: 'متوسط', days: '5-7', market: '🇬🇧', roi: '300%', status: 'قيد العمل' },
  { id: 2, action: 'إعلانات جوجل بريطانيا تجريبية £2K/شهر', impact: 'عالي', effort: 'خفيف', days: '1', market: '🇬🇧', roi: '200%', status: 'مخطط' },
  { id: 3, action: 'Google Business Profile لكل الدول', impact: 'عالي', effort: 'خفيف', days: '2-3', market: 'الكل', roi: '150%', status: 'للعمل' },
  { id: 4, action: 'آلة حاسبة أسعار تفاعلية', impact: 'عالي', effort: 'متوسط', days: '5-7', market: 'الكل', roi: '250%', status: 'قيد العمل' },
  { id: 5, action: 'أداة Trustpilot في الموقع', impact: 'متوسط', effort: 'خفيف', days: '1', market: 'الكل', roi: '100%', status: 'مكتمل' },
  { id: 6, action: 'شات واتساب متعدد اللغات', impact: 'عالي', effort: 'خفيف', days: '1', market: 'الكل', roi: '180%', status: 'مكتمل' },
  { id: 7, action: 'تحسين سرعة الموقع (صور، كاش)', impact: 'عالي', effort: 'متوسط', days: '3-5', market: 'الكل', roi: '220%', status: 'قيد العمل' },
  { id: 8, action: 'علامات FAQ schema', impact: 'متوسط', effort: 'خفيف', days: '2', market: 'الكل', roi: '120%', status: 'للعمل' },
  { id: 9, action: 'شراكة مع مؤثرين بريطانيا صغار', impact: 'عالي', effort: 'متوسط', days: '14', market: '🇬🇧', roi: '280%', status: 'مخطط' },
  { id: 10, action: 'إعلانات إنستغرام إماراتية فاخرة', impact: 'عالي', effort: 'خفيف', days: '2', market: '🇦🇪', roi: '320%', status: 'للعمل' }
];

export const competitiveAnalysis: Competitor[] = [
  {
    competitor: 'Body Expert',
    url: 'bodyexpert.com',
    dr: 48,
    traffic: '45K/شهر',
    backlinks: '1.2K',
    strengths: ['محتوى غني', 'وجود قوي في جوجل', 'تجارب كثيرة', 'قدم'],
    weaknesses: ['تصميم قديم', 'بطيء', 'قليل الفيديو', 'SEO تقني ضعيف'],
    opportunity: 'نفوز عليهم في UX حديث + سرعة + فيديو'
  },
  {
    competitor: 'Turquie Dentaire',
    url: 'turquie-dentaire.com',
    dr: 32,
    traffic: '18K/شهر',
    backlinks: '540',
    strengths: ['أسعار شفافة', 'رد سريع', 'واجهة بسيطة'],
    weaknesses: ['SEO ضعيف', 'محتوى سطحي', 'ماكاينش مدونة نشيطة', 'ماكاينش فيديوهات'],
    opportunity: 'نفوز في المحتوى التعليمي العميق + الفيديو'
  },
  {
    competitor: 'Europe Dentaire',
    url: 'europe-dentaire.com',
    dr: 56,
    traffic: '62K/شهر',
    backlinks: '2.1K',
    strengths: ['قدم (من 2004)', 'ثقة', 'تغطية جغرافية واسعة'],
    weaknesses: ['وجهات متعددة (ماكاش تركيز على تركيا)', 'موقع معقد', 'أسعار أقل تنافسية'],
    opportunity: 'تخصص تركيا = مصداقية + أسعار تنافسية'
  }
];

export const kpis: KPI[] = [
  { metric: 'حركة عضوية', current: '0', target3m: '5K/شهر', target6m: '15K/شهر', target12m: '50K/شهر', icon: React.createElement(TrendingUp), color: 'blue' },
  { metric: 'كلمات مفتاحية في المركز 3', current: '0', target3m: '10', target6m: '30', target12m: '80+', icon: React.createElement(Target), color: 'green' },
  { metric: 'Leads شهرياً', current: '0', target3m: '50-80', target6m: '150-200', target12m: '400-500', icon: React.createElement(Users), color: 'purple' },
  { metric: 'Domain Authority', current: 'N/A', target3m: 'DR30', target6m: 'DR40', target12m: 'DR50+', icon: React.createElement(BarChart3), color: 'orange' },
  { metric: 'باكلينكس', current: '0', target3m: '20', target6m: '50', target12m: '150+', icon: React.createElement(Layers), color: 'red' },
  { metric: 'معدل التحويل', current: 'N/A', target3m: '3-5%', target6m: '6-8%', target12m: '10-12%', icon: React.createElement(TrendingUp), color: 'indigo' }
];

export const dentalCrownInfo: DentalCrownInfo = {
  types: [
    { name: 'تيجان الزركون', description: 'الأقوى والأكثر طبيعية', price: '€300-500', durability: '15-20 سنة' },
    { name: 'تيجان E-max', description: 'شبه شفافة كالسنان الطبيعي', price: '€400-600', durability: '10-15 سنة' },
    { name: 'تيجان البورسلين', description: 'مظهر طبيعي مع معدن', price: '€250-450', durability: '10-15 سنة' },
    { name: 'تيجان المعدن', description: 'قوية لكن غير جمالية', price: '€200-350', durability: '20+ سنة' }
  ],
  marketComparison: {
    turkey: { zircon: '€300-500', emax: '€400-600', porcelain: '€250-450' },
    uk: { zircon: '£800-1200', emax: '£900-1400', porcelain: '£700-1100' },
    germany: { zircon: '€800-1300', emax: '€900-1500', porcelain: '€700-1200' },
    france: { zircon: '€750-1200', emax: '€850-1400', porcelain: '€650-1100' },
    uae: { zircon: '$1000-1800', emax: '$1200-2000', porcelain: '$900-1600' }
  }
};

export const getColorClasses = (color: ColorType) => {
  switch(color) {
    case 'blue': return { bg: 'bg-vea-blue', bgLight: 'bg-vea-blue-light', text: 'text-vea-blue', border: 'border-vea-blue' };
    case 'green': return { bg: 'bg-vea-green', bgLight: 'bg-vea-green-light', text: 'text-vea-green', border: 'border-vea-green' };
    case 'purple': return { bg: 'bg-vea-purple', bgLight: 'bg-vea-purple-light', text: 'text-vea-purple', border: 'border-vea-purple' };
    case 'orange': return { bg: 'bg-vea-orange', bgLight: 'bg-vea-orange-light', text: 'text-vea-orange', border: 'border-vea-orange' };
    case 'indigo': return { bg: 'bg-vea-indigo', bgLight: 'bg-vea-indigo-light', text: 'text-vea-indigo', border: 'border-vea-indigo' };
    case 'gold': return { bg: 'bg-vea-gold', bgLight: 'bg-vea-gold-light', text: 'text-vea-gold', border: 'border-vea-gold' };
    case 'red': return { bg: 'bg-vea-red', bgLight: 'bg-vea-red-light', text: 'text-vea-red', border: 'border-vea-red' };
    default: return { bg: 'bg-muted', bgLight: 'bg-muted/50', text: 'text-muted-foreground', border: 'border-muted' };
  }
};
