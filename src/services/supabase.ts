import { createClient } from '@supabase/supabase-js';
import { DbProduct, DbSmartTag, DbOrder, ActionType, Business, DbBusiness } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import { generateShortSlug, sanitizeSlug, isValidSlugFormat } from '../utils/slug';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client instance
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch products from Supabase 'products' table, falling back to local dataset if offline or unconfigured
 */
export async function fetchProducts(): Promise<DbProduct[]> {
  if (!supabase) {
    return PRODUCTS_DATA.map((p) => ({
      id: p.id,
      name: p.name,
      format: p.format,
      sector: p.sector,
      price: p.price,
      image: p.image,
      description: p.description,
    }));
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, format, sector, price, image, description')
      .order('price', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase products table empty or error, using local fallback:', error?.message);
      return PRODUCTS_DATA.map((p) => ({
        id: p.id,
        name: p.name,
        format: p.format,
        sector: p.sector,
        price: p.price,
        image: p.image,
        description: p.description,
      }));
    }

    return data as DbProduct[];
  } catch (err) {
    console.warn('Failed to query products from Supabase:', err);
    return PRODUCTS_DATA.map((p) => ({
      id: p.id,
      name: p.name,
      format: p.format,
      sector: p.sector,
      price: p.price,
      image: p.image,
      description: p.description,
    }));
  }
}

/**
 * Fetch smart tags from Supabase 'smart_tags' table
 */
export async function fetchSmartTags(businessId?: string): Promise<DbSmartTag[]> {
  if (!supabase) return [];

  try {
    let query = supabase.from('smart_tags').select('*');
    if (businessId) {
      query = query.eq('business_id', businessId);
    }
    const { data, error } = await query.order('total_taps', { ascending: false });

    if (error) {
      console.warn('Error fetching smart_tags from Supabase:', error.message);
      return [];
    }
    return (data as DbSmartTag[]) || [];
  } catch (err) {
    console.warn('Failed to fetch smart_tags:', err);
    return [];
  }
}

/**
 * Update smart tag target redirect URL & action
 */
export async function updateSmartTagRedirect(
  tagId: string,
  targetUrl: string,
  targetAction: ActionType
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('smart_tags')
      .update({
        target_url: targetUrl,
        target_action: targetAction,
        dynamic_redirect_enabled: true,
      })
      .eq('id', tagId);

    if (error) {
      console.warn('Error updating smart_tag in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update smart_tag redirect:', err);
    return false;
  }
}

/**
 * Fetch orders from Supabase 'orders' table
 */
export async function fetchOrders(): Promise<DbOrder[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching orders from Supabase:', error.message);
      return [];
    }
    return (data as DbOrder[]) || [];
  } catch (err) {
    console.warn('Failed to query orders:', err);
    return [];
  }
}

/**
 * Insert new order record into Supabase 'orders' table
 */
export async function insertOrder(order: DbOrder): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('orders').insert([order]);
    if (error) {
      console.warn('Error inserting order into Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert order into Supabase:', err);
    return false;
  }
}

// ==========================================
// NEGOCIOS (BUSINESSES) MANAGEMENT & NFC SLUGS
// ==========================================

const INITIAL_VIGO_BUSINESSES: Business[] = [
  {
    id: 'biz-m7k2',
    name: 'Burger Joint & Craft Grill',
    city: 'Vigo',
    sector: 'Hostelería & Gastronomía',
    phone: '+34 986 22 14 55',
    website: 'https://burgerjoint.es',
    email: 'contacto@burgerjoint.es',
    googleReviewsUrl: 'https://g.page/r/example-burgerjoint-vigo/review',
    description: 'Hamburguesas gourmet artesanas y cervezas artesanales en el centro de Vigo.',
    slug: 'm7k2',
    statusRecord: 'DICHO',
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z'
  },
  {
    id: 'biz-p3x8',
    name: 'Clínica Dental Progreso',
    city: 'Vigo',
    sector: 'Salud & Odontología',
    phone: '+34 986 44 89 20',
    website: 'https://dentalprogreso.com',
    email: 'citas@dentalprogreso.com',
    googleReviewsUrl: 'https://g.page/r/example-dentalprogreso-vigo/review',
    description: 'Odontología integral y ortodoncia invisible en Calle del Progreso, Vigo.',
    slug: 'p3x8',
    statusRecord: 'DICHO',
    createdAt: '2026-10-26T12:00:00Z',
    updatedAt: '2026-10-26T12:00:00Z'
  },
  {
    id: 'biz-v9f2',
    name: 'Taller Mecánico O Berbés',
    city: 'Vigo',
    sector: 'Automoción & Talleres',
    phone: '+34 986 11 33 77',
    website: '',
    email: 'berbesmecanica@gmail.com',
    googleReviewsUrl: 'https://g.page/r/example-tallerberbes-vigo/review',
    description: 'Mantenimiento, diagnosis electrónica y pre-ITV en Vigo.',
    slug: 'v9f2',
    statusRecord: 'OBSERVADO',
    createdAt: '2026-10-27T16:00:00Z',
    updatedAt: '2026-10-27T16:00:00Z'
  }
];

