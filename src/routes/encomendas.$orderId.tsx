import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { couriers, stores } from "@/data/demo";
import { useApp } from "@/lib/app-state";
import { formatMT } from "@/lib/pricing";
import { orderStatusLabel, orderTone, paymentMethodLabel, paymentStatusLabel, paymentTone, trackingSteps } from "@/lib/orders";
import { Badge, Empty, PageTitle, TotalsBox } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/encomendas/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Encomenda ${params.orderId} — Pertinho Matola` },
      { name: "description", content: "Acompanhe o estado da sua encomenda." },
      { property: "og:title", content: "Acompanhar encomenda — Pertinho Matola" },
      { property: "og:description", content: "Acompanhe o estado da sua encomenda." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { orderId } = Route.useParams();
  const { orders, setOrderStatus } = useApp();
  const o = orders.find((x) => x.id === orderId);
  if (!o) return <Empty>Encomenda não encontrada. <Link to="/encomendas" className="font-semibold text-primary">Ver encomendas</Link></Empty>;
  const store = stores.find((s) => s.id === o.storeId)!;
  const courier = couriers.find((c) => c.id === o.courierId);
  const stopped = o.status === "rejeitada" || o.status === "cancelada";
  const idx = trackingSteps.indexOf(o.status);

  return (
    <div>
      <PageTitle title={`Encomenda ${o.id}`} subtitle={store.name} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge tone={orderTone(o.status)}>{orderStatusLabel[o.status]}</Badge>
              <Badge tone={paymentTone(o.paymentStatus)}>{paymentStatusLabel[o.paymentStatus]}</Badge>
            </div>
            {stopped ? (
              <p className="text-sm text-destructive">Esta encomenda foi {o.status === "rejeitada" ? "rejeitada pela loja" : "cancelada"}.</p>
            ) : (
              <ol className="space-y-3">
                {trackingSteps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-bold", i <= idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      {i <= idx ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className={cn("text-sm", i === idx && "font-semibold")}>{orderStatusLabel[s]}</span>
                  </li>
                ))}
              </ol>
            )}
            {courier && <p className="mt-4 text-sm">Estafeta: <strong>{courier.name}</strong> · {courier.phone}</p>}
            {o.status === "recebida" && (
              <button className="btn btn-outline mt-4" onClick={() => setOrderStatus(o.id, "cancelada")}>Cancelar encomenda</button>
            )}
            <p className="mt-4 text-xs text-muted-foreground">Para simular o avanço, use os painéis de Comerciante, Estafeta e Admin no topo.</p>
          </section>
          <section className="card divide-y divide-border">
            {o.items.map((i) => (
              <div key={i.productId} className="flex justify-between gap-3 p-3 text-sm">
                <span>{i.qty} × {i.name} <span className="text-muted-foreground">({i.unit})</span></span>
                <span>{formatMT(i.price * i.qty)}</span>
              </div>
            ))}
          </section>
        </div>
        <aside className="card h-fit space-y-4 p-5 text-sm">
          <TotalsBox subtotal={o.subtotal} deliveryFee={o.deliveryFee} total={o.total} />
          <div><p className="text-muted-foreground">Pagamento</p><p className="font-medium">{paymentMethodLabel[o.paymentMethod]}{o.paymentRef && ` · ref. ${o.paymentRef}`}</p></div>
          <div><p className="text-muted-foreground">Entrega</p><p className="font-medium">{o.address}</p></div>
          {o.notes && <div><p className="text-muted-foreground">Observações</p><p>{o.notes}</p></div>}
        </aside>
      </div>
    </div>
  );
}
