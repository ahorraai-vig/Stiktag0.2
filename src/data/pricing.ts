/**
 * Configuration and calculations for volume pricing
 * Standard format: Cartel acrílico troquelado 125mm x 125mm
 * Pricing from 49,99 € (1 unit) with progressive discounts for 5, 10, 20, 50, 100, and 200 units.
 */

export interface PriceTier {
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  label: string;
  popular?: boolean;
  total: number;
}

export const BASE_UNIT_PRICE = 49.99;
export const STANDARD_DIMENSIONS = '125 mm × 125 mm';

export const QUANTITY_TIERS: PriceTier[] = [
  {
    quantity: 1,
    unitPrice: 49.99,
    discountPercent: 0,
    label: '1 ud',
    total: 49.99
  },
  {
    quantity: 5,
    unitPrice: 39.99,
    discountPercent: 20,
    label: '5 uds',
    total: 199.95
  },
  {
    quantity: 10,
    unitPrice: 34.99,
    discountPercent: 30,
    label: '10 uds',
    popular: true,
    total: 349.90
  },
  {
    quantity: 20,
    unitPrice: 29.99,
    discountPercent: 40,
    label: '20 uds',
    total: 599.80
  },
  {
    quantity: 50,
    unitPrice: 24.99,
    discountPercent: 50,
    label: '50 uds',
    total: 1249.50
  },
  {
    quantity: 100,
    unitPrice: 19.99,
    discountPercent: 60,
    label: '100 uds',
    total: 1999.00
  },
  {
    quantity: 200,
    unitPrice: 16.99,
    discountPercent: 66,
    label: '200 uds',
    total: 3398.00
  }
];

/**
 * Gets the corresponding price tier based on quantity
 */
export function getTierForQuantity(quantity: number): PriceTier {
  if (quantity >= 200) return QUANTITY_TIERS[6];
  if (quantity >= 100) return QUANTITY_TIERS[5];
  if (quantity >= 50) return QUANTITY_TIERS[4];
  if (quantity >= 20) return QUANTITY_TIERS[3];
  if (quantity >= 10) return QUANTITY_TIERS[2];
  if (quantity >= 5) return QUANTITY_TIERS[1];
  return QUANTITY_TIERS[0];
}

/**
 * Calculates unit price, total price, discount percentage and total savings for any quantity
 */
export function calculateTierPrice(quantity: number) {
  const safeQty = Math.max(1, quantity);
  const tier = getTierForQuantity(safeQty);
  const unitPrice = tier.unitPrice;
  const total = Number((unitPrice * safeQty).toFixed(2));
  const baseTotal = Number((BASE_UNIT_PRICE * safeQty).toFixed(2));
  const savings = Number((baseTotal - total).toFixed(2));

  return {
    tier,
    unitPrice,
    total,
    discountPercent: tier.discountPercent,
    savings,
    baseTotal
  };
}
