import React from 'react';
import { ShoppingBag, Store, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentView: 'store' | 'dashboard';
  setCurrentView: (view: 'store' | 'dashboard') => void;
  cartCount: number;
  openCart: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  openCart,
  onNavigateSection
}) => {
  const handleNavClick = (sectionId: string) => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => { setCurrentView('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Ahorra<span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[11px] font-mono tracking-tight text-slate-500">
              ahorraai.com
            </span>
          </div>
        </button>

        {/* Zone 2: 4–5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button 
            onClick={() => handleNavClick('catalogo')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </button>
          <button 
            onClick={() => handleNavClick('formatos')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Formatos & Materiales
          </button>
          <button 
            onClick={() => handleNavClick('sectores')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Sectores
          </button>
          <button 
            onClick={() => handleNavClick('tecnologia')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Tecnología NFC + QR
          </button>
          <button 
            onClick={() => handleNavClick('como-funciona')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            Cómo Funciona
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster (Portal Negocios & Cart) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView(currentView === 'store' ? 'dashboard' : 'store')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentView === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {currentView === 'dashboard' ? (
              <>
                <Store className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ver Tienda</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
                <span>Panel Negocios</span>
              </>
            )}
          </button>

          <button
            onClick={openCart}
            aria-label="Abrir carrito de compras"
            className="relative px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-sm whitespace-nowrap"
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
