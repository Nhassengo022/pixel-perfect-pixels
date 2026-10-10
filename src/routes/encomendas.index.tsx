import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { stores } from "@/data/demo";
import { useApp } from "@/lib/app-state";
import { formatMT } from "@/lib/pricing";
import { orderStatusLabel, orderTone, paymentStatusLabel, paymentTone } from "@/lib/orders";
import { Badge, Empty, PageTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/encomendas/")({
  head: () => ({
    meta: [
      { title: "As minhas encomendas — Pertinho Matola" },
      { name: "description", content: "Histórico e estado das suas encomendas." },
      { property: "og:title", content: "As minhas encomendas — Pertinho Matola" },
      { property: "og:description", content: "Histórico e estado das suas encomendas." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useApp();
  return (
    <div>
      <PageTitle title="As minhas encomendas" />
      {orders.length === 0 ? <Empty>Ainda não fez nenhuma encomenda.</Empty> : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link to="/encomendas/$orderId" params={{ orderId: o.id }} className="card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 hover:bg-muted">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{stores.find((s) => s.id === o.storeId)?.name}</p>
                  <p className="text-xs text-muted-foreground">{o.id} · {new Date(o.createdAt).toLocaleString("pt-PT")} · {formatMT(o.total)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone={orderTone(o.status)}>{orderStatusLabel[o.status]}</Badge>
                    <Badge tone={paymentTone(o.paymentStatus)}>{paymentStatusLabel[o.paymentStatus]}</Badge>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
