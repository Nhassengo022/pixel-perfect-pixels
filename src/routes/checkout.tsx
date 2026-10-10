import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import { demoCustomer, stores } from "@/data/demo";
import { useApp } from "@/lib/app-state";
import { computeTotals } from "@/lib/pricing";
import { paymentMethodLabel, type PaymentMethod } from "@/lib/orders";
import { Empty, PageTitle, TotalsBox } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar encomenda — Pertinho Matola" },
      { name: "description", content: "Escolha a morada de entrega e o método de pagamento." },
      { property: "og:title", content: "Finalizar encomenda — Pertinho Matola" },
      { property: "og:description", content: "Escolha a morada de entrega e o método de pagamento." },
    ],
  }),
  component: Checkout,
});

const methods: { id: PaymentMethod; hint: string }[] = [
  { id: "mpesa", hint: "Envie o valor e indique a referência da transacção." },
  { id: "emola", hint: "Envie o valor e indique a referência da transacção." },
  { id: "dinheiro", hint: "Paga ao estafeta no momento da entrega." },
];

function Checkout() {
  const { cart, products, settings, placeOrder } = useApp();
  const navigate = useNavigate();
  const [addressId, setAddressId] = useState(demoCustomer.addresses[0].id);
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("dinheiro");
  const [ref, setRef] = useState("");

  const store = stores.find((s) => s.id === cart.storeId);
  const lines = Object.entries(cart.items).map(([id, qty]) => ({ price: products.find((p) => p.id === id)!.price, qty }));
  const t = computeTotals(lines, settings);
  if (!store || !lines.length) return <Empty>Não há nada para finalizar. <Link to="/lojas" className="font-semibold text-primary">Ver lojas</Link></Empty>;
  if (!t.meetsMinimum) return <Empty>A encomenda ainda não atinge o valor mínimo. <Link to="/carrinho" className="font-semibold text-primary">Voltar ao carrinho</Link></Empty>;

  const needsRef = method !== "dinheiro";
  const submit = () => {
    const a = demoCustomer.addresses.find((x) => x.id === addressId)!;
    const order = placeOrder({ address: `${a.line} (${a.ref})`, notes, paymentMethod: method, paymentRef: needsRef ? ref : undefined });
    navigate({ to: "/encomendas/$orderId", params: { orderId: order.id } });
  };

  return (
    <div>
      <PageTitle title="Finalizar encomenda" subtitle={store.name} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-3 font-bold">1. Morada de entrega</h2>
            {demoCustomer.addresses.map((a) => (
              <label key={a.id} className={cn("flex cursor-pointer gap-3 rounded-xl border p-3", addressId === a.id ? "border-primary bg-secondary" : "border-border")}>
                <input type="radio" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1 accent-[var(--color-primary)]" />
                <span><span className="font-semibold">{a.label}</span><span className="block text-sm text-muted-foreground">{a.line} · {a.ref}</span></span>
              </label>
            ))}
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações para a loja ou estafeta (opcional)" className="field mt-3" rows={2} />
          </section>

          <section className="card p-5">
            <h2 className="mb-3 font-bold">2. Método de pagamento</h2>
            <div className="space-y-2">
              {methods.map((m) => (
                <label key={m.id} className={cn("flex cursor-pointer gap-3 rounded-xl border p-3", method === m.id ? "border-primary bg-secondary" : "border-border")}>
                  <input type="radio" checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-1 accent-[var(--color-primary)]" />
                  <span><span className="font-semibold">{paymentMethodLabel[m.id]}</span><span className="block text-sm text-muted-foreground">{m.hint}</span></span>
                </label>
              ))}
            </div>
            {needsRef && (
              <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Referência da transacção" className="field mt-3" />
            )}
            <p className="mt-3 flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0" />
              Demonstração: nenhum pagamento real é processado. Pagamentos por carteira móvel ficam “a aguardar verificação” até serem confirmados pela equipa.
            </p>
          </section>
        </div>
        <aside className="card h-fit space-y-4 p-5">
          <TotalsBox {...t} />
          <button disabled={needsRef && ref.trim().length < 4} onClick={submit} className="btn btn-primary w-full">Confirmar encomenda</button>
        </aside>
      </div>
    </div>
  );
}
