import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductConfigModal } from './components/ProductConfigModal';
import { InteractiveNfcDemo } from './components/InteractiveNfcDemo';
import { TechAndMaterials } from './components/TechAndMaterials';
import { CartDrawer } from './components/CartDrawer';
import { AiCustomerAgent } from './components/AiCustomerAgent';
import { Footer } from './components/Footer';
import { PRODUCTS_DATA } from './data/products';
import { calculateTierPrice, BASE_UNIT_PRICE, STANDARD_DIMENSIONS, QUANTITY_TIERS } from './data/pricing';
import { ProductItem, CartItem, OrderRecord } from './types';
import { fetchOrders } from './services/supabase';
import { Search, Check, ArrowRight, Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ahorraai_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ahorraai_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ahorraai_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync orders from Supabase if table has records
  useEffect(() => {
    let mounted = true;
    fetchOrders().then((dbOrders) => {
      if (mounted && dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders.map(o => ({
          orderNumber: o.order_number,
          date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          items: [],
          subtotal: o.subtotal,
          tax: o.tax,
          shipping: o.shipping,
          total: o.total,
          status: o.status as any,
          trackingNumber: o.tracking_number
        })));
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

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
      selectedMaterial: `Acrílico 5mm troquelado (${STANDARD_DIMENSIONS}) con peana`,
      selectedChip: product.nfcChip || 'NTAG213',
      selectedFunction: 'google_reviews',
      targetAction: 'google_reviews',
      customUrlOrData: 'https://g.page/r/example-vigo/review',
      businessNameOnProduct: 'Mi Negocio',
      unitPrice: BASE_UNIT_PRICE
    };
    setCart((prev) => [...prev, defaultItem]);
    showToast(`"${product.name}" (1 ud · ${BASE_UNIT_PRICE.toFixed(2)} €) añadido al pedido`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
    } else {
      const tieredPrice = calculateTierPrice(newQty).unitPrice;
      setCart((prev) =>
        prev.map((it) =>
          it.cartItemId === cartItemId
            ? { ...it, quantity: newQty, unitPrice: tieredPrice }
            : it
        )
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

  // Search filter across the full catalog of 26 models (no sector or format buttons)
  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sector.toLowerCase().includes(q) ||
      p.format.toLowerCase().includes(q)
    );
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
        cartCount={cartTotalCount}
        openCart={() => setIsCartOpen(true)}
        onOpenAiAgent={() => setIsAiAgentOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={() => {
            const el = document.getElementById('catalogo');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAiAgent={() => setIsAiAgentOpen(true)}
        />

        {/* Interactive NFC Customer Experience Demo */}
        <InteractiveNfcDemo />

        {/* Technology & Materials Section */}
        <TechAndMaterials />

        {/* Main Product Catalog Section: Clean direct presentation of all 26 die-cut designs */}
        <section id="catalogo" className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider">
                  <span>Catálogo de Diseños Troquelados</span>
                  <span aria-hidden="true" className="text-slate-300">/</span>
                  <span>Espacio Blanco Reservado para Pegatina NFC + QR</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
                  Soportes con silueta profesional para tu negocio
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  Cada soporte incluye corte perimetral en acrílico, base o fijación, y el hueco reservado para pegar la etiqueta NFC con el QR impreso. Listo para programar hacia <strong>Solo Reseñas de Google</strong> o hacia tu <strong>Perfil Multi-Contacto Unitree</strong>.
                </p>
              </div>

              {/* Clean Search Input */}
              <div className="relative w-full md:w-80 shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar modelo (ej. dental, burger, casa...)"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Volume Tiers Banner Strip */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Tarifa Oficial por Volumen ({STANDARD_DIMENSIONS}):
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Desde 49,99 €/ud
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  ✓ Descuentos progresivos automáticos de 1 a 200 unidades
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 text-center font-mono">
                {QUANTITY_TIERS.map((t) => (
                  <div key={t.quantity} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50/50 transition-colors">
                    <p className="text-xs font-bold text-slate-800">{t.label}</p>
                    <p className="text-sm font-extrabold text-indigo-700 mt-0.5">
                      {t.unitPrice.toFixed(2)} €
                      <span className="text-[10px] text-slate-400 font-normal">/ud</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 font-sans font-semibold mt-0.5">
                      {t.discountPercent > 0 ? `-${t.discountPercent}% dto.` : 'Base'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalog Info Strip */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
              <span>
                Mostrando <strong className="text-slate-800">{filteredProducts.length}</strong> modelos troquelados con espacio reservado para chip
              </span>
              <span className="font-mono text-[11px] text-indigo-600">
                125 mm × 125 mm · Metacrilato bicapa 5mm
              </span>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <p className="text-sm font-semibold text-slate-800">
                  No se encontraron modelos para "{searchQuery}"
                </p>
                <p className="text-xs text-slate-500">
                  Prueba a buscar con otra palabra clave o limpia la búsqueda para ver todos los 26 diseños.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Ver Todo el Catálogo
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

        {/* Custom Die-cut Inquiry & AI Agent Assistance Section */}
        <section id="contacto-custom" className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              
              <div className="max-w-2xl space-y-4">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider bg-slate-800/80 px-2.5 py-1 rounded">
                  Fabricación Especial & Soporte Continuo
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
                  ¿Quieres un diseño troquelado con tu propio logo o silueta?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Envíame tu archivo o logotipo y preparo el archivo vectorial con el espacio reservado para la etiqueta NFC y QR. Además, si en cualquier momento necesitas cambiar el enlace de tus reseñas de Google o los datos de tu perfil Unitree, nuestro asistente de IA o nosotros lo gestionamos en minutos.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>✓ Preparación de archivo vectorial</span>
                  <span>✓ Grabado NFC directo desde el móvil</span>
                  <span>✓ Asistencia para actualizar enlaces</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsAiAgentOpen(true)}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Hablar con el Asistente IA</span>
                </button>
                <a
                  href="mailto:ahorraai@gmail.com?subject=Solicitud%20de%20Troquelado%20Personalizado%20AhorraAI"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Enviar Correo a ahorraai@gmail.com</span>
                </a>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Product Customization Modal (with 2 clean options: Google Reviews or Unitree) */}
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

      {/* AI Customer Support & Change Agent Modal/Widget */}
      <AiCustomerAgent
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
        onOpen={() => setIsAiAgentOpen(true)}
      />

      {/* Footer */}
      <Footer
        onNavigateSection={(sectionId) => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAiAgent={() => setIsAiAgentOpen(true)}
      />

    </div>
  );
}
