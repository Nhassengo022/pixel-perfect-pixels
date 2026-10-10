import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administração — Pertinho Matola" },
      { name: "description", content: "Painel Administração da plataforma Pertinho Matola." },
      { property: "og:title", content: "Painel Administração — Pertinho Matola" },
      { property: "og:description", content: "Painel Administração da plataforma Pertinho Matola." },
    ],
  }),
  component: () => (
    <div>
      <PageTitle title="Painel Administração" />
      <Empty>Este painel ainda está em construção.</Empty>
    </div>
  ),
});
