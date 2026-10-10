import { describe, expect, it } from "vitest";
import { computeTotals, commissionFor, defaultSettings } from "./pricing";

describe("pricing", () => {
  it("shows subtotal, delivery fee and total separately", () => {
    const t = computeTotals([{ price: 150, qty: 2 }, { price: 50, qty: 1 }], defaultSettings);
    expect(t.subtotal).toBe(350);
    expect(t.deliveryFee).toBe(100);
    expect(t.total).toBe(450);
  });
  it("blocks orders below the configurable minimum", () => {
    const t = computeTotals([{ price: 100, qty: 2 }], { ...defaultSettings, minOrder: 300 });
    expect(t.meetsMinimum).toBe(false);
    expect(t.missing).toBe(100);
    expect(computeTotals([{ price: 100, qty: 2 }], { ...defaultSettings, minOrder: 150 }).meetsMinimum).toBe(true);
  });
  it("uses the configured delivery fee and commission", () => {
    const s = { ...defaultSettings, deliveryFee: 80, commissionRate: 0.05 };
    expect(computeTotals([{ price: 400, qty: 1 }], s).total).toBe(480);
    expect(commissionFor(400, s)).toBe(20);
  });
});
