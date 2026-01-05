import { Download, PlayCircle } from 'lucide-react';

const Footer = () => {
  return (
    <div className="mt-8 bg-gradient-to-r from-vea-blue via-vea-green to-vea-purple rounded-2xl p-8 text-primary-foreground text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-foreground/10" />
      <div className="relative z-10">
        <h3 className="text-3xl font-bold mb-3">🚀 الاستراتيجية الكاملة جاهزة للتنفيذ</h3>
        <p className="text-primary-foreground/80 text-lg mb-6">3 قارات • 6 لغات • 50K+ زائر/شهر هدف</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-background/20 backdrop-blur rounded-xl p-4">
            <div className="text-sm opacity-90">الميزانية الكاملة</div>
            <div className="text-2xl font-bold">€53K</div>
          </div>
          <div className="bg-background/20 backdrop-blur rounded-xl p-4">
            <div className="text-sm opacity-90">كلمات مفتاحية أساسية</div>
            <div className="text-2xl font-bold">80+</div>
          </div>
          <div className="bg-background/20 backdrop-blur rounded-xl p-4">
            <div className="text-sm opacity-90">ROI متوقع</div>
            <div className="text-2xl font-bold">400%</div>
          </div>
          <div className="bg-background/20 backdrop-blur rounded-xl p-4">
            <div className="text-sm opacity-90">الصفحات اللي خاصنا نصنعوها</div>
            <div className="text-2xl font-bold">50+</div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="bg-background text-vea-blue px-8 py-3 rounded-lg font-bold text-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-3">
            <Download className="w-5 h-5" />
            نزل الPDF الكامل
          </button>
          <button className="bg-transparent border-2 border-background text-primary-foreground px-8 py-3 rounded-lg font-bold text-lg hover:bg-background/20 transition-colors flex items-center justify-center gap-3">
            <PlayCircle className="w-5 h-5" />
            شوف الديمو بالفيديو
          </button>
        </div>
        
        <div className="mt-6 text-sm text-primary-foreground/70">
          الاستراتيجية محدثة في {new Date().toLocaleDateString('ar-MA')} • النسخة 2.0
        </div>
      </div>
    </div>
  );
};

export default Footer;
