import React from 'react';
import { ShoppingBag, Bot, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  openCart: () => void;
  onOpenAiAgent: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  openCart,
  onOpenAiAgent,
  onNavigateSection
}) => {
  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Brand identity */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Ahorra<span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[11px] font-mono tracking-tight text-slate-500">
              ahorraai.com · Vigo
            </span>
          </div>
        </button>

        {/* Clean nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button 
            onClick={() => handleNavClick('catalogo')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Catálogo Troquelado
          </button>
          <button 
            onClick={() => handleNavClick('como-funciona')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cómo Funciona (Google / Unitree)
          </button>
          <button 
            onClick={() => handleNavClick('tecnologia')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Acrílico & Chips NFC
          </button>
          <button 
            onClick={() => handleNavClick('contacto-custom')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Diseño a Medida
          </button>
        </nav>

        {/* Action cluster: Asistente IA + Carrito */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAiAgent}
            aria-label="Abrir asistente de soporte IA"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Asistente IA</span>
            <span className="text-[10px] bg-indigo-600 text-white font-mono px-1 py-0.2 rounded font-medium">Soporte</span>
          </button>

          <button
            onClick={openCart}
            aria-label="Abrir carrito de compras"
            className="relative px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pedido</span>
            {cartCount > 0 && (
              <span className="bg-indigo-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
