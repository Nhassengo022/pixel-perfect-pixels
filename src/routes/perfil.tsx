import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { demoCustomer } from "@/data/demo";
import { PageTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "O meu perfil — Pertinho Matola" },
      { name: "description", content: "Dados pessoais e moradas de entrega." },
      { property: "og:title", content: "O meu perfil — Pertinho Matola" },
      { property: "og:description", content: "Dados pessoais e moradas de entrega." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <div className="max-w-2xl">
      <PageTitle title="O meu perfil" subtitle="Dados de demonstração" />
      <section className="card mb-6 space-y-3 p-5">
        <label className="block text-sm">Nome<input className="field mt-1" defaultValue={demoCustomer.name} /></label>
        <label className="block text-sm">Telemóvel<input className="field mt-1" defaultValue={demoCustomer.phone} /></label>
      </section>
      <h2 className="mb-3 font-bold">Moradas de entrega</h2>
      <ul className="space-y-3">
        {demoCustomer.addresses.map((a) => (
          <li key={a.id} className="card flex gap-3 p-4">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <div><p className="font-semibold">{a.label}</p><p className="text-sm text-muted-foreground">{a.line} · {a.ref}</p></div>
          </li>
        ))}
      </ul>
      <button className="btn btn-outline mt-4" disabled>Adicionar morada (disponível com contas de utilizador)</button>
    </div>
  );
}
