import React, { useState } from 'react';
import QRCode from 'qrcode';
import { RegisteredBusiness, BusinessDevice, ProductSector, ActionType, OrderRecord } from '../types';
import { SECTORS_LIST } from '../data/products';
import { 
  Building2, 
  Radio, 
  QrCode, 
  BarChart3, 
  Link2, 
  RefreshCw, 
  Plus, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Activity, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Star, 
  Copy,
  Edit2,
  Trash2,
  PackageCheck
} from 'lucide-react';

interface BusinessDashboardProps {
  businesses: RegisteredBusiness[];
  onRegisterBusiness: (biz: RegisteredBusiness) => void;
  onUpdateBusiness: (biz: RegisteredBusiness) => void;
  orders: OrderRecord[];
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  businesses,
  onRegisterBusiness,
  onUpdateBusiness,
  orders
}) => {
  const [selectedBizId, setSelectedBizId] = useState<string>(businesses[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'devices' | 'analytics' | 'register' | 'orders' | 'nfc_programmer'>('devices');
  
  // Registration form state
  const [newBizName, setNewBizName] = useState('');
  const [newBizTaxId, setNewBizTaxId] = useState('');
  const [newBizSector, setNewBizSector] = useState<ProductSector>('Hostelería & Gastronomía');
  const [newBizCity, setNewBizCity] = useState('');
  const [newBizAddress, setNewBizAddress] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizGoogleUrl, setNewBizGoogleUrl] = useState('');
  const [newBizWebsite, setNewBizWebsite] = useState('');
  const [newBizWhatsApp, setNewBizWhatsApp] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Edit device redirect state
  const [editingDevice, setEditingDevice] = useState<BusinessDevice | null>(null);
  const [newRedirectUrl, setNewRedirectUrl] = useState('');
  const [newRedirectAction, setNewRedirectAction] = useState<ActionType>('custom_url');

  // NFC Web Programmer State
  const [nfcWriteStatus, setNfcWriteStatus] = useState<string>('');
  const [programmerUrl, setProgrammerUrl] = useState<string>('https://ahorraai.com/r/demo');
  const [generatedNfcQr, setGeneratedNfcQr] = useState<string>('');

  const currentBusiness = businesses.find((b) => b.id === selectedBizId) || businesses[0];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizEmail) return;

    const newBiz: RegisteredBusiness = {
      id: `biz-${Date.now()}`,
      tradeName: newBizName,
      taxId: newBizTaxId || 'B-00000000',
      sector: newBizSector,
      contactEmail: newBizEmail,
      phone: newBizPhone,
      address: newBizAddress,
      city: newBizCity,
      googleReviewUrl: newBizGoogleUrl || `https://g.page/r/${newBizName.toLowerCase().replace(/\s+/g, '')}/review`,
      primaryWebsite: newBizWebsite || `https://${newBizName.toLowerCase().replace(/\s+/g, '')}.com`,
      whatsappContact: newBizWhatsApp,
      createdAt: new Date().toISOString().split('T')[0],
      devices: [
        {
          id: `dev-${Date.now()}-1`,
          productId: 'prod-google-5star',
          productName: 'Tótem Google Review 5 Estrellas Dorado',
          format: 'Cartel Acrílico / Metacrilato',
          image: '/assets/aistudio/google_five_star_totem_1793573581807_785ce530.jpg',
          serialNumber: `AH-${Math.floor(1000 + Math.random() * 9000)}-STD`,
          locationName: 'Mostrador Principal / Caja',
          targetAction: 'google_reviews',
          targetUrl: newBizGoogleUrl || 'https://google.com/maps',
          dynamicRedirectEnabled: true,
          active: true,
          totalTaps: 0,
          totalScans: 0,
          lastInteraction: 'Listo para colocar',
          assignedDate: new Date().toISOString().split('T')[0]
        }
      ]
    };

    onRegisterBusiness(newBiz);
    setSelectedBizId(newBiz.id);
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setActiveTab('devices');
    }, 1200);
  };

  const handleSaveRedirect = () => {
    if (!currentBusiness || !editingDevice) return;

    const updatedDevices = currentBusiness.devices.map((dev) => {
      if (dev.id === editingDevice.id) {
        return {
          ...dev,
          targetUrl: newRedirectUrl,
          targetAction: newRedirectAction
        };
      }
      return dev;
    });

    const updatedBiz: RegisteredBusiness = {
      ...currentBusiness,
      devices: updatedDevices
    };

    onUpdateBusiness(updatedBiz);
    setEditingDevice(null);
  };

  const handleToggleDeviceActive = (deviceId: string) => {
    if (!currentBusiness) return;
    const updatedDevices = currentBusiness.devices.map((d) => 
      d.id === deviceId ? { ...d, active: !d.active } : d
    );
    onUpdateBusiness({ ...currentBusiness, devices: updatedDevices });
  };

  const handleTestWebNfc = async () => {
    setNfcWriteStatus('Iniciando prueba...');
    // Check if Web NFC is supported
    if ('NDEFReader' in window) {
      try {
        setNfcWriteStatus('Acerca un chip NFC NTAG al lector del dispositivo...');
        // @ts-ignore
        const ndef = new window.NDEFReader();
        await ndef.write({
          records: [{ recordType: 'url', data: programmerUrl }]
        });
        setNfcWriteStatus('¡Éxito! URL grabada en chip NFC físico correctamente.');
      } catch (err: any) {
        setNfcWriteStatus(`Simulación lista: Protocolo NDEF URI generado (${programmerUrl})`);
      }
    } else {
      setNfcWriteStatus(`NDEF URI preparado: [${programmerUrl}]. Listo para escribir con cualquier grabador NFC estándar.`);
    }
  };

  // Metrics computation
  const totalTaps = currentBusiness?.devices.reduce((acc, d) => acc + d.totalTaps, 0) || 0;
  const totalScans = currentBusiness?.devices.reduce((acc, d) => acc + d.totalScans, 0) || 0;
  const totalInteractions = totalTaps + totalScans;

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Business Switcher Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">
                  {currentBusiness?.tradeName || 'Panel de Negocios AhorraAI'}
                </h1>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentBusiness?.taxId}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{currentBusiness?.sector}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {currentBusiness?.city || 'España'}
                </span>
              </p>
            </div>
          </div>

          {/* Select registered company dropdown */}
          <div className="flex items-center gap-2.5">
            <label htmlFor="biz-selector" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Empresa Activa:
            </label>
            <select
              id="biz-selector"
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.tradeName} ({b.city})
                </option>
              ))}
            </select>

            <button
              onClick={() => setActiveTab('register')}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Negocio</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          {[
            { id: 'devices', label: 'Soportes & Redirección Dinámica', icon: Radio, count: currentBusiness?.devices.length },
            { id: 'analytics', label: 'Métricas & Estadísticas en Vivo', icon: BarChart3 },
            { id: 'nfc_programmer', label: 'Programador NFC & Generador QR', icon: QrCode },
            { id: 'orders', label: 'Pedidos & Estado de Fabricación', icon: PackageCheck, count: orders.length },
            { id: 'register', label: '+ Nuevo Negocio', icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DEVICES & DYNAMIC REDIRECTION */}
        {activeTab === 'devices' && (
          <div className="space-y-4">
            
            {/* Banner explaining dynamic redirection */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-indigo-950">
                    Redirección Inteligente en la Nube AhorraAI
                  </h3>
                  <p className="text-xs text-indigo-900/80 mt-0.5">
                    Tus carteles, imanes y llaveros físicos no quedan obsoletos cuando cambias de carta, enlace o teléfono. Modifica la URL aquí y cada tap o escaneo se redirigirá instantáneamente al nuevo destino.
                  </p>
                </div>
              </div>
            </div>

            {/* List of Devices */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentBusiness?.devices.map((device) => (
                <div 
                  key={device.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={device.image}
                      alt={device.productName}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate">
                          {device.serialNumber}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${device.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                        {device.productName}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        📍 {device.locationName}
                      </p>
                    </div>
                  </div>

                  {/* Destination Info Box */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Acción programada:</span>
                      <span className="font-mono text-indigo-600 capitalize">
                        {device.targetAction.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 truncate" title={device.targetUrl}>
                      🔗 {device.targetUrl}
                    </p>
                  </div>

                  {/* Quick stats for this physical tag */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs border-t border-slate-100 pt-3">
                    <div className="p-1.5 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-500 block">NFC Taps</span>
                      <span className="text-sm font-bold font-mono text-indigo-600 tabular-nums">
                        {device.totalTaps}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-500 block">QR Scans</span>
                      <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                        {device.totalScans}
                      </span>
                    </div>
                  </div>

                  {/* Device Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDevice(device);
                        setNewRedirectUrl(device.targetUrl);
                        setNewRedirectAction(device.targetAction);
                      }}
                      className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3 h-3 text-slate-600" />
                      <span>Cambiar Destino</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleDeviceActive(device.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        device.active 
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {device.active ? 'Pausar' : 'Reactivar'}
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Modal for editing physical device redirection */}
            {editingDevice && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Modificar Destino de Redirección
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {editingDevice.serialNumber} · {editingDevice.productName}
                      </p>
                    </div>
                    <button 
                      onClick={() => setEditingDevice(null)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tipo de Acción
                    </label>
                    <select
                      value={newRedirectAction}
                      onChange={(e) => setNewRedirectAction(e.target.value as ActionType)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
                    >
                      <option value="google_reviews">Reseñas de Google (Maps 5 Estrellas)</option>
                      <option value="menu_digital">Menú Digital / Carta de Platos</option>
                      <option value="dynamic_redirect">Página Promocional Dinámica</option>
                      <option value="whatsapp_direct">WhatsApp Directo</option>
                      <option value="wifi_connect">Conexión WiFi Directa</option>
                      <option value="vcard_contact">Contacto vCard</option>
                      <option value="custom_url">URL Externa Personalizada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nueva URL o Parámetro de Destino
                    </label>
                    <input
                      type="text"
                      value={newRedirectUrl}
                      onChange={(e) => setNewRedirectUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Cualquier persona que acerque su móvil o escanee el QR será dirigida inmediatamente a esta URL.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingDevice(null)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRedirect}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Guardar y Aplicar en la Nube
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ANALYTICS & METRICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Taps NFC</p>
                <p className="text-2xl font-extrabold font-mono text-indigo-600 mt-1 tabular-nums">
                  {totalTaps.toLocaleString()}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">Acercamientos físicos</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Escaneos QR</p>
                <p className="text-2xl font-extrabold font-mono text-slate-800 mt-1 tabular-nums">
                  {totalScans.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">Lecturas ópticas</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interacciones Totales</p>
                <p className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                  {totalInteractions.toLocaleString()}
                </p>
                <span className="text-[11px] text-indigo-600 font-medium">100% Sin instalación previa</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tasa Estimada Reseñas</p>
                <p className="text-2xl font-extrabold font-mono text-amber-600 mt-1 tabular-nums">
                  38.4 %
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">+185 reseñas este mes</span>
              </div>
            </div>

            {/* Performance breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily distribution */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Horas de Mayor Frecuencia de Taps
                </h3>
                <div className="space-y-3">
                  {[
                    { range: 'Comidas / Mediodía (13:00 - 16:00)', pct: 45, taps: 580 },
                    { range: 'Cenas / Noche (20:00 - 23:30)', pct: 35, taps: 440 },
                    { range: 'Desayunos / Mañanas (08:30 - 11:30)', pct: 15, taps: 190 },
                    { range: 'Tardes / Meriendas (17:00 - 19:30)', pct: 5, taps: 60 }
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-700">
                        <span>{bar.range}</span>
                        <span className="font-mono font-bold">{bar.pct}% ({bar.taps} taps)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${bar.pct}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NFC vs QR Comparison */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Canal de Interacción: Tap NFC vs Escaneo QR
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-slate-800">Tap Directo NFC</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-600">62.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-slate-600" />
                      <span className="font-bold text-slate-800">Cámara / Escáner QR</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700">37.2%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  El chip NFC integrado incrementa la tasa de participación un 72% al evitar que el cliente tenga que abrir la app de cámara y enfocar.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: NFC PROGRAMMER STUDIO & QR EXPORTER */}
        {activeTab === 'nfc_programmer' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Estudio de Programación NFC & Generador de QR Vectorial
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Herramienta técnica para codificar chips NTAG213 / NTAG215 / NTAG216 o exportar el código QR de alta resolución para impresión en tu taller.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Writer Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    URL / Cadena NDEF a Codificar
                  </label>
                  <input
                    type="text"
                    value={programmerUrl}
                    onChange={(e) => setProgrammerUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">Especificación del Estándar NFC Forum Type 2:</p>
                  <div className="font-mono text-[11px] text-slate-600 space-y-1">
                    <p>• Payload: URI Record (0x01)</p>
                    <p>• Prefix: 0x04 (https://)</p>
                    <p>• Longitud calculada: {programmerUrl.length + 5} bytes</p>
                    <p>• Chip recomendado: NXP NTAG213 (144 bytes disponibles)</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleTestWebNfc}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Grabar en Chip Físico (Web NFC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(programmerUrl);
                      alert('Enlace NDEF copiado al portapapeles');
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Payload</span>
                  </button>
                </div>

                {nfcWriteStatus && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-mono text-indigo-900 animate-in fade-in">
                    {nfcWriteStatus}
                  </div>
                )}
              </div>

              {/* QR Preview & Export */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center text-center space-y-4">
                <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(programmerUrl)}`}
                    alt="QR Code"
                    className="w-40 h-40"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Código QR Óptico Verificado</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-xs">
                    {programmerUrl}
                  </p>
                </div>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(programmerUrl)}`}
                  download="ahorraai_qr.png"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Descargar QR para Imprenta (500x500 PNG)</span>
                </a>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & PRODUCTION PIPELINE */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Pedidos de Fabricación y Estado de Entrega
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <PackageCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No hay pedidos registrados aún</p>
                <p className="text-xs">Haz un pedido de prueba desde la tienda pública para ver su ciclo de producción aquí.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.orderNumber} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {ord.orderNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{ord.customerName}</h4>
                        <span className="text-xs text-slate-500">Fecha: {ord.date} · Tracking: {ord.trackingNumber}</span>
                      </div>
                      
                      {/* Status pipeline badge */}
                      <span className="self-start sm:self-center px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                        ● {ord.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{it.quantity}x {it.product.name} ({it.selectedChip})</span>
                          <span className="font-mono font-semibold">{(it.unitPrice * it.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900 font-mono">
                      <span>Total Facturado:</span>
                      <span>{ord.total.toFixed(2)} €</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REGISTER NEW BUSINESS */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Registro de Nuevo Negocio / Comercio en AhorraAI
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Registra tu empresa para vincular tus soportes físicos troquelados, gestionar su redirección dinámica y consultar analíticas de impacto.
              </p>
            </div>

            {registerSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950">¡Negocio Registrado Exitosamente!</h3>
                <p className="text-xs text-emerald-800">Cargando panel de soportes y chips...</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Nombre Comercial del Negocio *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      placeholder="Ej. Cafetería La Taza de Oro"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      CIF / NIF de Empresa
                    </label>
                    <input
                      type="text"
                      value={newBizTaxId}
                      onChange={(e) => setNewBizTaxId(e.target.value)}
                      placeholder="B-99887766"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Sector de Actividad
                    </label>
                    <select
                      value={newBizSector}
                      onChange={(e) => setNewBizSector(e.target.value as ProductSector)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      {SECTORS_LIST.filter(s => s !== 'Todos').map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Ciudad / Localidad
                    </label>
                    <input
                      type="text"
                      value={newBizCity}
                      onChange={(e) => setNewBizCity(e.target.value)}
                      placeholder="Madrid, Barcelona, Sevilla..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Email de Contacto *
                    </label>
                    <input
                      type="email"
                      required
                      value={newBizEmail}
                      onChange={(e) => setNewBizEmail(e.target.value)}
                      placeholder="contacto@lanegocio.es"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Teléfono o WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      placeholder="+34 600 123 456"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Enlace de Google Maps Reviews (Para reseñas 5★)
                  </label>
                  <input
                    type="url"
                    value={newBizGoogleUrl}
                    onChange={(e) => setNewBizGoogleUrl(e.target.value)}
                    placeholder="https://g.page/r/... o https://maps.google.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Al introducirlo, pre-configuraremos automáticamente tu primer tótem acrílico de reseñas.
                  </span>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Guardar y Crear Ficha de Negocio
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
