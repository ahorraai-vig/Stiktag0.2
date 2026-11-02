import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ProductItem, CartItem, NfcTargetFunction, UnitreeContactData } from '../types';
import { X, Radio, Smartphone, Link2, Shield, Star, Globe, Phone, Mail, MessageSquare, Check, Sparkles, Percent } from 'lucide-react';
import { QUANTITY_TIERS, calculateTierPrice, STANDARD_DIMENSIONS, BASE_UNIT_PRICE } from '../data/pricing';

interface ProductConfigModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductConfigModal: React.FC<ProductConfigModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedFunction, setSelectedFunction] = useState<NfcTargetFunction>('google_reviews');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('https://g.page/r/CbUrgErG0uRmEt/review');
  const [unitreeData, setUnitreeData] = useState<UnitreeContactData>({
    webUrl: 'https://mi-negocio.com',
    phone: '+34 986 000 000',
    sms: '+34 600 000 000',
    email: 'contacto@mi-negocio.com'
  });
  const [businessName, setBusinessName] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Target text to encode into preview QR
  const textToEncode = selectedFunction === 'google_reviews' 
    ? (googleReviewUrl || 'https://maps.google.com')
    : `https://unitree.io/p/${encodeURIComponent(businessName || 'contacto')}?web=${encodeURIComponent(unitreeData.webUrl)}&tel=${encodeURIComponent(unitreeData.phone)}`;

  // Generate QR code dynamically with cancellation
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(textToEncode, {
      width: 250,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [textToEncode]);

  // Volume pricing calculation based on quantity tiers (1, 5, 10, 20, 50, 100, 200)
  const pricingInfo = calculateTierPrice(quantity);

  const handleAdd = () => {
    const newItem: CartItem = {
      cartItemId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantity,
      selectedFunction,
      googleReviewUrl: selectedFunction === 'google_reviews' ? googleReviewUrl : undefined,
      unitreeData: selectedFunction === 'unitree_contact' ? unitreeData : undefined,
      businessNameOnProduct: businessName || 'Mi Negocio',
      unitPrice: pricingInfo.unitPrice,
      selectedMaterial: 'Acrílico 5mm troquelado (125mm x 125mm) con peana',
      selectedChip: 'NTAG213',
      customUrlOrData: selectedFunction === 'google_reviews' ? googleReviewUrl : unitreeData.webUrl
    };

    onAddToCart(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold uppercase">
              <span>Cartel Acrílico Troquelado</span>
              <span aria-hidden="true">/</span>
              <span>Medida Oficial: {STANDARD_DIMENSIONS}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {product.name}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left: Live Visual & QR Tag Slot */}
          <div className="md:col-span-5 bg-slate-100 p-5 flex flex-col justify-between border-r border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700">Espacio Reservado para NFC + QR</span>
                <span className="text-[11px] font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  {STANDARD_DIMENSIONS}
                </span>
              </div>

              {/* Product Visual Container */}
              <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 p-2 group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />

                {/* Slot tag highlight */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] font-mono font-bold text-slate-800">
                    {selectedFunction === 'google_reviews' ? '⭐ Reseñas Google' : '🌐 Perfil Unitree'}
                  </span>
                </div>
              </div>

              {/* Dynamic QR Preview Box */}
              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3.5">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="Código QR Generado" 
                    className="w-16 h-16 rounded border border-slate-100 shrink-0" 
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400 shrink-0">
                    QR
                  </div>
                )}
                <div className="text-xs overflow-hidden">
                  <p className="font-semibold text-slate-800">Pegatina NFC + QR Impreso</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                    {selectedFunction === 'google_reviews' ? googleReviewUrl : 'Unitree: Web + Tel + SMS + Email'}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-1 font-medium">
                    ✓ Se adhiere al hueco del metacrilato
                  </p>
                </div>
              </div>

              {/* Physical specifications notice */}
              <div className="mt-4 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Especificaciones de Fabricación</span>
                </p>
                <p className="text-indigo-800 text-[10px] leading-relaxed">
                  Metacrilato bicapa de 5mm con troquelado láser a la silueta (125 × 125 mm), peana de madera o acrílico incluida y chip NFC NXP NTAG213 pre-programado.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Tiers Selection & Configuration Controls */}
          <div className="md:col-span-7 p-6 space-y-6">
            
            {/* 1. SELECCIÓN DE TRAMOS DE COMPRA POR VOLUMEN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1. Elige Cantidad (Escalado de Descuentos por Tramos)
                </label>
                <span className="text-[11px] text-emerald-600 font-bold">
                  Desde {BASE_UNIT_PRICE.toFixed(2)} €/ud
                </span>
              </div>

              {/* Quantity Tiers Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {QUANTITY_TIERS.map((tier) => {
                  const isSelected = quantity === tier.quantity;
                  return (
                    <button
                      key={tier.quantity}
                      type="button"
                      onClick={() => setQuantity(tier.quantity)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                          Top
                        </span>
                      )}
                      <p className="text-xs font-bold text-slate-900">{tier.label}</p>
                      <p className="text-[11px] font-mono text-indigo-700 font-semibold mt-0.5">
                        {tier.unitPrice.toFixed(2)} €
                      </p>
                      <p className={`text-[9px] mt-0.5 font-medium ${tier.discountPercent > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {tier.discountPercent > 0 ? `-${tier.discountPercent}%` : 'Base'}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Fine-tune stepper or custom quantity */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Ajustar cantidad:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center font-mono font-bold text-slate-900 border border-slate-300 rounded-lg py-1 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-slate-900 text-sm">
                    {pricingInfo.unitPrice.toFixed(2)} € / ud
                  </p>
                  {pricingInfo.discountPercent > 0 && (
                    <p className="text-[11px] text-emerald-600 font-medium">
                      Descuento del {pricingInfo.discountPercent}% aplicado
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. NOMBRE COMERCIAL / MARCA */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                2. Nombre de tu Negocio en el Cartel
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej. Clínica Dental Vigo / Burger Grill"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* 3. SELECCIÓN DE LAS 2 FUNCIONES PERMITIDAS */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                3. Elige la Función del Chip NFC & Código QR
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Opción 1: Reseñas de Google */}
                <button
                  type="button"
                  onClick={() => setSelectedFunction('google_reviews')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedFunction === 'google_reviews'
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      Solo Reseñas Google
                    </span>
                    {selectedFunction === 'google_reviews' && (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Abre directamente la ficha de 5 estrellas en Google Maps para que el cliente valore sin buscar.
                  </p>
                </button>

                {/* Opción 2: Perfil Unitree (NFC Tools) */}
                <button
                  type="button"
                  onClick={() => setSelectedFunction('unitree_contact')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedFunction === 'unitree_contact'
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      Perfil Unitree Contacto
                    </span>
                    {selectedFunction === 'unitree_contact' && (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Agrupa 4 accesos: Web URL, Llamada telefónica, SMS y Email (grabado con NFC Tools).
                  </p>
                </button>
              </div>
            </div>

            {/* Inputs específicos según la opción elegida */}
            {selectedFunction === 'google_reviews' ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs animate-in fade-in">
                <label className="block font-semibold text-slate-700">
                  Enlace directo a tus Reseñas de Google Maps:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/.../review"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  ¿No tienes el enlace a mano? Puedes facilitárnoslo más tarde por WhatsApp o a través de nuestro Asistente IA.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs animate-in fade-in">
                <p className="font-semibold text-slate-700">
                  Datos para tu perfil Unitree (los 4 canales esenciales):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-indigo-600" />
                      1. Enlace Web (URL)
                    </span>
                    <input
                      type="url"
                      value={unitreeData.webUrl}
                      onChange={(e) => setUnitreeData({ ...unitreeData, webUrl: e.target.value })}
                      placeholder="https://minegocio.com"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-indigo-600" />
                      2. Teléfono de Llamadas
                    </span>
                    <input
                      type="tel"
                      value={unitreeData.phone}
                      onChange={(e) => setUnitreeData({ ...unitreeData, phone: e.target.value })}
                      placeholder="+34 986 000 000"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-indigo-600" />
                      3. Teléfono para SMS
                    </span>
                    <input
                      type="tel"
                      value={unitreeData.sms}
                      onChange={(e) => setUnitreeData({ ...unitreeData, sms: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-indigo-600" />
                      4. Correo Electrónico (Email)
                    </span>
                    <input
                      type="email"
                      value={unitreeData.email}
                      onChange={(e) => setUnitreeData({ ...unitreeData, email: e.target.value })}
                      placeholder="contacto@empresa.com"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Grabaremos estos 4 canales en el chip NFC y en el código QR con NFC Tools antes de enviarte el pedido.
                </p>
              </div>
            )}

            {/* Resumen Económico del Tramo Seleccionado */}
            <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-300">
                  Pack de <strong>{quantity} {quantity === 1 ? 'unidad' : 'unidades'}</strong> ({STANDARD_DIMENSIONS}):
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-extrabold font-mono text-white">
                    {pricingInfo.total.toFixed(2)} €
                  </span>
                  <span className="text-xs text-indigo-300 font-mono">
                    ({pricingInfo.unitPrice.toFixed(2)} €/ud)
                  </span>
                </div>
                {pricingInfo.savings > 0 && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    ¡Ahorras {pricingInfo.savings.toFixed(2)} € (-{pricingInfo.discountPercent}%) comprando este pack!
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Añadir al Pedido</span>
              </button>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span>Tramos oficiales: 1 ud (49,99€) · 5 uds · 10 uds · 20 uds · 50 uds · 100 uds · 200 uds.</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
