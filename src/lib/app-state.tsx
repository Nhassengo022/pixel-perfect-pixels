import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as demoProducts, type Product } from "@/data/demo";
import { defaultSettings, computeTotals, commissionFor, type Settings } from "@/lib/pricing";
import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/orders";

type Cart = { storeId: string | null; items: Record<string, number> };

type State = {
  cart: Cart;
  orders: Order[];
  products: Product[];
  settings: Settings;
};

type Ctx = State & {
  addToCart: (p: Product) => boolean;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (input: { address: string; notes?: string; paymentMethod: PaymentMethod; paymentRef?: string }) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  setPaymentStatus: (id: string, status: PaymentStatus) => void;
  assignCourier: (id: string, courierId: string) => void;
  reportIncident: (id: string, text: string) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  updateSettings: (s: Settings) => void;
  resetDemo: () => void;
};

const KEY = "compras-matola-demo-v1";
const initial: State = { cart: { storeId: null, items: {} }, orders: [], products: demoProducts, settings: defaultSettings };
const AppCtx = createContext<Ctx | null>(null);
const now = () => new Date().toISOString();

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch { /* ignorar */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, loaded]);

  const value = useMemo<Ctx>(() => {
    const patchOrder = (id: string, fn: (o: Order) => Order) =>
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? fn(o) : o)) }));

    return {
      ...state,
      addToCart: (p) => {
        if (state.cart.storeId && state.cart.storeId !== p.storeId && Object.keys(state.cart.items).length) return false;
        setState((s) => ({
          ...s,
          cart: { storeId: p.storeId, items: { ...s.cart.items, [p.id]: Math.min((s.cart.items[p.id] ?? 0) + 1, p.stock) } },
        }));
        return true;
      },
      setQty: (productId, qty) =>
        setState((s) => {
          const items = { ...s.cart.items };
          if (qty <= 0) delete items[productId]; else items[productId] = qty;
          return { ...s, cart: { storeId: Object.keys(items).length ? s.cart.storeId : null, items } };
        }),
      clearCart: () => setState((s) => ({ ...s, cart: { storeId: null, items: {} } })),
      placeOrder: ({ address, notes, paymentMethod, paymentRef }) => {
        const items = Object.entries(state.cart.items).map(([id, qty]) => {
          const p = state.products.find((x) => x.id === id)!;
          return { productId: id, name: p.name, unit: p.unit, price: p.price, qty };
        });
        const t = computeTotals(items, state.settings);
        const order: Order = {
          id: `MA-${Date.now().toString().slice(-6)}`,
          storeId: state.cart.storeId!,
          items,
          subtotal: t.subtotal,
          deliveryFee: t.deliveryFee,
          total: t.total,
          commission: commissionFor(t.subtotal, state.settings),
          status: "recebida",
          paymentMethod,
          // Nunca confirmar automaticamente: carteiras móveis aguardam verificação manual.
          paymentStatus: paymentMethod === "dinheiro" ? "pendente" : "aguarda_verificacao",
          paymentRef,
          address,
          notes,
          createdAt: now(),
          history: [{ status: "recebida", at: now() }],
        };
        setState((s) => ({ ...s, orders: [order, ...s.orders], cart: { storeId: null, items: {} } }));
        return order;
      },
      setOrderStatus: (id, status) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status, history: [...o.history, { status, at: now() }] } : o)),
          // repor stock quando a loja aceita
          products:
            status === "aceite"
              ? s.products.map((p) => {
                  const it = s.orders.find((o) => o.id === id)?.items.find((i) => i.productId === p.id);
                  return it ? { ...p, stock: Math.max(0, p.stock - it.qty) } : p;
                })
              : s.products,
        })),
      setPaymentStatus: (id, paymentStatus) => patchOrder(id, (o) => ({ ...o, paymentStatus })),
      assignCourier: (id, courierId) => patchOrder(id, (o) => ({ ...o, courierId })),
      reportIncident: (id, incident) => patchOrder(id, (o) => ({ ...o, incident })),
      updateProduct: (id, patch) =>
        setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      updateSettings: (settings) => setState((s) => ({ ...s, settings })),
      resetDemo: () => setState(initial),
    };
  }, [state]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp fora do AppStateProvider");
  return c;
}
