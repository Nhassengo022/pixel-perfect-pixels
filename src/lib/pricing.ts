export type Settings = {
  minOrder: number; // MT
  deliveryFee: number; // MT
  commissionRate: number; // 0..1 sobre o subtotal
  courierFee: number; // MT pago ao estafeta por entrega
};

export const defaultSettings: Settings = {
  minOrder: 300,
  deliveryFee: 100,
  commissionRate: 0.1,
  courierFee: 70,
};

export type Line = { price: number; qty: number };

export function computeTotals(lines: Line[], settings: Settings) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const deliveryFee = lines.length ? settings.deliveryFee : 0;
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    meetsMinimum: subtotal >= settings.minOrder,
    missing: Math.max(0, settings.minOrder - subtotal),
  };
}

export function commissionFor(subtotal: number, settings: Settings) {
  return Math.round(subtotal * settings.commissionRate);
}

export const formatMT = (v: number) =>
  `${v.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MT`;
