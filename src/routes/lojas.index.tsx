import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { stores } from "@/data/demo";
import { useApp } from "@/lib/app-state";
import { StoreCard } from "@/components/StoreCard";
import { PageTitle, Empty } from "@/components/ui-bits";
import { formatMT } from "@/lib/pricing";

export const Route = createFileRoute("/lojas/")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Lojas em Matola A — Pertinho Matola" },
      { name: "description", content: "Mercearias, cantinas e frutarias de Matola A com entrega ao domicílio." },
      { property: "og:title", content: "Lojas em Matola A — Pertinho Matola" },
      { property: "og:description", content: "Mercearias, cantinas e frutarias de Matola A com entrega ao domicílio." },
    ],
  }),
  component: StoresPage,
});

function StoresPage() {
  const { q } = Route.useSearch();
  const { products } = useApp();
  const term = (q ?? "").trim().toLowerCase();
  const matches = term ? products.filter((p) => p.name.toLowerCase().includes(term)) : [];

  return (
    <div>
      <PageTitle title="Lojas" subtitle="Matola A · lojas participantes no projecto-piloto" />
      {term && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold">Resultados para “{q}”</h2>
          {matches.length === 0 ? <Empty>Nenhum produto encontrado.</Empty> : (
            <ul className="card divide-y divide-border">
              {matches.map((p) => (
                <li key={p.id}>
                  <Link to="/lojas/$storeId" params={{ storeId: p.storeId }} className="flex items-center gap-3 p-3 hover:bg-muted">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-medium">{p.name} · {p.unit}</span><span className="text-xs text-muted-foreground">{stores.find((s) => s.id === p.storeId)?.name}</span></span>
                    <span className="font-semibold text-primary">{formatMT(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => <StoreCard key={s.id} store={s} />)}
      </div>
    </div>
  );
}
