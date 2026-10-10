import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/estafeta")({
  head: () => ({
    meta: [
      { title: "Painel Estafeta — Pertinho Matola" },
      { name: "description", content: "Painel Estafeta da plataforma Pertinho Matola." },
      { property: "og:title", content: "Painel Estafeta — Pertinho Matola" },
      { property: "og:description", content: "Painel Estafeta da plataforma Pertinho Matola." },
    ],
  }),
  component: () => (
    <div>
      <PageTitle title="Painel Estafeta" />
      <Empty>Este painel ainda está em construção.</Empty>
    </div>
  ),
});