function getLocalBusinesses(): Business[] {
  try {
    const raw = localStorage.getItem('ahorraai_businesses');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore error
  }
  return INITIAL_VIGO_BUSINESSES;
}

function saveLocalBusinesses(list: Business[]): void {
  try {
    localStorage.setItem('ahorraai_businesses', JSON.stringify(list));
  } catch {
    // Ignore error
  }
}

function mapDbToBusiness(row: DbBusiness): Business {
  return {
    id: row.id || `biz-${row.slug}`,
    name: row.name,
    city: row.city || 'Vigo',
    sector: row.sector,
    phone: row.phone || undefined,
    website: row.website || undefined,
    email: row.email || undefined,
    logoUrl: row.logo_url || undefined,
    description: row.description || undefined,
    googleReviewsUrl: row.google_reviews_url || undefined,
    slug: row.slug,
    statusRecord: (row.status_record as any) || 'DICHO',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBusinessToDb(b: Partial<Business>): DbBusiness {
  return {
    id: b.id,
    name: b.name || '',
    city: b.city || 'Vigo',
    sector: b.sector || 'Comercio & Servicios',
    phone: b.phone || null,
    website: b.website || null,
    email: b.email || null,
    logo_url: b.logoUrl || null,
    description: b.description || null,
    google_reviews_url: b.googleReviewsUrl || null,
    slug: b.slug || '',
    status_record: b.statusRecord || 'DICHO',
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch all registered businesses (from Supabase, fallback to local storage)
 */
export async function fetchBusinesses(): Promise<Business[]> {
  const localList = getLocalBusinesses();

  if (!supabase) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Table might not exist or be empty yet
      return localList;
    }

    const remoteList = (data as DbBusiness[]).map(mapDbToBusiness);
    // Sync to local cache
    saveLocalBusinesses(remoteList);
    return remoteList;
  } catch (err) {
    console.warn('Failed to query businesses from Supabase, using local fallback:', err);
    return localList;
  }
}

/**
 * Fetch single business by its unique short slug
 */
export async function fetchBusinessBySlug(slug: string): Promise<Business | null> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) return null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle();

      if (!error && data) {
        return mapDbToBusiness(data as DbBusiness);
      }
    } catch (err) {
      console.warn('Error querying business by slug from Supabase:', err);
    }
  }

  // Fallback to local
  const local = getLocalBusinesses();
  const match = local.find((b) => b.slug.toLowerCase() === cleanSlug.toLowerCase());
  return match || null;
}

/**
 * Check if a candidate slug is available (not colliding with existing records or reserved paths)
 */
