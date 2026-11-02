import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ProductItem, CartItem, NfcTargetFunction, UnitreeContactData } from '../types';
import { X, Radio, Smartphone, Link2, Shield, Star, Globe, Phone, Mail, MessageSquare, Check } from 'lucide-react';

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

  // Volume pricing calculation
  let discountPercent = 0;
  if (quantity >= 10) discountPercent = 15;
  else if (quantity >= 5) discountPercent = 10;
  else if (quantity >= 3) discountPercent = 5;

  const unitPrice = product.price * (1 - discountPercent / 100);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const newItem: CartItem = {
      cartItemId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantity,
      selectedFunction,
      googleReviewUrl: selectedFunction === 'google_reviews' ? googleReviewUrl : undefined,
      unitreeData: selectedFunction === 'unitree_contact' ? unitreeData : undefined,
      businessNameOnProduct: businessName || 'Mi Negocio',
      unitPrice
    };

    onAddToCart(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold uppercase">
              <span>Cartel Acrílico Troquelado</span>
              <span aria-hidden="true">/</span>
              <span>Espacio Reservado para Etiqueta NFC + QR</span>
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
          <div className="md:col-span-5 bg-slate-100 p-6 flex flex-col justify-between border-r border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700">Diseño Troquelado & Espacio NFC</span>
                <span className="text-[11px] font-mono text-slate-500">{product.dimensions}</span>
              </div>

              {/* Product Visual Container with embedded dynamic QR */}
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
                    {selectedFunction === 'google_reviews' ? 'Solo Reseñas Google' : 'Perfil Unitree'}
                  </span>
                </div>
              </div>

              {/* Dynamic QR Preview Box */}
              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-4">
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
                  <p className="font-semibold text-slate-800">Etiqueta NFC + QR a Pegar</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                    {selectedFunction === 'google_reviews' ? googleReviewUrl : 'Unitree: Web + Tel + SMS + Email'}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-1 font-medium">✓ Grabado con NFC Tools desde móvil</p>
                </div>
              </div>
            </div>

            {/* Explanatory note */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Espacio reservado para pegar la etiqueta NFC con su QR impreso.</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Listo para que el cliente acerque el móvil sin instalar ninguna app.</span>
              </div>
            </div>
          </div>

          {/* Right: Customization Controls (The 2 Core Functions) */}
          <div className="md:col-span-7 p-6 space-y-5">
            
            {/* 1. Nombre / Marca para el cartel */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                Nombre de tu Negocio o Marca a Incluir en el Cartel
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej. Hamburguesería Central / Clínica Dental"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* 2. Selector de las 2 únicas funciones requeridas */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Elige la Función a Programar en el Chip NFC y QR:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Opción 1: Reseñas de Google */}
                <button
                  type="button"
                  onClick={() => setSelectedFunction('google_reviews')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFunction === 'google_reviews'
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span className="font-bold text-xs text-slate-900">1. Solo Reseñas de Google</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Abre directamente el formulario de 5 estrellas en Google Maps para multiplicar tus opiniones.
                  </p>
                </button>

                {/* Opción 2: Unitree Multi-Contacto */}
                <button
                  type="button"
                  onClick={() => setSelectedFunction('unitree_contact')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFunction === 'unitree_contact'
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs text-slate-900">2. Unitree Multi-Contacto</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Muestra los 4 accesos directos: 1 URL web, 1 teléfono de llamada, 1 SMS y 1 email.
                  </p>
                </button>
              </div>
            </div>

            {/* 3. Inputs específicos de la opción seleccionada */}
            {selectedFunction === 'google_reviews' ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Enlace de Google Maps / Reseñas 5★
                  </label>
                  <span className="text-[10px] text-indigo-600 font-medium">Link directo</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/.../review o enlace de tu perfil de Google"
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Al aproximar el móvil con NFC o escanear el QR, el cliente accederá directamente a puntuar tu local.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Datos del Perfil Unitree (NFC Tools)
                  </label>
                  <span className="text-[10px] text-indigo-600 font-medium">4 canales directos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-indigo-600" />
                      1. Enlace Web / URL o Red Social
                    </span>
                    <input
                      type="url"
                      value={unitreeData.webUrl}
                      onChange={(e) => setUnitreeData({ ...unitreeData, webUrl: e.target.value })}
                      placeholder="https://tu-web.com o Instagram"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-indigo-600" />
                      2. Teléfono para Llamadas
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
                  Nosotros pre-grabaremos estos 4 datos en el chip NFC y generaremos el QR con NFC Tools antes de enviártelo.
                </p>
              </div>
            )}

            {/* 4. Cantidad & Descuento por Volumen */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Unidades
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-slate-900 text-sm w-8 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                {discountPercent > 0 && (
                  <span className="text-[11px] font-semibold text-emerald-600 block">
                    ¡Ahorras {discountPercent}% por volumen!
                  </span>
                )}
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {totalPrice.toFixed(2)} €
                  </span>
                  <span className="text-xs text-slate-500">({unitPrice.toFixed(2)} €/ud)</span>
                </div>
                <span className="text-[10px] text-slate-400">IVA incluido · Pre-grabado con NFC Tools</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span>¿Necesitas cambiar los datos más adelante? Puedes pedírnoslo por WhatsApp o al Asistente IA.</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            
            <button
              type="button"
              onClick={handleAdd}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Añadir al Pedido ({totalPrice.toFixed(2)} €)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
