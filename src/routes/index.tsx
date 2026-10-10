import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, Clock, Truck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { stores } from "@/data/demo";
import { StoreCard } from "@/components/StoreCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pertinho Matola — Mercearias de Matola A em sua casa" },
      { name: "description", content: "Encomende na mercearia ou cantina mais próxima em Matola A e receba em casa com os nossos estafetas." },
      { property: "og:title", content: "Pertinho Matola — Mercearias de Matola A em sua casa" },
      { property: "og:description", content: "Encomende na mercearia mais próxima e receba em casa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <img src={hero} alt="Estafeta com compras em Matola" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="relative max-w-xl p-6 sm:p-10">
          <p className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"><MapPin className="h-3.5 w-3.5" />Matola A</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">As compras do bairro, entregues à sua porta.</h1>
          <p className="mt-3 opacity-90">Escolha uma loja perto de si, junte os produtos e receba em casa.</p>
          <form
            className="mt-6 flex gap-2 rounded-full bg-card p-1.5"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/lojas", search: { q } }); }}
          >
            <Search className="ml-3 h-5 w-5 shrink-0 self-center text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Procurar arroz, pão, óleo…" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none" />
            <button className="btn btn-accent">Procurar</button>
          </form>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: MapPin, t: "Lojas do bairro", d: "Mercearias e cantinas de confiança." },
          { icon: Clock, t: "Poucos passos", d: "Escolha, confirme e acompanhe." },
          { icon: Truck, t: "Entrega própria", d: "Estafetas da nossa rede em Matola A." },
        ].map((f) => (
          <div key={f.t} className="card flex items-start gap-3 p-4">
            <f.icon className="h-6 w-6 shrink-0 text-primary" />
            <div><p className="font-semibold">{f.t}</p><p className="text-sm text-muted-foreground">{f.d}</p></div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Lojas perto de si</h2>
          <Link to="/lojas" className="text-sm font-semibold text-primary">Ver todas</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => <StoreCard key={s.id} store={s} />)}
        </div>
      </section>
    </div>
  );
}
