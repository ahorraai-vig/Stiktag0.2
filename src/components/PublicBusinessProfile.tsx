import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Star, 
  Share2, 
  Check, 
  ArrowLeft, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink,
  Store
} from 'lucide-react';
import { Business } from '../types';
import { fetchBusinessBySlug } from '../services/supabase';
import { getBusinessPublicUrl, copyToClipboard } from '../utils/slug';

interface PublicBusinessProfileProps {
  slug: string;
  onNavigateHome: () => void;
  onOpenStoreCatalog?: () => void;
}

export const PublicBusinessProfile: React.FC<PublicBusinessProfileProps> = ({
  slug,
  onNavigateHome,
  onOpenStoreCatalog,
}) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchBusinessBySlug(slug)
      .then((data) => {
        if (mounted) {
          setBusiness(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching business by slug:', err);
        if (mounted) {
          setBusiness(null);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleShare = async () => {
    const url = getBusinessPublicUrl(slug);
    if (navigator?.share) {
      try {
        await navigator.share({
          title: business?.name || 'AhorraAI Negocio',
          text: `Perfil de ${business?.name || 'comercio local'} en AhorraAI`,
          url,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3 max-w-sm w-full">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-sm font-bold text-slate-800">Cargando perfil del comercio...</h2>
          <p className="text-xs text-slate-500 font-mono">ahorraai.com/{slug}</p>
        </div>
      </div>
    );
  }

  // 404 Not Found State
  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-md text-center space-y-4 max-w-md w-full">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <Building2 className="w-7 h-7" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Negocio No Disponible
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Identificador: <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">/{slug}</span>
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            No se ha encontrado ningún negocio activo asignado a esta dirección o el chip NFC aún no ha sido vinculado en el sistema.
          </p>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={onNavigateHome}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Ir a la Página Principal
            </button>
            {onOpenStoreCatalog && (
              <button
                onClick={onOpenStoreCatalog}
                className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Ver Catálogo de Carteles Acrílicos Troquelados
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const publicUrl = getBusinessPublicUrl(business.slug);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>AhorraAI</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              NFC ACTIVO
            </span>
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Compartir enlace"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single Profile Container (optimized for phone screen) */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 space-y-4">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
          
          {/* Avatar / Icon */}
          <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md border-2 border-white">
            {business.name.charAt(0).toUpperCase()}
          </div>

          {/* Names and Location */}
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {business.name}
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium text-slate-700">
                <MapPin className="w-3 h-3 text-indigo-600" />
                {business.city}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                {business.sector}
              </span>
            </div>
          </div>

          {/* Description if present */}
          {business.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {business.description}
            </p>
          )}

          {/* Verified Badge according to structural honesty */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Comercio Local Verificado en {business.city}</span>
          </div>

        </div>

        {/* Action Buttons Cluster: High-contrast, big touch targets for mobile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Canales Directos de Contacto
          </span>

          {/* Google Reviews Button (Priority) */}
          {business.googleReviewsUrl && (
            <a
              href={business.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-transform active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-5 h-5 fill-white text-white shrink-0" />
                <span>Dejar Reseña en Google (5 Estrellas)</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          )}

          {/* Phone Button */}
          {business.phone && (
            <a
              href={`tel:${business.phone.replace(/\s+/g, '')}`}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-transform active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="leading-tight">Llamar al Comercio</div>
                  <div className="text-[10px] font-mono opacity-90">{business.phone}</div>
                </div>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-700/60 px-2 py-0.5 rounded">Llamada</span>
            </a>
          )}

          {/* Website Button */}
          {business.website && (
            <a
              href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-transform active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 shrink-0 text-indigo-400" />
                <div className="text-left truncate max-w-[220px]">
                  <div className="leading-tight">Visitar Sitio Web</div>
                  <div className="text-[10px] font-mono opacity-80 truncate">{business.website.replace(/^https?:\/\//, '')}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          )}

          {/* Email Button */}
          {business.email && (
            <a
              href={`mailto:${business.email}`}
              className="w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-transform active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="text-left truncate max-w-[220px]">
                  <div className="leading-tight">Enviar Email</div>
                  <div className="text-[10px] font-mono text-indigo-700 truncate">{business.email}</div>
                </div>
              </div>
              <span className="text-[11px] text-indigo-600 font-semibold">Correo</span>
            </a>
          )}

          {/* If no contact details available */}
          {!business.phone && !business.website && !business.email && !business.googleReviewsUrl && (
            <div className="p-4 bg-slate-50 text-slate-500 text-xs rounded-xl text-center">
              Este comercio está completando sus canales directos de contacto.
            </div>
          )}

        </div>

        {/* NFC Physical Support Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Soporte Físico Troquelado AhorraAI</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Has accedido acercando tu teléfono al chip NFC o escaneando el código QR del cartel acrílico instalado en <strong>{business.name}</strong>.
          </p>
          <div className="font-mono text-[10px] text-slate-400 select-all pt-1">
            {publicUrl}
          </div>
        </div>

        {/* Promotion banner for other businesses */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white text-center space-y-2.5 shadow-md">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-300">
            <Store className="w-4 h-4" />
            <span>¿Tienes un negocio en Vigo?</span>
          </div>
          <p className="text-xs text-slate-200">
            Consigue tu cartel acrílico troquelado personalizado con chip NFC y QR para conseguir reseñas 5 estrellas al instante.
          </p>
          <button
            onClick={() => {
              if (onOpenStoreCatalog) onOpenStoreCatalog();
              else onNavigateHome();
            }}
            className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Ver Catálogo de Diseños Troquelados
          </button>
        </div>

      </main>

      {/* Clean minimal footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 font-mono">
        AhorraAI v4 · Vigo · ahorraai.com
      </footer>

    </div>
  );
};
