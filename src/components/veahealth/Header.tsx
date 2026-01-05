import { Globe, Download } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-vea-blue via-vea-green to-vea-purple rounded-2xl shadow-elevated p-6 md:p-8 mb-6 text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-foreground/10" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-background/20 p-3 rounded-xl backdrop-blur">
              <Globe className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">استراتيجية SEO كاملة لـ VeaHealth</h1>
              <p className="text-primary-foreground/80 text-lg mt-1">علاج الأسنان في تركيا • 3 قارات • المركز الأول في 6 أشهر</p>
            </div>
          </div>
          <button className="bg-background text-vea-blue px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2">
            <Download className="w-4 h-4" />
            نزل الاستراتيجية
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-background/20 backdrop-blur rounded-xl p-4 border border-background/30">
            <div className="text-sm font-semibold opacity-90">هدف الحركة السنة 1</div>
            <div className="text-2xl font-bold mt-1">50K+/شهر</div>
            <div className="text-xs opacity-75 mt-1">+1200% ضد الحالي</div>
          </div>
          <div className="bg-background/20 backdrop-blur rounded-xl p-4 border border-background/30">
            <div className="text-sm font-semibold opacity-90">Leads شهرياً</div>
            <div className="text-2xl font-bold mt-1">400-500</div>
            <div className="text-xs opacity-75 mt-1">€250 CPA متوسط</div>
          </div>
          <div className="bg-background/20 backdrop-blur rounded-xl p-4 border border-background/30">
            <div className="text-sm font-semibold opacity-90">ROI متوقع</div>
            <div className="text-2xl font-bold mt-1">400%</div>
            <div className="text-xs opacity-75 mt-1">€500K+ دخل/شهر</div>
          </div>
          <div className="bg-background/20 backdrop-blur rounded-xl p-4 border border-background/30">
            <div className="text-sm font-semibold opacity-90">الميزانية الكاملة</div>
            <div className="text-2xl font-bold mt-1">€53K</div>
            <div className="text-xs opacity-75 mt-1">€4.4K/شهر</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