export async function checkSlugAvailability(
  slug: string,
  excludeBusinessId?: string
): Promise<{ available: boolean; reason?: string }> {
  const cleanSlug = sanitizeSlug(slug);
  if (!isValidSlugFormat(cleanSlug)) {
    return { available: false, reason: 'Formato no válido (mínimo 3 caracteres alfanuméricos minúsculas)' };
  }

  // Check local cache
  const local = getLocalBusinesses();
  const localCollision = local.some(
    (b) => b.slug.toLowerCase() === cleanSlug.toLowerCase() && b.id !== excludeBusinessId
  );
  if (localCollision) {
    return { available: false, reason: 'El identificador ya está asignado a otro negocio' };
  }

  // Check Supabase if connected
  if (supabase) {
    try {
      let query = supabase.from('businesses').select('id, slug').eq('slug', cleanSlug);
      if (excludeBusinessId) {
        query = query.neq('id', excludeBusinessId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return { available: false, reason: 'El identificador ya existe en la base de datos' };
      }
    } catch {
      // Allow fallback
    }
  }

  return { available: true };
}

/**
 * Generate a guaranteed unique 4-character slug
 */
export async function generateUniqueShortSlug(excludeBusinessId?: string): Promise<string> {
  let attempts = 0;
  while (attempts < 20) {
    const candidate = generateShortSlug(4);
    const check = await checkSlugAvailability(candidate, excludeBusinessId);
    if (check.available) {
      return candidate;
    }
    attempts++;
  }
  // Fallback: 5 characters if 4 collision occurred repeatedly
  return generateShortSlug(5);
}

/**
 * Save business: Create new or update existing
 */
export async function saveBusiness(
  businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<{ success: boolean; business?: Business; error?: string }> {
  const cleanSlug = sanitizeSlug(businessData.slug);
  if (!isValidSlugFormat(cleanSlug)) {
    return { success: false, error: 'Identificador corto no válido' };
  }

  // Check availability
  const availability = await checkSlugAvailability(cleanSlug, businessData.id);
  if (!availability.available) {
    return { success: false, error: availability.reason || 'El slug ya está en uso' };
  }

  const isNew = !businessData.id;
  const now = new Date().toISOString();
  const businessId = businessData.id || `biz-${Date.now()}-${cleanSlug}`;

  const fullBusiness: Business = {
    id: businessId,
    name: businessData.name.trim(),
    city: (businessData.city || 'Vigo').trim(),
    sector: businessData.sector.trim(),
    phone: businessData.phone?.trim() || undefined,
    website: businessData.website?.trim() || undefined,
    email: businessData.email?.trim() || undefined,
    logoUrl: businessData.logoUrl?.trim() || undefined,
    description: businessData.description?.trim() || undefined,
    googleReviewsUrl: businessData.googleReviewsUrl?.trim() || undefined,
    slug: cleanSlug,
    statusRecord: businessData.statusRecord || 'DICHO',
    createdAt: isNew ? now : undefined,
    updatedAt: now,
  };

  // Try Supabase first
  let dbSaved = false;
  if (supabase) {
    try {
      const dbPayload = mapBusinessToDb(fullBusiness);
      if (isNew) {
        delete (dbPayload as any).id; // Let Supabase generate UUID if configured, or use fallback
        const { data, error } = await supabase.from('businesses').insert([dbPayload]).select().single();
        if (!error && data) {
          fullBusiness.id = data.id;
          fullBusiness.createdAt = data.created_at;
          dbSaved = true;
        } else if (error) {
          console.warn('Supabase insert business error (will fallback to local):', error.message);
        }
      } else {
        const { error } = await supabase
          .from('businesses')
          .update(dbPayload)
          .eq('id', businessId);
        if (!error) {
          dbSaved = true;
        } else {
          console.warn('Supabase update business error (will fallback to local):', error.message);
        }
      }
    } catch (err) {
      console.warn('Failed to persist business to Supabase:', err);
    }
  }

  // Update local cache
  const localList = getLocalBusinesses();
  const existingIdx = localList.findIndex((b) => b.id === fullBusiness.id || b.slug === fullBusiness.slug);
  if (existingIdx >= 0) {
    localList[existingIdx] = { ...localList[existingIdx], ...fullBusiness };
  } else {
    localList.unshift(fullBusiness);
  }
  saveLocalBusinesses(localList);

  return { success: true, business: fullBusiness };
}

/**
 * Delete business by ID
 */
export async function deleteBusiness(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('businesses').delete().eq('id', id);
    } catch (err) {
      console.warn('Failed to delete business from Supabase:', err);
    }
  }

  const localList = getLocalBusinesses();
  const filtered = localList.filter((b) => b.id !== id);
  saveLocalBusinesses(filtered);
  return true;
}
