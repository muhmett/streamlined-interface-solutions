import { useState } from 'react';
import { Search, CheckCircle, FileText, Video, BarChart3 } from 'lucide-react';
import { allKeywords, Keyword } from '@/data/veahealth-data';

interface KeywordsSectionProps {
  activeMarket: string;
}

const KeywordsSection = ({ activeMarket }: KeywordsSectionProps) => {
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const keywords = allKeywords[activeMarket] || [];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Search className="w-7 h-7 text-vea-blue" />
          كلمات مفتاحية - {activeMarket === 'uk' ? 'بريطانيا' : activeMarket === 'europe' ? 'أوروبا' : 'الشرق الأوسط'}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-right py-3 px-4 font-bold text-foreground">الكلمة المفتاحية</th>
                {activeMarket !== 'uk' && <th className="text-right py-3 px-4 font-bold text-foreground">البلد</th>}
                <th className="text-right py-3 px-4 font-bold text-foreground">الحجم</th>
                <th className="text-right py-3 px-4 font-bold text-foreground">CPC</th>
                <th className="text-right py-3 px-4 font-bold text-foreground">الصعوبة</th>
                <th className="text-right py-3 px-4 font-bold text-foreground">الفرصة</th>
                <th className="text-right py-3 px-4 font-bold text-foreground">الأولوية</th>
                <th className="text-right py-3 px-4 font-bold text-foreground">النية</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedKeyword(kw)}
                >
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-foreground">{kw.term}</span>
                  </td>
                  {activeMarket !== 'uk' && (
                    <td className="py-4 px-4 text-right text-xl">{kw.country}</td>
                  )}
                  <td className="py-4 px-4 text-right font-medium">{kw.volume}</td>
                  <td className="py-4 px-4 text-right font-bold text-vea-green">{kw.cpc}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end">
                      <span className="font-medium ml-3">{kw.difficulty}</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${kw.difficulty > 80 ? 'bg-vea-red' : kw.difficulty > 70 ? 'bg-vea-orange' : 'bg-vea-green'}`}
                          style={{ width: `${kw.difficulty}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end">
                      <span className="font-medium ml-3">{kw.opportunity}</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-vea-green"
                          style={{ width: `${kw.opportunity}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      kw.priority === 'حرج' ? 'bg-vea-red-light text-vea-red' :
                      kw.priority === 'عالية' ? 'bg-vea-orange-light text-vea-orange' :
                      'bg-vea-gold-light text-vea-gold'
                    }`}>
                      {kw.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-3 py-1 rounded-full bg-vea-blue-light text-vea-blue font-medium text-xs">
                      {kw.intent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selectedKeyword && (
          <div className="mt-6 p-6 bg-vea-blue-light rounded-xl border border-vea-blue/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-foreground">تحليل مفصل: {selectedKeyword.term}</h3>
              <button onClick={() => setSelectedKeyword(null)} className="text-muted-foreground hover:text-foreground text-xl">
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">التوصيات</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
                    <span>عمل صفحة مخصصة بمحتوى 1500+ كلمة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
                    <span>إضافة FAQ schema markup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-vea-green mt-0.5 flex-shrink-0" />
                    <span>تحسين للنتيجة المميزة</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">محتوى مقترح</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-vea-blue mt-0.5 flex-shrink-0" />
                    <span>دليل كامل على الموضوع</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Video className="w-5 h-5 text-vea-red mt-0.5 flex-shrink-0" />
                    <span>فيديو توضيحي (3-5 دقائق)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="w-5 h-5 text-vea-purple mt-0.5 flex-shrink-0" />
                    <span>رسم بياني / مقارنة مرئية</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordsSection;
