import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Globe, 
  Phone, 
  Mail, 
  Star, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  X,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { Business } from '../types';
import { 
  fetchBusinesses, 
  saveBusiness, 
  deleteBusiness, 
  generateUniqueShortSlug, 
  checkSlugAvailability 
} from '../services/supabase';
import { sanitizeSlug, getBusinessPublicUrl, copyToClipboard } from '../utils/slug';

interface AdminBusinessesProps {
  onNavigateToPublicSlug: (slug: string) => void;
  onNavigateBackToStore: () => void;
  showToast: (msg: string) => void;
}

const SECTOR_OPTIONS = [
  'Hostelería & Gastronomía',
  'Salud & Odontología',
  'Automoción & Talleres',
  'Belleza & Barbería',
  'Inmobiliaria & Hogar',
  'Fitness & Deporte',
  'Mascotas & Veterinaria',
  'Lujo, Joyería & Óptica',
  'Comercio & Servicios',
  'Turismo & Hoteles'
];

export const AdminBusinesses: React.FC<AdminBusinessesProps> = ({
  onNavigateToPublicSlug,
  onNavigateBackToStore,
  showToast,
}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('Vigo');
  const [formSector, setFormSector] = useState(SECTOR_OPTIONS[0]);
  const [formSlug, setFormSlug] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGoogleReviews, setFormGoogleReviews] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatusRecord, setFormStatusRecord] = useState<'DICHO' | 'OBSERVADO'>('DICHO');

  // Slug check status
  const [slugStatus, setSlugStatus] = useState<{ checking: boolean; available: boolean; error?: string }>({
    checking: false,
    available: true,
  });

  // Copied state tracker by slug
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const data = await fetchBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error('Error loading businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = async () => {
    setEditingId(null);
    setFormName('');
    setFormCity('Vigo');
    setFormSector(SECTOR_OPTIONS[0]);
    setFormPhone('');
    setFormWebsite('');
    setFormEmail('');
    setFormGoogleReviews('');
    setFormDescription('');
    setFormStatusRecord('DICHO');
    
    // Auto-generate short unique slug
    setSlugStatus({ checking: true, available: true });
    const autoSlug = await generateUniqueShortSlug();
    setFormSlug(autoSlug);
    setSlugStatus({ checking: false, available: true });
    
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (biz: Business) => {
    setEditingId(biz.id);
    setFormName(biz.name);
    setFormCity(biz.city);
    setFormSector(biz.sector);
    setFormSlug(biz.slug);
    setFormPhone(biz.phone || '');
    setFormWebsite(biz.website || '');
    setFormEmail(biz.email || '');
    setFormGoogleReviews(biz.googleReviewsUrl || '');
    setFormDescription(biz.description || '');
    setFormStatusRecord(biz.statusRecord === 'OBSERVADO' ? 'OBSERVADO' : 'DICHO');
    setSlugStatus({ checking: false, available: true });
    setIsFormOpen(true);
  };

  // Re-generate a fresh random slug
  const handleRegenerateSlug = async () => {
    setSlugStatus({ checking: true, available: true });
    const freshSlug = await generateUniqueShortSlug(editingId || undefined);
    setFormSlug(freshSlug);
    setSlugStatus({ checking: false, available: true });
  };

  // Validate manual slug change
  const handleSlugChange = async (val: string) => {
    const sanitized = sanitizeSlug(val);
    setFormSlug(sanitized);

    if (sanitized.length < 3) {
      setSlugStatus({ checking: false, available: false, error: 'Mínimo 3 caracteres' });
      return;
    }

    setSlugStatus({ checking: true, available: false });
    const check = await checkSlugAvailability(sanitized, editingId || undefined);
    setSlugStatus({
      checking: false,
      available: check.available,
      error: check.reason,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Por favor, indica el nombre comercial');
      return;
    }
    if (!slugStatus.available) {
      showToast('El identificador corto no está disponible o no es válido');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveBusiness({
        id: editingId || undefined,
        name: formName,
        city: formCity,
        sector: formSector,
        slug: formSlug,
        phone: formPhone || undefined,
        website: formWebsite || undefined,
        email: formEmail || undefined,
        googleReviewsUrl: formGoogleReviews || undefined,
        description: formDescription || undefined,
        statusRecord: formStatusRecord,
      });

      if (res.success && res.business) {
        showToast(editingId ? 'Negocio actualizado correctamente' : '¡Negocio registrado con éxito!');
        setIsFormOpen(false);
        await loadBusinesses();
      } else {
        showToast(res.error || 'Error al guardar el negocio');
      }
    } catch (err: any) {
      showToast('Error de conexión al guardar el negocio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (biz: Business) => {
    if (window.confirm(`¿Estás seguro de eliminar "${biz.name}" (${biz.slug})?`)) {
      await deleteBusiness(biz.id);
      showToast(`Negocio "${biz.name}" eliminado`);
      await loadBusinesses();
    }
  };

  const handleCopyUrl = async (slug: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = getBusinessPublicUrl(slug);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedSlug(slug);
      showToast(`URL NFC copiada: ${url}`);
      setTimeout(() => {
        setCopiedSlug((curr) => (curr === slug ? null : curr));
      }, 2500);
    } else {
      showToast('No se pudo copiar automáticamente. Copia manual: ' + url);
    }
  };

  const filtered = businesses.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      b.sector.toLowerCase().includes(q) ||
      (b.phone && b.phone.includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider">
            <span>Panel de Administración</span>
            <span className="text-slate-300">/</span>
            <span>AhorraAI v4 · Vigo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600" />
            <span>Gestión de Negocios y URLs NFC</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Registra y gestiona los comercios locales. El sistema asigna un identificador corto permanente (ej. <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-xs">ahorraai.com/m7k2</code>) listo para copiar y grabar directamente en los chips NFC con la app <strong>NFC Tools</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onNavigateBackToStore}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            ← Volver a la Tienda
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Negocio</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Negocios</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{businesses.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Comercios en Vigo</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-0.5">
            {businesses.filter((b) => b.city.toLowerCase().includes('vigo')).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">URLs NFC Activas</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-0.5">{businesses.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Dominio de Producción</span>
          <div className="text-xs font-mono font-bold text-slate-700 mt-2 truncate">ahorraai.com/*</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, slug (ej. m7k2), sector o teléfono..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
          Mostrando {filtered.length} de {businesses.length} registros
        </div>
      </div>

      {/* Businesses Cards / List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">Cargando base de datos de negocios...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron negocios</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'Prueba con otro término de búsqueda o limpia el filtro.' : 'Empieza registrando el primer comercio para generar su URL NFC permanente.'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
            >
              + Registrar Primer Negocio
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((biz) => {
            const publicUrl = getBusinessPublicUrl(biz.slug);
            const isCopied = copiedSlug === biz.slug;

            return (
              <div
                key={biz.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow p-4 flex flex-col justify-between space-y-4"
              >
                {/* Header & Sector */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                        {biz.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{biz.city}</span>
                        <span className="text-slate-300">·</span>
                        <span className="truncate">{biz.sector}</span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span 
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border shrink-0 ${
                        biz.statusRecord === 'DICHO'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                      title={biz.statusRecord === 'DICHO' ? 'Dato validado por el comerciante' : 'Dato observado en calle/web'}
                    >
                      {biz.statusRecord}
                    </span>
                  </div>

                  {biz.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {biz.description}
                    </p>
                  )}

                  {/* Contact Indicators */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                    {biz.phone && (
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{biz.phone}</span>
                      </span>
                    )}
                    {biz.website && (
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[150px]">
                        <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{biz.website.replace(/^https?:\/\//, '')}</span>
                      </span>
                    )}
                    {biz.googleReviewsUrl && (
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Reseñas</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* NFC URL & Copy CTA Block */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                      URL para Chip NFC:
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Slug: /{biz.slug}</span>
                  </div>

                  <div className="font-mono text-xs font-bold text-indigo-700 bg-white px-2.5 py-1.5 rounded border border-indigo-100 truncate select-all">
                    {publicUrl}
                  </div>

                  {/* Primary NFC Tools Copy Button */}
                  <button
                    onClick={(e) => handleCopyUrl(biz.slug, e)}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡URL COPIADA AL PORTAPAPELES!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPIAR URL NFC</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => onNavigateToPublicSlug(biz.slug)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver Página Pública</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(biz)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Editar datos"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(biz)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Register / Edit Business Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Editar Comercio' : 'Registrar Nuevo Negocio'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generación automática de slug permanente para chip NFC y QR de AhorraAI.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Commercial Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Comercial <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej. Burger Joint & Craft Grill, Clínica Dental Progreso..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                />
              </div>

              {/* City and Sector in grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ciudad o Localidad <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Vigo"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoría o Sector <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formSector}
                    onChange={(e) => setFormSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    {SECTOR_OPTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Automatic Short Slug & Permanent URL */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Identificador Corto (Slug NFC)</span>
                    <span className="text-[10px] text-slate-400 font-normal">(4 letras/números)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    disabled={slugStatus.checking}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${slugStatus.checking ? 'animate-spin' : ''}`} />
                    <span>Generar otro</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-mono text-xs text-slate-400 pointer-events-none">
                      ahorraai.com/
                    </span>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="m7k2"
                      className="w-full pl-28 pr-8 py-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-indigo-700"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                      {slugStatus.checking ? (
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                      ) : slugStatus.available ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Validation status pill */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    URL física final: <strong className="font-mono text-slate-800">https://ahorraai.com/{formSlug || '...'}</strong>
                  </span>
                  {slugStatus.available ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Disponible
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">
                      {slugStatus.error || 'No disponible'}
                    </span>
                  )}
                </div>
              </div>

              {/* Optional Contact Data */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold text-slate-700 block">Datos de Contacto (Opcionales para la página pública):</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Teléfono de contacto</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+34 986 00 00 00"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Sitio Web</label>
                    <input
                      type="url"
                      value={formWebsite}
                      onChange={(e) => setFormWebsite(e.target.value)}
                      placeholder="https://minegocio.com"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Email de atención</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="contacto@minegocio.com"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Enlace directo a Reseñas Google (5★)</label>
                    <input
                      type="url"
                      value={formGoogleReviews}
                      onChange={(e) => setFormGoogleReviews(e.target.value)}
                      placeholder="https://g.page/r/.../review"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Descripción breve del local</label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Especialidad, horario o propuesta de valor..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Structural Honesty Tag (AhorraAI Principles) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Estado de Honestidad Estructural:
                </span>
                <select
                  value={formStatusRecord}
                  onChange={(e) => setFormStatusRecord(e.target.value as any)}
                  className="px-2 py-1 text-xs font-mono font-bold rounded border border-slate-300 bg-white"
                >
                  <option value="DICHO">DICHO (Validado por el comerciante)</option>
                  <option value="OBSERVADO">OBSERVADO (Extraído por scripts/calle)</option>
                </select>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !slugStatus.available}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Registrar Negocio'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
