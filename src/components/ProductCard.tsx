import React, { useState } from 'react';
import { ProductItem } from '../types';
import { Radio, QrCode, Sliders, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { BASE_UNIT_PRICE, STANDARD_DIMENSIONS } from '../data/pricing';

interface ProductCardProps {
  product: ProductItem;
  onOpenConfigurator: (product: ProductItem) => void;
  onQuickAdd: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenConfigurator,
  onQuickAdd
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => onOpenConfigurator(product)}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-200 text-slate-500">
            <Radio className="w-8 h-8 mb-2 text-slate-400" />
            <p className="text-xs font-medium text-center">{product.name}</p>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide">
            {STANDARD_DIMENSIONS}
          </span>
          {product.badge && (
            <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {product.badge}
            </span>
          )}
        </div>

        {/* Tech indicator chips */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded shadow-xs text-[10px] font-mono font-bold text-slate-800">
          <Radio className="w-3 h-3 text-indigo-600" />
          <span>NFC</span>
          <span className="text-slate-300">+</span>
          <QrCode className="w-3 h-3 text-slate-700" />
          <span>QR</span>
        </div>

        {/* Space reserved tag */}
        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Espacio Reservado</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata unboxed */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">{product.sector}</span>
            <span aria-hidden="true">·</span>
            <span>Cartel Acrílico Troquelado</span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Volume discount tiers strip */}
        <div className="py-1 px-2 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
          <span className="font-medium text-indigo-700">Tramos por volumen:</span>
          <span className="font-mono text-slate-500">1, 5, 10, 20, 50, 100 y 200 uds</span>
        </div>

        {/* Footer info: Scaled Price + Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Desde</span>
              <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                {BASE_UNIT_PRICE.toFixed(2)} €
              </span>
              <span className="text-[11px] text-slate-500">/ud</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">
              Hasta -66% dto. por cantidad
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenConfigurator(product);
              }}
              title="Configurar y elegir tramo de unidades"
              className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Elegir Pack</span>
            </button>

            <button
              type="button"
              onClick={handleAdd}
              title="Añadir 1 unidad al pedido"
              className={`p-2 rounded-lg transition-all ${
                justAdded 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              }`}
            >
              {justAdded ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
