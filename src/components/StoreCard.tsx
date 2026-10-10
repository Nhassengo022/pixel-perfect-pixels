import { Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import type { Store } from "@/data/demo";
import { Badge } from "./ui-bits";

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link to="/lojas/$storeId" params={{ storeId: store.id }} className="card group block overflow-hidden transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={store.image} alt={store.name} loading="lazy" width={1024} height={640} className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3"><Badge tone={store.open ? "success" : "danger"}>{store.open ? "Aberta" : "Fechada"}</Badge></div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{store.type}</p>
        <h3 className="mt-0.5 truncate text-lg font-bold">{store.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{store.area}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{store.eta}</span>
        </div>
      </div>
    </Link>
  );
}
