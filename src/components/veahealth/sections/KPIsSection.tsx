import { BarChart3 } from 'lucide-react';
import { kpis, getColorClasses } from '@/data/veahealth-data';

const KPIsSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-vea-blue" />
          KPIs والأهداف
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-right py-3 px-4 font-bold text-foreground">المقياس</th>
                  <th className="text-center py-3 px-4 font-bold text-muted-foreground">الحالي</th>
                  <th className="text-center py-3 px-4 font-bold text-vea-blue">3 أشهر</th>
                  <th className="text-center py-3 px-4 font-bold text-vea-green">6 أشهر</th>
                  <th className="text-center py-3 px-4 font-bold text-vea-purple">12 شهر</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi, idx) => {
                  const kpiCC = getColorClasses(kpi.color);
                  return (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3 justify-end">
                          <div className={`p-2 rounded-lg ${kpiCC.bgLight} ${kpiCC.text}`}>
                            {kpi.icon}
                          </div>
                          <span className="font-semibold text-foreground">{kpi.metric}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="text-muted-foreground font-medium">{kpi.current}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="text-vea-blue font-bold">{kpi.target3m}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="text-vea-green font-bold">{kpi.target6m}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="text-vea-purple font-bold">{kpi.target12m}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">توقعات الإيرادات</h4>
            <div className="space-y-4">
              {[
                { period: 'الأشهر 1-3', leads: '150-240', avgValue: '€3,500', revenue: '€525K-840K' },
                { period: 'الأشهر 4-6', leads: '450-600', avgValue: '€3,500', revenue: '€1.6M-2.1M' },
                { period: 'الأشهر 7-9', leads: '900-1,200', avgValue: '€4,000', revenue: '€3.6M-4.8M' },
                { period: 'الأشهر 10-12', leads: '1,600-2,000', avgValue: '€4,200', revenue: '€6.7M-8.4M' }
              ].map((proj, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg bg-card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{proj.period}</span>
                    <span className="text-lg font-bold text-vea-green">{proj.revenue}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{proj.leads} leads</span>
                    <span>القيمة المتوسطة: {proj.avgValue}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-vea-blue-light rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-bold">ROI الكلي المتوقع (12 شهر)</span>
                <span className="text-2xl font-bold text-vea-green">400%</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                الاستثمار: €53K • الإيرادات: €12.4M-16.1M
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIsSection;
