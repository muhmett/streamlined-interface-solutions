import { ThumbsUp, TrendingDown, Target, Video, Zap, DollarSign } from 'lucide-react';
import { competitiveAnalysis } from '@/data/veahealth-data';

const CompetitionSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {competitiveAnalysis.map((comp, idx) => (
          <div key={idx} className="bg-card rounded-2xl shadow-card p-6 border-r-4 border-vea-purple">
            <div className="flex items-start justify-between mb-4">
              <div className="text-right">
                <h3 className="text-xl font-bold text-foreground">{comp.competitor}</h3>
                <a href={`https://${comp.url}`} className="text-sm text-vea-blue hover:underline">{comp.url}</a>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-vea-purple">DR{comp.dr}</div>
                <div className="text-sm text-muted-foreground">الحركة: {comp.traffic}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-vea-green-light rounded-lg">
                <h4 className="font-semibold text-vea-green mb-2 flex items-center gap-2 justify-end">
                  <ThumbsUp className="w-4 h-4" /> نقاط القوة
                </h4>
                <ul className="space-y-1 text-right">
                  {comp.strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start justify-end">
                      <span className="text-vea-green ml-1">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-vea-red-light rounded-lg">
                <h4 className="font-semibold text-vea-red mb-2 flex items-center gap-2 justify-end">
                  <TrendingDown className="w-4 h-4" /> نقاط الضعف
                </h4>
                <ul className="space-y-1 text-right">
                  {comp.weaknesses.slice(0, 3).map((w, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start justify-end">
                      <span className="text-vea-red ml-1">✗</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-vea-gold-light border border-vea-gold/30 rounded-lg p-4">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 justify-end">
                <Target className="w-4 h-4" /> فرصة لـ VeaHealth
              </h4>
              <p className="text-sm text-foreground/80 text-right">{comp.opportunity}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold mb-4">مزايا VeaHealth التنافسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'محتوى فيديو غني', desc: '500+ تجربة فيديو ضد <100 للمنافسة', icon: <Video /> },
            { title: 'UX حديث وسريع', desc: 'نتيجة Pagespeed >90 ضد 40-60 للمنافسة', icon: <Zap /> },
            { title: 'تركيز على تركيا', desc: 'تخصص فريد ضد وجهات متعددة', icon: <Target /> },
            { title: 'أسعار شفافة', desc: 'آلة حاسبة تفاعلية + شمولية', icon: <DollarSign /> }
          ].map((adv, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg bg-vea-blue-light">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-vea-blue/10 text-vea-blue rounded-lg">
                  {adv.icon}
                </div>
                <div className="font-bold text-foreground">{adv.title}</div>
              </div>
              <p className="text-sm text-muted-foreground">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetitionSection;
