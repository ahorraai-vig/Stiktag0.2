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

// The 2 core functions for the MVP
export type NfcTargetFunction = 'google_reviews' | 'unitree_contact';

export type ActionType = 'google_reviews' | 'unitree_contact' | 'digital_menu' | 'whatsapp_direct';

export interface UnitreeContactData {
  webUrl: string;
  phone: string;
  sms: string;
  email: string;
  // Aliases for convenience
  websiteUrl?: string;
  smsPhone?: string;
}

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
  popularAction?: string;
  badge?: string;
  includesKeyring?: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: ProductItem;
  quantity: number;
  selectedFunction: NfcTargetFunction;
  googleReviewUrl?: string;
  unitreeData?: UnitreeContactData;
  businessNameOnProduct: string;
  unitPrice: number;
  selectedMaterial?: string;
  selectedChip?: string;
  targetAction?: string;
  customUrlOrData?: string;
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

export interface DbProduct {
  id: string;
  name: string;
  format: string;
  sector: string;
  price: number;
  image: string;
  description: string;
  created_at?: string;
}

export interface DbSmartTag {
  id: string;
  business_id: string;
  device_name: string;
  format: string;
  target_url: string;
  target_action: string;
  total_taps: number;
  dynamic_redirect_enabled: boolean;
  nfc_chip: string;
}

export interface DbOrder {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: unknown;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  tracking_number?: string;
  created_at?: string;
}

export type DemoScenarioId = 'reviews' | 'unitree';
