import React, { useState } from 'react';
import { Radio, QrCode, Star, Utensils, MessageSquare, Home, Sparkles, Check, ArrowRight } from 'lucide-react';

export const InteractiveNfcDemo: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'reviews' | 'menu' | 'whatsapp' | 'tour'>('reviews');
  const [isTapping, setIsTapping] = useState(false);
  const [hasTapped, setHasTapped] = useState(false);

  const handleSimulateTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setHasTapped(true);
    }, 600);
  };

  return (
    <section id="como-funciona" className="py-16 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
            <span>Experiencia Sin Fricción</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>Simulador Interactivo en Vivo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight" style={{ textWrap: 'balance' }}>
            Así interactúa tu cliente: acercar el móvil y listo en 1 segundo.
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Sin descargar apps, sin registrarse, sin pedir claves de Wi-Fi y sin buscar en Google. Pruébalo ahora mismo seleccionando un caso de uso:
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Scenarios Selector */}
          <div className="lg:col-span-6 space-y-3">
            {[
              {
                id: 'reviews',
                icon: Star,
                title: 'Tótem Google Review 5 Estrellas',
                tag: 'Hostelería, Clínicas & Tiendas',
                desc: 'El cliente paga la cuenta, acerca su móvil al cartel dorado de estrellas y se abre de inmediato la pantalla para valorar con 5 estrellas en Google Maps.',
                productImg: '/assets/aistudio/google_five_star_totem_1793573581807_785ce530.jpg'
              },
              {
                id: 'menu',
                icon: Utensils,
                title: 'Expositor Hamburguesa o Menú en Mesa',
                tag: 'Restaurantes, Bares & Cafés',
                desc: 'Al sentarse en la mesa, el comensale apoya el smartphone o escanea el QR integrado para ver la carta con fotos, precios y alérgenos.',
                productImg: '/assets/aistudio/diecut_burger_gourmet_1793500024227_42240587.jpg'
              },
              {
                id: 'whatsapp',
                icon: MessageSquare,
                title: 'Llavero Llave Taller o Imán Dental',
                tag: 'Automoción & Salud',
                desc: 'El cliente se lleva el llavero o imán a casa. Cuando necesita cita previa o una consulta urgente, apoya el móvil y abre un chat directo de WhatsApp con su número.',
                productImg: '/assets/aistudio/diecut_mechanic_wrench_keychain_1793488413939_910c28a3.jpg'
              },
              {
                id: 'tour',
                icon: Home,
                title: 'Placa Inmobiliaria Casa con Tour 360°',
                tag: 'Agencias & Promotoras',
                desc: 'Frente al escaparate o en la puerta de la propiedad, cualquier interesado escanea o toca y realiza un recorrido virtual inmersivo por el interior.',
                productImg: '/assets/aistudio/diecut_real_estate_house_1793489456675_9877f008.jpg'
              }
            ].map((scenario) => {
              const Icon = scenario.icon;
              const isSelected = activeScenario === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => {
                    setActiveScenario(scenario.id as any);
                    setHasTapped(false);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'border-indigo-500 bg-slate-800/90 shadow-md ring-1 ring-indigo-500/50'
                      : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <img
                    src={scenario.productImg}
                    alt={scenario.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-indigo-400" />
                        <span>{scenario.title}</span>
                      </p>
                      <span className="text-[10px] font-mono text-indigo-400 font-semibold">{scenario.tag}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {scenario.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Phone Simulator */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Action Simulator Prompt */}
            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateTap}
                disabled={isTapping}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Radio className={`w-4 h-4 ${isTapping ? 'animate-ping' : ''}`} />
                <span>Simular "Acercar Móvil con NFC"</span>
              </button>
              <span className="text-xs text-slate-400 hidden sm:inline">o pulsa en la pantalla del móvil</span>
            </div>

            {/* Smartphone Mockup */}
            <div 
              onClick={handleSimulateTap}
              className={`relative w-72 h-[480px] bg-slate-950 rounded-[38px] border-4 border-slate-700 shadow-2xl p-3 flex flex-col overflow-hidden cursor-pointer transition-all ${
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
                    <Radio className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span className="font-mono text-[10px] truncate">Etiqueta NFC detectada</span>
                  </div>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    Abriendo...
                  </span>
                </div>

                {/* Scenario Screen Content */}
                {activeScenario === 'reviews' && (
                  <div className="flex-1 flex flex-col justify-between py-2 text-center animate-in fade-in">
                    <div>
                      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-200">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">Google Maps Reviews</p>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">Burger Joint Fuencarral</h4>
                      <p className="text-xs text-slate-500 mt-1">¿Cómo fue tu experiencia hoy?</p>
                      
                      {/* 5 Stars clicker */}
                      <div className="flex items-center justify-center gap-1 my-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left text-xs">
                      <p className="font-semibold text-slate-800 text-[11px]">Escribe tu opinión:</p>
                      <p className="text-slate-500 text-[10px] italic mt-0.5">"¡La mejor smash burger de la zona, servicio rapidísimo!"</p>
                    </div>

                    <div className="pt-2">
                      <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-xs shadow-xs">
                        Publicar Reseña
                      </button>
                    </div>
                  </div>
                )}

                {activeScenario === 'menu' && (
                  <div className="flex-1 flex flex-col justify-between py-1 text-left animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Carta Digital en Mesa 04</h4>
                          <span className="text-[10px] text-emerald-600">● Pedido directo habilitado</span>
                        </div>
                        <Utensils className="w-4 h-4 text-indigo-600" />
                      </div>

                      <div className="space-y-2 mt-2">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-800">Smash Trufada Doble</p>
                            <p className="text-[10px] text-slate-500">Queso cheddar, salsa de trufa</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-900">12,50 €</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-800">Cerveza Artesana IPA</p>
                            <p className="text-[10px] text-slate-500">Tirador frío 33cl</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-900">4,20 €</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-xs flex items-center justify-center gap-1">
                      <span>Enviar Pedido a Cocina</span>
                    </button>
                  </div>
                )}

                {activeScenario === 'whatsapp' && (
                  <div className="flex-1 flex flex-col justify-between py-2 text-left animate-in fade-in">
                    <div>
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                          T
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Taller Mecánico Central</p>
                          <p className="text-[10px] text-slate-500">En línea para citas</p>
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-xs text-slate-700 mt-4">
                        <p className="text-[11px] font-medium text-emerald-900">Mensaje automático pre-cargado:</p>
                        <p className="text-[10px] text-slate-600 mt-1 italic">
                          "Hola Taller Central, tengo vuestro llavero en mis llaves y necesito reservar cita de revisión de aceite y filtros para mi coche."
                        </p>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-xs flex items-center justify-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Enviar por WhatsApp</span>
                    </button>
                  </div>
                )}

                {activeScenario === 'tour' && (
                  <div className="flex-1 flex flex-col justify-between py-2 text-left animate-in fade-in">
                    <div>
                      <div className="h-28 rounded-lg overflow-hidden bg-slate-800 relative">
                        <img 
                          src="/assets/aistudio/diecut_real_estate_house_1793489456675_9877f008.jpg" 
                          alt="Inmueble" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white/90 text-slate-900 font-bold text-[10px] px-2 py-1 rounded-full">
                            Explorar 360°
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs">
                        <p className="font-bold text-slate-900">Ático Dúplex Residencial Bahía</p>
                        <p className="text-[10px] text-slate-500">140 m² · 3 hab · Terraza 45 m²</p>
                        <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">385.000 €</p>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-xs shadow-xs">
                      Contactar con el Agente
                    </button>
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
