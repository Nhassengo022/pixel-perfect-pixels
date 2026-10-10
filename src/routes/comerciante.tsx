import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/comerciante")({
  head: () => ({
    meta: [
      { title: "Painel Comerciante — Pertinho Matola" },
      { name: "description", content: "Painel Comerciante da plataforma Pertinho Matola." },
      { property: "og:title", content: "Painel Comerciante — Pertinho Matola" },
      { property: "og:description", content: "Painel Comerciante da plataforma Pertinho Matola." },
    ],
  }),
  component: () => (
    <div>
      <PageTitle title="Painel Comerciante" />
      <Empty>Este painel ainda está em construção.</Empty>
    </div>
  ),
});
