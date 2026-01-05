import { CheckCircle } from 'lucide-react';
import { technicalSEO } from '@/data/veahealth-data';

const TechnicalSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">SEO التقني</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {technicalSEO.map((tech, idx) => (
            <div key={idx} className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">{tech.category}</h3>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                    tech.priority === 'حرج' ? 'bg-vea-red-light text-vea-red' : 'bg-vea-orange-light text-vea-orange'
                  }`}>
                    {tech.priority}
                  </span>
                  <span className="text-lg font-bold">{tech.progress}%</span>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 mb-6">
                <div 
                  className={`h-2 rounded-full ${tech.priority === 'حرج' ? 'bg-vea-red' : 'bg-vea-orange'}`}
                  style={{ width: `${tech.progress}%` }}
                />
              </div>
              
              <ul className="space-y-3">
                {tech.items.map((item, i) => (
                  <li key={i} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      {item.check ? (
                        <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-border mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{item.task}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.impact === 'حرج' ? 'bg-vea-red-light text-vea-red' :
                      item.impact === 'عالي' ? 'bg-vea-orange-light text-vea-orange' :
                      'bg-vea-gold-light text-vea-gold'
                    }`}>
                      {item.impact}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4">الأدوات المطلوبة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Ahrefs', purpose: 'تحليل باكلينكس + كلمات مفتاحية', price: '€179/شهر' },
            { name: 'Screaming Frog', purpose: 'فحص تقني', price: '€209/سنة' },
            { name: 'SEMrush', purpose: 'تحليل المنافسة', price: '€119/شهر' },
            { name: 'Google Search Console', purpose: 'متابعة الأداء', price: 'مجاني' },
            { name: 'Hotjar', purpose: 'تحليل سلوك المستخدمين', price: '€99/شهر' },
            { name: 'WordPress + RankMath', purpose: 'CMS + SEO plugin', price: '€79/شهر' },
            { name: 'CDN (Cloudflare)', purpose: 'سرعة + أمان', price: '€20/شهر' },
            { name: 'Vercel/Netlify', purpose: 'استضافة + نشر', price: '€50/شهر' }
          ].map((tool, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg bg-card">
              <div className="font-bold mb-1">{tool.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{tool.purpose}</div>
              <div className="text-sm font-medium text-vea-blue">{tool.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSection;
