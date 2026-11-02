import React from 'react';
import { ShieldCheck, Truck, Cpu, Mail, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenDashboard }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      
      {/* Upper features strip */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Chips NFC Certificados</p>
              <p className="text-[11px] text-slate-500">NTAG213 / NTAG215 originales NXP</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Garantía de Retención</p>
              <p className="text-[11px] text-slate-500">10 años y +100.000 lecturas garantizadas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Corte Láser a la Silueta</p>
              <p className="text-[11px] text-slate-500">Troquelado libre en metacrilato y madera</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Envío Rápido Peninsular</p>
              <p className="text-[11px] text-slate-500">Gratis a partir de 50 € de pedido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand identity */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
              A
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">
              Ahorra<span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
              ahorraai.com
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Especialistas en ingeniería de soportes interactivos troquelados con chip NFC y QR de alta visibilidad. Diseñados para potenciar la experiencia física en comercios, clínicas, talleres y restaurantes.
          </p>

          <div className="flex items-center gap-2 pt-1 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <a href="mailto:ahorraai@gmail.com" className="hover:text-white transition-colors">
              ahorraai@gmail.com
            </a>
          </div>
        </div>

        {/* Links: Formatos */}
        <div className="md:col-span-3 space-y-2">
          <p className="font-bold text-white text-xs uppercase tracking-wider">Formatos Troquelados</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors">Carteles Acrílicos con Peana</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors">Packs Tótem de Barra + Llaveros</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors">Posavasos Inteligentes Grano de Café</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors">Imanes Nevera con Silueta</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors">Adhesivos Vinílicos para Vehículos y Delivery</button></li>
            <li><button onClick={() => onNavigateSection('catalogo')} className="hover:text-white transition-colors">Pines y Chapas de Camarero con Imán</button></li>
          </ul>
        </div>

        {/* Links: Sectores & Soluciones */}
        <div className="md:col-span-3 space-y-2">
          <p className="font-bold text-white text-xs uppercase tracking-wider">Sectores & Flujos</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><button onClick={() => onNavigateSection('sectores')} className="hover:text-white transition-colors">Hostelería: Menús y Propinas</button></li>
            <li><button onClick={() => onNavigateSection('sectores')} className="hover:text-white transition-colors">Clínicas Dentales: Citas e Higiene</button></li>
            <li><button onClick={() => onNavigateSection('sectores')} className="hover:text-white transition-colors">Talleres Mecánicos: Llaveros de ITV</button></li>
            <li><button onClick={() => onNavigateSection('sectores')} className="hover:text-white transition-colors">Inmobiliarias: Fichas & Tours 360°</button></li>
            <li><button onClick={() => onNavigateSection('sectores')} className="hover:text-white transition-colors">Barberías & Estética: Agendas de Cita</button></li>
          </ul>
        </div>

        {/* Business Management link */}
        <div className="md:col-span-2 space-y-2">
          <p className="font-bold text-white text-xs uppercase tracking-wider">Gestión & Empresa</p>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button onClick={onOpenDashboard} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Panel de Negocios
              </button>
            </li>
            <li><button onClick={onOpenDashboard} className="hover:text-white transition-colors">Redirección Dinámica</button></li>
            <li><button onClick={onOpenDashboard} className="hover:text-white transition-colors">Estadísticas de Taps</button></li>
            <li><button onClick={onOpenDashboard} className="hover:text-white transition-colors">Programador NFC Web</button></li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AhorraAI (ahorraai.com). Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Privacidad B2B</span>
            <span aria-hidden="true">·</span>
            <span>Aviso Legal</span>
            <span aria-hidden="true">·</span>
            <span>Soporte: ahorraai@gmail.com</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
