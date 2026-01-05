import { Target, CheckCircle } from 'lucide-react';
import { dentalCrownInfo } from '@/data/veahealth-data';

const CrownInfoSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Target className="w-7 h-7 text-vea-blue" />
          معلومات تيجان الأسنان والزركون
        </h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-foreground/90">أنواع تيجان الأسنان</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dentalCrownInfo.types.map((type, idx) => (
              <div key={idx} className="border border-border rounded-xl p-5 hover:shadow-card transition-shadow bg-card">
                <div className="font-bold text-lg mb-2 text-vea-blue">{type.name}</div>
                <p className="text-muted-foreground mb-3">{type.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">السعر في تركيا</div>
                    <div className="font-bold text-vea-green">{type.price}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">المتانة</div>
                    <div className="font-bold text-vea-blue">{type.durability}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-foreground/90">مقارنة الأسعار بين الدول (تيجان الزركون)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-right py-3 px-4 font-bold text-foreground">البلد</th>
                  <th className="text-right py-3 px-4 font-bold text-foreground">تيجان الزركون</th>
                  <th className="text-right py-3 px-4 font-bold text-foreground">تيجان E-max</th>
                  <th className="text-right py-3 px-4 font-bold text-foreground">تيجان البورسلين</th>
                  <th className="text-right py-3 px-4 font-bold text-foreground">التوفير في تركيا</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dentalCrownInfo.marketComparison).map(([country, prices], idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4 text-right font-medium">
                      {country === 'turkey' ? 'تركيا' : 
                       country === 'uk' ? 'بريطانيا' : 
                       country === 'germany' ? 'ألمانيا' : 
                       country === 'france' ? 'فرنسا' : 'الإمارات'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold">{prices.zircon}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold">{prices.emax}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold">{prices.porcelain}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={`font-bold ${country === 'turkey' ? 'text-muted-foreground' : 'text-vea-green'}`}>
                        {country === 'turkey' ? 'مرجع' : '60-75%'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-vea-blue-light to-vea-green-light rounded-xl p-6 border border-vea-blue/20">
          <h3 className="font-bold text-foreground mb-3">نصائح للمحتوى حول تيجان الأسنان</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
              <span>عمل مقارنة مرئية بين أنواع التيجان</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
              <span>شرح فرق السعر بين الزركون والبورسلين</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
              <span>فيديو يشرح عملية تركيب التاج</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
              <span>صفحة FAQ عن مدة بقاء التاج والعناية به</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrownInfoSection;
