import React, { useState } from 'react';
import { ProductItem } from '../types';
import { Radio, QrCode, Sliders, ShoppingBag, Check } from 'lucide-react';

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

        {/* Feature badge or format label */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide">
              {product.badge}
            </span>
          )}
        </div>

        {/* Tech indicator chips */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow-xs text-[10px] font-mono font-bold text-slate-800">
          <Radio className="w-3 h-3 text-indigo-600" />
          <span>NFC</span>
          <span className="text-slate-300">+</span>
          <QrCode className="w-3 h-3 text-slate-700" />
          <span>QR</span>
        </div>

        {/* Dimensions badge bottom right */}
        <div className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
          {product.dimensions}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata unboxed */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">{product.sector}</span>
            <span aria-hidden="true">·</span>
            <span>{product.format}</span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer info: Price + Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">Espacio reservado para etiqueta NFC + QR</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenConfigurator(product);
              }}
              title="Configurar Reseñas Google o Perfil Unitree"
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                justAdded 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Añadido</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pedir</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
