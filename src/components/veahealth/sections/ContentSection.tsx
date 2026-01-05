import { CheckCircle } from 'lucide-react';
import { contentPillars, getColorClasses } from '@/data/veahealth-data';

const ContentSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">4 ركائز المحتوى</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentPillars.map((pillar, pidx) => {
            const pillarCC = getColorClasses(pillar.color);
            return (
              <div key={pidx} className="border border-border rounded-2xl p-5 hover:shadow-card transition-shadow bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${pillarCC.bgLight} p-3 rounded-xl ${pillarCC.text}`}>
                      {pillar.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{pillar.title}</h3>
                      <p className="text-sm text-muted-foreground">{pillar.description}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">{pillar.progress}%</div>
                    <div className="text-xs text-muted-foreground">مكتمل</div>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2 mb-6">
                  <div 
                    className={`h-2 rounded-full ${pillarCC.bg}`}
                    style={{ width: `${pillar.progress}%` }}
                  />
                </div>
                
                <div className="space-y-4">
                  {pillar.pages.map((page, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{page.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">السوق: {page.market}</span>
                            <span className="text-sm text-muted-foreground">• آخر أجل: {page.deadline}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            page.priority === 'حرج' ? 'bg-vea-red-light text-vea-red' : 'bg-vea-orange-light text-vea-orange'
                          }`}>
                            {page.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            page.status === 'أولوية' ? 'bg-vea-red-light text-vea-red' :
                            page.status === 'قيد العمل' || page.status === 'قيد التنفيذ' ? 'bg-vea-blue-light text-vea-blue' :
                            page.status === 'مخطط' ? 'bg-vea-gold-light text-vea-gold' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {page.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {page.keywords.map((kw, j) => (
                          <span key={j} className="bg-vea-blue-light text-vea-blue px-3 py-1 rounded-full text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        {page.actions.slice(0, 3).map((action, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-vea-green mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{action}</span>
                          </div>
                        ))}
                        {page.actions.length > 3 && (
                          <div className="text-sm text-vea-blue font-medium cursor-pointer">
                            + {page.actions.length - 3} إجراءات أخرى
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
