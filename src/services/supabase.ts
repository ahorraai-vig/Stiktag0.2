import { createClient } from '@supabase/supabase-js';
import { DbProduct, DbSmartTag, DbOrder, ActionType } from '../types';
import { PRODUCTS_DATA } from '../data/products';

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
