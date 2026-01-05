import { Zap, ArrowRight } from 'lucide-react';
import { quickWins } from '@/data/veahealth-data';

const QuickWinsSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-7 h-7 text-vea-gold" />
            إجراءات سريعة (نتائج في أقل من 30 يوم)
          </h3>
          <div className="text-lg font-bold text-vea-green">
            ROI متوسط: <span className="text-2xl">230%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickWins.map((win) => (
            <div key={win.id} className={`p-5 rounded-xl border-2 transition-all hover:shadow-card ${
              win.status === 'مكتمل' ? 'border-vea-green bg-vea-green-light' :
              win.status === 'قيد العمل' ? 'border-vea-blue bg-vea-blue-light' :
              win.status === 'مخطط' ? 'border-vea-gold bg-vea-gold-light' :
              'border-border bg-card'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-foreground mb-1">{win.action}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                    <span>{win.market}</span>
                    <span>•</span>
                    <span>⏱️ {win.days}ي</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`text-lg font-bold ${
                    parseInt(win.roi) >= 300 ? 'text-vea-green' :
                    parseInt(win.roi) >= 200 ? 'text-vea-blue' :
                    'text-vea-gold'
                  }`}>
                    {win.roi}
                  </div>
                  <div className="text-xs text-muted-foreground">ROI</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  win.impact === 'ضخم' ? 'bg-vea-red-light text-vea-red' :
                  win.impact === 'عالي' ? 'bg-vea-orange-light text-vea-orange' :
                  'bg-vea-gold-light text-vea-gold'
                }`}>
                  التأثير: {win.impact}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  win.effort === 'خفيف' ? 'bg-vea-green-light text-vea-green' : 'bg-vea-orange-light text-vea-orange'
                }`}>
                  الجهد: {win.effort}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded text-xs ${
                  win.status === 'مكتمل' ? 'bg-vea-green/20 text-vea-green' :
                  win.status === 'قيد العمل' ? 'bg-vea-blue/20 text-vea-blue' :
                  win.status === 'مخطط' ? 'bg-vea-gold/20 text-vea-gold' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {win.status}
                </span>
                <button className="text-vea-blue hover:text-vea-blue/80 text-sm font-medium">
                  بدا ←
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-vea-green-light to-vea-blue-light rounded-2xl shadow-card p-6 border border-vea-green/20">
        <h3 className="text-xl font-bold mb-4">الأولويات المقترحة</h3>
        <div className="space-y-4">
          {[
            { rank: 1, action: 'صفحة "مشاكل علاج الأسنان في تركيا" بريطانيا', reason: 'العائق الرئيسي للتحويل في بريطانيا' },
            { rank: 2, action: 'تحسين سرعة الموقع', reason: 'تأثير على كل الصفحات + Core Web Vitals' },
            { rank: 3, action: 'آلة حاسبة أسعار تفاعلية', reason: 'تزيد الوقت في الموقع بشكل كبير' },
            { rank: 4, action: 'Google Business Profile لكل الدول', reason: 'تأثير محلي فوري + آراء' }
          ].map((item) => (
            <div key={item.rank} className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <div className="w-10 h-10 rounded-full bg-vea-blue text-primary-foreground flex items-center justify-center font-bold text-lg">
                {item.rank}
              </div>
              <div className="flex-1 text-right">
                <div className="font-bold text-foreground">{item.action}</div>
                <div className="text-sm text-muted-foreground">{item.reason}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-vea-blue rotate-180" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickWinsSection;
