import React, { useState } from 'react';
import { Radio, Star, Globe, Phone, MessageSquare, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const InteractiveNfcDemo: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'google_reviews' | 'unitree_contact'>('google_reviews');
  const [isTapping, setIsTapping] = useState(false);
  const [hasTapped, setHasTapped] = useState(false);

  const handleSimulateTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setHasTapped(true);
    }, 500);
  };

  return (
    <section id="como-funciona" className="py-16 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
            <span>Experiencia Sin Complicaciones</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>Simulador Interactivo de Lectura</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight" style={{ textWrap: 'balance' }}>
            Así funciona: un cartel troquelado con espacio para tu chip NFC + QR.
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            El cliente solo acerca su móvil al cartel acrílico (o escanea el QR impreso en la etiqueta adhesiva). Se abre instantáneamente en su teléfono sin instalar ninguna aplicación. Pruébalo en vivo con las dos opciones disponibles:
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 2 Modes Selector */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Mode 1 Card */}
            <button
              type="button"
              onClick={() => {
                setActiveMode('google_reviews');
                setHasTapped(false);
              }}
              className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer ${
                activeMode === 'google_reviews'
                  ? 'border-indigo-500 bg-slate-800/90 shadow-md ring-1 ring-indigo-500/50'
                  : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Opción 1: Solo Reseñas de Google Maps</h3>
                  <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                    5 Estrellas Directas
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Ideal para mostradores de pago, barras y recepciones. Al aproximar el móvil, se abre de inmediato la ficha del negocio con el diálogo de 5 estrellas listo para valorar.
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Sin formularios intermedios · 1 solo toque</span>
                </div>
              </div>
            </button>

            {/* Mode 2 Card */}
            <button
              type="button"
              onClick={() => {
                setActiveMode('unitree_contact');
                setHasTapped(false);
              }}
              className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer ${
                activeMode === 'unitree_contact'
                  ? 'border-indigo-500 bg-slate-800/90 shadow-md ring-1 ring-indigo-500/50'
                  : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <Globe className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Opción 2: Perfil Multi-Contacto Unitree</h3>
                  <span className="text-[11px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                    NFC Tools
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Agrupa los 4 canales de contacto directos: <strong>Enlace Web, Llamada telefónica, SMS directo y Email</strong>. Sin depender de páginas web complejas ni mantenimiento costoso.
                </p>
                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>🌐 Web</span>
                  <span>📞 Teléfono</span>
                  <span>💬 SMS</span>
                  <span>✉️ Email</span>
                </div>
              </div>
            </button>

            {/* Explanatory callout about the physical workflow */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>¿Cómo lo preparamos nosotros?</span>
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Fabricamos el cartel de metacrilato con su troquel temático y el espacio blanco reservado. Desde la app <strong>NFC Tools / Unitree</strong> en el móvil, grabamos el chip NFC y generamos el QR para la pegatina adhesiva de alta adherencia. ¡Si en el futuro cambias de teléfono o enlace, contacta a nuestro agente IA o a nosotros para renovarlo!
              </p>
            </div>

          </div>

          {/* Right: Phone Simulator */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Simulator Trigger */}
            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateTap}
                disabled={isTapping}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Radio className={`w-4 h-4 ${isTapping ? 'animate-ping' : ''}`} />
                <span>Simular "Acercar Móvil al Cartel"</span>
              </button>
              <span className="text-xs text-slate-400 hidden sm:inline">o toca la pantalla</span>
            </div>

            {/* Smartphone Mockup */}
            <div 
              onClick={handleSimulateTap}
              className={`relative w-76 h-[500px] bg-slate-950 rounded-[40px] border-4 border-slate-700 shadow-2xl p-3 flex flex-col overflow-hidden cursor-pointer transition-all ${
                isTapping ? 'scale-98 ring-4 ring-indigo-400' : ''
              }`}
            >
              {/* Dynamic Island / Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
              </div>

              {/* Screen Area */}
              <div className="flex-1 bg-white rounded-3xl overflow-hidden text-slate-900 p-4 flex flex-col relative shadow-inner">
                
                {/* Top browser bar / NFC notification */}
                <div className="p-2 bg-slate-100 rounded-xl mb-3 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-mono text-[10px] truncate">
                      {activeMode === 'google_reviews' ? 'g.page/review' : 'unitree.me/ahorraai'}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    NFC Activo
                  </span>
                </div>

                {/* Scenario 1: Google Reviews */}
                {activeMode === 'google_reviews' && (
                  <div className="flex-1 flex flex-col justify-between py-2 text-center animate-in fade-in">
                    <div>
                      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-200">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Google Maps</p>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">Clínica & Comercio Vigo</h4>
                      <p className="text-xs text-slate-500 mt-1">Valora tu experiencia</p>
                      
                      {/* 5 Stars */}
                      <div className="flex items-center justify-center gap-1.5 my-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-xs" />
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1">
                      <p className="font-semibold text-slate-800 text-[11px]">Comparte los detalles:</p>
                      <p className="text-slate-500 text-[10px] italic">"Excelente trato, muy profesionales y rápidos. ¡Totalmente recomendado!"</p>
                    </div>

                    <div className="pt-2">
                      <div className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs shadow-xs text-center">
                        Publicar Reseña en Google
                      </div>
                    </div>
                  </div>
                )}

                {/* Scenario 2: Unitree Contact Profile */}
                {activeMode === 'unitree_contact' && (
                  <div className="flex-1 flex flex-col justify-between py-1 text-left animate-in fade-in">
                    <div>
                      <div className="text-center pb-3 border-b border-slate-100">
                        <div className="w-11 h-11 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-1.5 shadow-sm">
                          NB
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">Negocio & Servicios</h4>
                        <p className="text-[11px] text-slate-500">Perfil de contacto rápido Unitree</p>
                      </div>

                      <div className="space-y-2 mt-3">
                        {/* URL Button */}
                        <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 leading-none">Visitar Sitio Web</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">https://minegocio.com</p>
                            </div>
                          </div>
                        </div>

                        {/* Phone Button */}
                        <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 leading-none">Llamar Directamente</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">+34 986 000 000</p>
                            </div>
                          </div>
                        </div>

                        {/* SMS Button */}
                        <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 leading-none">Enviar SMS</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">+34 600 000 000</p>
                            </div>
                          </div>
                        </div>

                        {/* Email Button */}
                        <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                              <Mail className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 leading-none">Enviar Correo Email</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">contacto@minegocio.com</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center pt-2">
                      Generado con NFC Tools · Sin cuotas mensuales
                    </p>
                  </div>
                )}

              </div>

              {/* Bottom home indicator */}
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2 shrink-0" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
