import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { stores } from "@/data/demo";
import { useApp } from "@/lib/app-state";
import { computeTotals, formatMT } from "@/lib/pricing";
import { Empty, PageTitle, Stepper, TotalsBox } from "@/components/ui-bits";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Pertinho Matola" },
      { name: "description", content: "Reveja os produtos antes de finalizar a encomenda." },
      { property: "og:title", content: "Carrinho — Pertinho Matola" },
      { property: "og:description", content: "Reveja os produtos antes de finalizar a encomenda." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, products, settings, setQty, clearCart } = useApp();
  const store = stores.find((s) => s.id === cart.storeId);
  const lines = Object.entries(cart.items).map(([id, qty]) => ({ p: products.find((x) => x.id === id)!, qty }));
  const t = computeTotals(lines.map((l) => ({ price: l.p.price, qty: l.qty })), settings);

  if (!store || lines.length === 0)
    return (<><PageTitle title="Carrinho" /><Empty>O carrinho está vazio. <Link to="/lojas" className="font-semibold text-primary">Escolher uma loja</Link></Empty></>);

  return (
    <div>
      <PageTitle title="Carrinho" subtitle={`Encomenda de ${store.name}`} action={<button className="btn btn-outline py-2" onClick={clearCart}><Trash2 className="h-4 w-4" />Esvaziar</button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="card divide-y divide-border">
          {lines.map(({ p, qty }) => (
            <li key={p.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-2xl">{p.emoji}</span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.unit} · {formatMT(p.price)}</p>
                <div className="mt-2"><Stepper value={qty} max={p.stock} onChange={(v) => setQty(p.id, v)} /></div>
              </div>
              <p className="font-semibold">{formatMT(p.price * qty)}</p>
            </li>
          ))}
        </ul>
        <aside className="card h-fit space-y-4 p-5">
          <TotalsBox {...t} />
          {!t.meetsMinimum && (
            <p className="rounded-lg bg-warning/20 p-3 text-sm">A compra mínima é {formatMT(settings.minOrder)}. Faltam {formatMT(t.missing)}.</p>
          )}
          {t.meetsMinimum ? (
            <Link to="/checkout" className="btn btn-primary w-full">Finalizar encomenda</Link>
          ) : (
            <button disabled className="btn btn-primary w-full">Finalizar encomenda</button>
          )}
          <Link to="/lojas/$storeId" params={{ storeId: store.id }} className="btn btn-outline w-full">Continuar a comprar</Link>
        </aside>
      </div>
    </div>
  );
}
