import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { stores } from "@/data/demo";
import { useApp } from "@/lib/app-state";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui-bits";
import { computeTotals, formatMT } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lojas/$storeId")({
  loader: ({ params }) => {
    const store = stores.find((s) => s.id === params.storeId);
    if (!store) throw notFound();
    return { store };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.store.name} — Pertinho Matola` },
          { name: "description", content: `Produtos de ${loaderData.store.name}, ${loaderData.store.area}, com entrega em casa.` },
          { property: "og:title", content: `${loaderData.store.name} — Pertinho Matola` },
          { property: "og:description", content: `Encomende em ${loaderData.store.name} e receba em casa.` },
        ]
      : [{ title: "Loja não encontrada" }, { name: "robots", content: "noindex" }],
  }),
  component: StorePage,
});

function StorePage() {
  const { store } = Route.useLoaderData();
  const { products, cart, settings } = useApp();
  const list = products.filter((p) => p.storeId === store.id);
  const cats = ["Todos", ...Array.from(new Set(list.map((p) => p.category)))];
  const [cat, setCat] = useState("Todos");
  const shown = cat === "Todos" ? list : list.filter((p) => p.category === cat);

  const inCart = cart.storeId === store.id ? Object.entries(cart.items) : [];
  const t = computeTotals(inCart.map(([id, qty]) => ({ price: products.find((p) => p.id === id)!.price, qty })), settings);

  return (
    <div>
      <div className="card mb-6 overflow-hidden sm:flex">
        <img src={store.image} alt={store.name} width={1024} height={640} className="aspect-[16/9] w-full object-cover sm:w-80" />
        <div className="p-5">
          <Badge tone={store.open ? "success" : "danger"}>{store.open ? "Aberta" : "Fechada de momento"}</Badge>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{store.name}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{store.area}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{store.eta}</span>
            <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{store.phone}</span>
          </div>
          <p className="mt-3 text-sm">Compra mínima {formatMT(settings.minOrder)} · Entrega {formatMT(settings.deliveryFee)}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("btn shrink-0 py-1.5", c === cat ? "btn-primary" : "btn-outline")}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => <ProductCard key={p.id} product={p} storeOpen={store.open} />)}
      </div>

      {inCart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card p-3">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-semibold">Produtos: {formatMT(t.subtotal)}</p>
              {!t.meetsMinimum && <p className="text-xs text-muted-foreground">Faltam {formatMT(t.missing)} para o mínimo</p>}
            </div>
            <Link to="/carrinho" className="btn btn-primary">Ver carrinho</Link>
          </div>
        </div>
      )}
    </div>
  );
}
