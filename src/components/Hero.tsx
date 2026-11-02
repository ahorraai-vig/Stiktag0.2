import React from 'react';
import { ArrowRight, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenDashboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onOpenDashboard }) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial-[at_top_right] from-indigo-50/70 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Clean unboxed kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
              <span>AhorraAI Hardware & Smart Media</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>ahorraai.com</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Corte Láser & Chips NTAG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Soluciones físicas <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">QR y NFC</span> troqueladas a la forma exacta de tu marca.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Carteles acrílicos de sobremesa, posavasos, imanes de nevera, llaveros y vinilos con silueta de producto. Diseñados para optimizar flujos de trabajo en mesa o mostrador, acelerar reseñas Google de 5 estrellas y regalar merchandising con chip activo.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <span>Explorar Catálogo Troquelado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onOpenDashboard}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Panel de Negocios & Redirección</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Compatibilidad</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">100% Sin App</p>
                <p className="text-xs text-slate-500 mt-0.5">iPhone & Android nativo</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Durabilidad</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">Sin Batería</p>
                <p className="text-xs text-slate-500 mt-0.5">+100.000 lecturas / 10 años</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Control Digital</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">Dinámico en la Nube</p>
                <p className="text-xs text-slate-500 mt-0.5">Cambia URL sin reimprimir</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 group">
                <img
                  src="/assets/aistudio/google_five_star_totem_1793573581807_785ce530.jpg"
                  alt="Tótem Google Review 5 Estrellas con QR y NFC integrado"
                  className="w-full h-80 sm:h-96 object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Glass Overlay Badge */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-indigo-300 font-mono font-medium">Troquelado Láser de Precisión</p>
                      <p className="text-sm font-bold text-white">Tótem 5 Estrellas Google Review</p>
                    </div>
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono font-bold text-white">
                      NFC + QR
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating secondary miniature asset card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-xl shadow-xl border border-slate-200 hidden sm:flex items-center gap-3 max-w-xs animate-in fade-in duration-500">
                <img
                  src="/assets/aistudio/diecut_burger_gourmet_1793500024227_42240587.jpg"
                  alt="Hamburguesa de sobremesa"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Formatos de Hostelería</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Cartas táctiles y pago en mesa</p>
                  <span className="text-indigo-600 font-semibold text-[11px]">Metacrilato 5mm bicapa</span>
                </div>
              </div>

              {/* Floating Keyring badge */}
              <div className="absolute -top-4 -right-4 bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 hidden sm:flex items-center gap-2">
                <img
                  src="/assets/aistudio/diecut_real_estate_house_1793489456675_9877f008.jpg"
                  alt="Pack Inmobiliaria"
                  className="w-10 h-10 rounded-md object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-[11px]">
                  <p className="font-bold text-slate-900">Pack Tótem + Llaveros</p>
                  <p className="text-emerald-600 font-medium">Listo para grabar</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
