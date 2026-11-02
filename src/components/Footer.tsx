import React from 'react';
import { ShieldCheck, Truck, Cpu, Mail, Sparkles, Bot, PhoneCall, Star } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAiAgent: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAiAgent }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      
      {/* Upper features strip */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Chips NFC NXP Originales</p>
              <p className="text-[11px] text-slate-500">NTAG213 con antena calibrada</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Acrílico con Espacio Reservado</p>
              <p className="text-[11px] text-slate-500">Hueco blanco exacto para pegatina NFC + QR</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">2 Modos Simplificados</p>
              <p className="text-[11px] text-slate-500">Solo Reseñas Google o Perfil Unitree</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Asistente IA de Soporte</p>
              <p className="text-[11px] text-slate-500">Atención 24/7 y gestión de cambios de enlace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand identity */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
              A
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">
              Ahorra<span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
              ahorraai.com · Vigo
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Carteles acrílicos troquelados con formas profesionales y espacio blanco milimétrico para fijar tu etiqueta NFC con QR impreso. Solución ultra sencilla y directa para negocios en Vigo y toda España.
          </p>

          <div className="pt-2 flex flex-col gap-1.5 text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <a href="mailto:ahorraai@gmail.com" className="hover:text-white transition-colors">
                ahorraai@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Soporte por WhatsApp y Asistente IA</span>
            </div>
          </div>
        </div>

        {/* Links: Formatos Destacados */}
        <div className="md:col-span-4 space-y-2">
          <p className="font-bold text-white text-xs uppercase tracking-wider">Formatos Troquelados</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors cursor-pointer">Tótems Google Review 5 Estrellas</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors cursor-pointer">Expositores de Hostelería (Hamburguesa, Croissant, Cerveza)</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors cursor-pointer">Soportes Clínicas Dentales & Farmacia</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors cursor-pointer">Llaveros y Carteles de Taller Automoción</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors cursor-pointer">Placas y Llaveros Inmobiliaria con Forma de Casa</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors cursor-pointer">Estacas de Botánica Monstera & Posavasos Café</button></li>
          </ul>
        </div>

        {/* Links: Atención & Soporte */}
        <div className="md:col-span-3 space-y-2">
          <p className="font-bold text-white text-xs uppercase tracking-wider">Soporte & Asistencia</p>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button 
                onClick={onOpenAiAgent}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Consultar con Asistente IA</span>
              </button>
            </li>
            <li className="text-slate-400 leading-relaxed">
              ¿Quieres modificar tu enlace de reseñas o tus datos de Unitree? Solicítalo en cualquier momento al Asistente IA o escríbenos directamente.
            </li>
            <li className="pt-1">
              <span className="text-emerald-400 font-mono text-[10px]">● Soporte Activo en Vigo</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AhorraAI (ahorraai.com). Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Metacrilato Troquelado</span>
            <span aria-hidden="true">·</span>
            <span>NFC Tools & Unitree</span>
            <span aria-hidden="true">·</span>
            <span>Vigo, Galicia</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
