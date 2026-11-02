import React, { useState } from 'react';
import { CartItem, OrderRecord } from '../types';
import { X, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Truck, CreditCard, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderCompleted: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTaxId, setCustomerTaxId] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPostal, setCustomerPostal] = useState('');
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 4.90;
  const tax = subtotal * 0.21;
  const total = subtotal + shipping;

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerAddress) return;

    const newOrder: OrderRecord = {
      orderNumber: `AH-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      customerName,
      customerEmail,
      items: [...cart],
      subtotal,
      tax,
      shipping,
      total,
      status: 'Diseño Troquel',
      trackingNumber: `ES-EXP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    setLastOrder(newOrder);
    onOrderCompleted(newOrder);
    onClearCart();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {step === 'cart' && `Tu Pedido (${cart.reduce((a, b) => a + b.quantity, 0)} uds)`}
              {step === 'checkout' && 'Datos de Facturación y Envío'}
              {step === 'success' && '¡Pedido Recibido con Éxito!'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              AhorraAI · Fabricación bajo demanda troquelada
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5">
          
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-3">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Tu cesta está vacía</p>
                  <p className="text-xs max-w-xs mx-auto">
                    Selecciona cualquier producto del catálogo para configurarlo a medida con tu marca y enlace NFC.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.cartItemId}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex gap-3.5 items-start"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-1 text-[11px] text-slate-500 space-y-0.5">
                          <p className="truncate">
                            <span className="font-semibold text-slate-700">Texto:</span> {item.businessNameOnProduct}
                          </p>
                          <p className="truncate">
                            <span className="font-semibold text-slate-700">Chip:</span> {item.selectedChip} · {item.targetAction.replace('_', ' ')}
                          </p>
                          <p className="truncate font-mono text-[10px] text-indigo-600">
                            {item.customUrlOrData}
                          </p>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-bold w-6 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                            {(item.unitPrice * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Free shipping banner */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    {subtotal >= 50 ? (
                      <span className="font-medium">¡Enhorabuena! Tienes Envío Gratis incluido.</span>
                    ) : (
                      <span>
                        Añade {(50 - subtotal).toFixed(2)} € más para conseguir <strong>Envío Gratis</strong>.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleProcessOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Razón Social / Nombre Comercial *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Restaurante Sol S.L."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    CIF / NIF para Factura
                  </label>
                  <input
                    type="text"
                    value={customerTaxId}
                    onChange={(e) => setCustomerTaxId(e.target.value)}
                    placeholder="B12345678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Email de Confirmación & Facturación *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="admin@empresa.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Dirección de Entrega de los Soportes *
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Calle, número, piso o local comercial"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Ciudad / Población *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Madrid / Valencia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPostal}
                    onChange={(e) => setCustomerPostal(e.target.value)}
                    placeholder="28004"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Pago Seguro B2B / Factura Proforma</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Emitimos factura oficial con desglose de IVA. Los chips se graban y verifican antes del envío con número de seguimiento.
                </p>
              </div>
            </form>
          )}

          {step === 'success' && lastOrder && (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Pedido {lastOrder.orderNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  ¡Pedido en Producción!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Hemos registrado tus {lastOrder.items.reduce((a, b) => a + b.quantity, 0)} unidades. Nuestro equipo prepara los archivos vectoriales para corte láser y codificación de los chips NFC.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente:</span>
                  <span className="font-bold text-slate-900">{lastOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking:</span>
                  <span className="text-indigo-600 font-bold">{lastOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Facturado:</span>
                  <span className="font-bold text-slate-900">{lastOrder.total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    setStep('cart');
                  }}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                >
                  Continuar en la Tienda
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer with Financial Summary */}
        {step !== 'success' && cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal productos:</span>
                <span className="font-mono tabular-nums text-slate-900">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Gastos de envío:</span>
                <span className="font-mono tabular-nums text-slate-900">
                  {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>IVA estimado (21%):</span>
                <span className="font-mono tabular-nums text-slate-900">{tax.toFixed(2)} €</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total a Pagar:</span>
                <span className="font-mono tabular-nums text-indigo-600 text-base">{total.toFixed(2)} €</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Tramitar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Volver a Cesta
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirmar Pedido</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
