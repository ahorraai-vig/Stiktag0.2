import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductConfigModal } from './components/ProductConfigModal';
import { InteractiveNfcDemo } from './components/InteractiveNfcDemo';
import { TechAndMaterials } from './components/TechAndMaterials';
import { CartDrawer } from './components/CartDrawer';
import { BusinessDashboard } from './components/BusinessDashboard';
import { Footer } from './components/Footer';
import { PRODUCTS_DATA, SECTORS_LIST, FORMATS_LIST } from './data/products';
import { INITIAL_BUSINESSES } from './data/mockBusiness';
import { ProductItem, CartItem, ProductSector, RegisteredBusiness, OrderRecord } from './types';
import { Search, Filter, Sparkles, Check, ArrowRight, Store, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'dashboard'>('store');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ahorraai_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [businesses, setBusinesses] = useState<RegisteredBusiness[]>(() => {
    try {
      const saved = localStorage.getItem('ahorraai_businesses');
      return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
    } catch {
      return INITIAL_BUSINESSES;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ahorraai_orders');
      return saved ? JSON.parse(saved) : [
        {
          orderNumber: 'AH-883921',
          date: '2026-10-28',
          customerName: 'Burger Joint & Craft Grill',
          customerEmail: 'pedidos@burgerjoint.es',
          items: [],
          subtotal: 94.40,
          tax: 19.82,
          shipping: 0,
          total: 114.22,
          status: 'Corte Láser & Impresión',
          trackingNumber: 'ES-EXP-BJ7721'
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedSector, setSelectedSector] = useState<ProductSector>('Todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ahorraai_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ahorraai_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('ahorraai_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => [...prev, newItem]);
    showToast(`"${newItem.product.name}" añadido al pedido`);
  };

  const handleQuickAdd = (product: ProductItem) => {
    const defaultItem: CartItem = {
      cartItemId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantity: 1,
      selectedMaterial: product.materials[0] || 'Acrílico 5mm',
      selectedChip: product.nfcChip || 'NTAG213',
      targetAction: product.popularAction || 'google_reviews',
      customUrlOrData: 'https://ahorraai.com/redirect-live',
      businessNameOnProduct: 'Mi Negocio',
      unitPrice: product.price
    };
    setCart((prev) => [...prev, defaultItem]);
    showToast(`"${product.name}" añadido al pedido`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
    } else {
      setCart((prev) =>
        prev.map((it) => (it.cartItemId === cartItemId ? { ...it, quantity: newQty } : it))
      );
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderCompleted = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`¡Pedido ${newOrder.orderNumber} confirmado!`);
  };

  const handleRegisterBusiness = (newBiz: RegisteredBusiness) => {
    setBusinesses((prev) => [newBiz, ...prev]);
    showToast(`Negocio "${newBiz.tradeName}" registrado con éxito`);
  };

  const handleUpdateBusiness = (updatedBiz: RegisteredBusiness) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === updatedBiz.id ? updatedBiz : b))
    );
    showToast(`Configuración de "${updatedBiz.tradeName}" actualizada`);
  };

  // Filter products
  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchesSector = selectedSector === 'Todos' || p.sector === selectedSector;
    const matchesFormat = selectedFormat === 'all' || p.format === selectedFormat;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSector && matchesFormat && matchesSearch;
  });

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cartTotalCount}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'store' ? (
          <div>
            {/* Hero Section */}
            <Hero
              onExploreCatalog={() => {
                const el = document.getElementById('catalogo');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenDashboard={() => setCurrentView('dashboard')}
            />

            {/* Interactive NFC Customer Experience Demo */}
            <InteractiveNfcDemo />

            {/* Technology & Materials Section */}
            <TechAndMaterials />

            {/* Main Product Catalog Section */}
            <section id="catalogo" className="py-16 bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider">
                      <span>Catálogo Completo Troquelado</span>
                      <span aria-hidden="true" className="text-slate-300">/</span>
                      <span>26 Modelos Físicos Oficiales</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
                      Elige el soporte con la forma de tu actividad comercial
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                      Todos los modelos incluyen corte perimetral a medida, peana o fijación, código QR óptico y chip NFC NTAG programado.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full md:w-72 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por sector o producto..."
                      className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs"
                    />
                  </div>
                </div>

                {/* Filter Controls: Sectors */}
                <div id="sectores" className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    <Filter className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Filtrar por Sector Profesional:</span>
                  </div>
                  
                  {/* Interactive Segmented Filter Controls */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
                    {SECTORS_LIST.map((sector) => {
                      const isActive = selectedSector === sector;
                      return (
                        <button
                          key={sector}
                          onClick={() => setSelectedSector(sector)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                            isActive
                              ? 'bg-white text-slate-900 font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                          }`}
                        >
                          {sector}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter Controls: Formats */}
                <div id="formatos" className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wide">
                      Formato Físico & Silueta:
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Mostrando {filteredProducts.length} de {PRODUCTS_DATA.length} modelos
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {FORMATS_LIST.map((format) => {
                      const isActive = selectedFormat === format.id;
                      return (
                        <button
                          key={format.id}
                          onClick={() => setSelectedFormat(format.id)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                            isActive
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>{format.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">
                      No se encontraron modelos con los filtros seleccionados
                    </p>
                    <p className="text-xs text-slate-500">
                      Prueba a restablecer los filtros para ver todos los 26 diseños die-cut.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedSector('Todos');
                        setSelectedFormat('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                    >
                      Restablecer Filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpenConfigurator={(p) => setSelectedProduct(p)}
                        onQuickAdd={handleQuickAdd}
                      />
                    ))}
                  </div>
                )}

              </div>
            </section>

            {/* Custom Die-cut Inquiry CTA */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                  
                  <div className="max-w-2xl space-y-4">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider bg-slate-800/80 px-2.5 py-1 rounded">
                      Corte Personalizado a Medida
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
                      ¿Tienes un logotipo o silueta propia que quieras troquelar?
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Enviando tu vector en SVG, Illustrator o DXF fabricamos lotes de 1 a 10.000 unidades con corte láser de alta precisión y chip NFC encapsulado a juego con tu identidad corporativa.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span>✓ Muestra digital previa gratuita</span>
                      <span>✓ Sin pedido mínimo restrictivo</span>
                      <span>✓ Descuentos escalados B2B</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
                    <a
                      href="mailto:ahorraai@gmail.com?subject=Solicitud%20de%20Troquelado%20Personalizado%20AhorraAI"
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                      <span>Solicitar Presupuesto Especial</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl text-center transition-colors"
                    >
                      Acceder al Panel de Negocios
                    </button>
                  </div>

                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Business Dashboard View */
          <BusinessDashboard
            businesses={businesses}
            onRegisterBusiness={handleRegisterBusiness}
            onUpdateBusiness={handleUpdateBusiness}
            orders={orders}
          />
        )}
      </main>

      {/* Product Customization Modal */}
      <ProductConfigModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Footer */}
      <Footer
        onNavigateSection={(sectionId) => {
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
        }}
        onOpenDashboard={() => setCurrentView('dashboard')}
      />

    </div>
  );
}
