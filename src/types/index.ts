export type ProductFormat = 
  | 'Cartel Acrílico / Metacrilato'
  | 'Pack Cartel + Llaveros'
  | 'Cartel Mural / Placa'
  | 'Cartel Acrílico + Pegatinas'
  | 'Posavasos Inteligentes'
  | 'Imanes & Llaveros'
  | 'Imanes Inteligentes'
  | 'Adhesivos & Vinilos Troquelados'
  | 'Llaveros Inteligentes'
  | 'Estacas & Señalética Botánica'
  | 'Chapas & Pines de Solapa';

export type ProductSector = 
  | 'Todos'
  | 'Hostelería & Gastronomía'
  | 'Salud & Odontología'
  | 'Automoción & Talleres'
  | 'Belleza & Barbería'
  | 'Inmobiliaria & Hogar'
  | 'Fitness & Deporte'
  | 'Mascotas & Veterinaria'
  | 'Lujo, Joyería & Óptica'
  | 'Comercio & Servicios';

export type NfcChipType = 'NTAG213' | 'NTAG215' | 'NTAG216';

export type ActionType = 
  | 'google_reviews'
  | 'menu_digital'
  | 'vcard_contact'
  | 'wifi_connect'
  | 'whatsapp_direct'
  | 'dynamic_redirect'
  | 'custom_url';

export interface ProductItem {
  id: string;
  name: string;
  format: ProductFormat;
  sector: ProductSector;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  materials: string[];
  dimensions: string;
  nfcChip: NfcChipType;
  popularAction: ActionType;
  badge?: string;
  includesKeyring?: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: ProductItem;
  quantity: number;
  selectedMaterial: string;
  selectedChip: NfcChipType;
  targetAction: ActionType;
  customUrlOrData: string;
  businessNameOnProduct: string;
  unitPrice: number;
}

export interface BusinessDevice {
  id: string;
  productId: string;
  productName: string;
  format: string;
  image: string;
  serialNumber: string;
  locationName: string;
  targetAction: ActionType;
  targetUrl: string;
  dynamicRedirectEnabled: boolean;
  active: boolean;
  totalTaps: number;
  totalScans: number;
  lastInteraction: string;
  assignedDate: string;
}

export interface RegisteredBusiness {
  id: string;
  tradeName: string;
  taxId: string; // CIF/NIF
  sector: ProductSector;
  contactEmail: string;
  phone: string;
  address: string;
  city: string;
  googleReviewUrl: string;
  primaryWebsite: string;
  whatsappContact: string;
  devices: BusinessDevice[];
  createdAt: string;
}

export interface OrderRecord {
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Diseño Troquel' | 'Corte Láser & Impresión' | 'Grabado NFC' | 'Enviado';
  trackingNumber?: string;
}
