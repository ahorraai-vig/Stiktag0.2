import React from 'react';
import { Layers, Radio, QrCode, Shield, Droplets, Zap, CheckCircle2 } from 'lucide-react';

export const TechAndMaterials: React.FC = () => {
  return (
    <section id="tecnologia" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider">
            <span>Ingeniería Física & Digital</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span>Materiales de Alta Resistencia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight" style={{ textWrap: 'balance' }}>
            La combinación perfecta: NFC de aproximación + QR de respaldo óptico.
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Cada soporte físico se produce combinando corte láser micrométrico con chips semiconductores NXP pasivos encapsulados para resistir el uso diario en restaurantes, talleres y clínicas.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Metacrilato & Acrílicos */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Metacrilato Óptico de Colada (PMMA)</h3>
              <p className="text-xs text-slate-500 mt-1">Grosor de 4 a 6 mm cortado al láser</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Superficie pulida al diamante que resiste rayaduras y desinfectantes hidroalcohólicos. Disponible en acabado transparente cristal, blanco opalino, satinado mate y espejo dorado.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Impresión directa UV con secado LED</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Peanas sólidas antivuelco de encastre</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Chip NFC NTAG Pasivo */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Chips NXP NTAG213 / 215 / 216</h3>
              <p className="text-xs text-slate-500 mt-1">Frecuencia 13.56 MHz (Estándar ISO 14443-A)</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Totalmente pasivos: no necesitan pilas ni baterías nunca. Obtienen la energía de la antena del propio smartphone al acercarlo a menos de 4 centímetros.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+100.000 ciclos de lectura garantizados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Lectura instantánea en &lt; 0.1 segundos</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Vinilos & Resinas Impermeables */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Resina Epoxi 3D & Vinilo Exterior</h3>
              <p className="text-xs text-slate-500 mt-1">Protección IP68 contra agua, sol y grasa</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Para los adhesivos de vehículos, posavasos de café e imanes de nevera, el chip queda herméticamente sellado bajo una capa de resina de poliuretano flexible o vinilo laminado.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Soporta lavados a presión e intemperie</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Protección contra blindaje ferromagnético</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
