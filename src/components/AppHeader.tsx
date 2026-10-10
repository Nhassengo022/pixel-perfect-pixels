import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBasket, Store, Bike, ShieldCheck, User } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const roles = [
  { to: "/", label: "Cliente", icon: User, match: (p: string) => !/^\/(comerciante|estafeta|admin)/.test(p) },
  { to: "/comerciante", label: "Comerciante", icon: Store, match: (p: string) => p.startsWith("/comerciante") },
  { to: "/estafeta", label: "Estafeta", icon: Bike, match: (p: string) => p.startsWith("/estafeta") },
  { to: "/admin", label: "Admin", icon: ShieldCheck, match: (p: string) => p.startsWith("/admin") },
] as const;

export function AppHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { cart } = useApp();
  const count = Object.values(cart.items).reduce((a, b) => a + b, 0);
  const isClient = roles[0].match(path);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-1.5 text-xs">
          <span className="mr-2 shrink-0 opacity-80">Demonstração · ver como:</span>
          {roles.map((r) => (
            <Link key={r.to} to={r.to} className={cn("flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1", r.match(path) ? "bg-primary-foreground text-primary font-semibold" : "hover:bg-primary-foreground/15")}>
              <r.icon className="h-3.5 w-3.5" />{r.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><ShoppingBasket className="h-5 w-5" /></span>
          <span className="truncate font-display text-lg font-bold">Pertinho<span className="text-primary"> Matola</span></span>
        </Link>
        {isClient && (
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link to="/lojas" className="hidden rounded-full px-3 py-2 hover:bg-muted sm:block" activeProps={{ className: "text-primary" }}>Lojas</Link>
            <Link to="/encomendas" className="hidden rounded-full px-3 py-2 hover:bg-muted sm:block" activeProps={{ className: "text-primary" }}>Encomendas</Link>
            <Link to="/perfil" className="rounded-full p-2 hover:bg-muted" aria-label="Perfil"><User className="h-5 w-5" /></Link>
            <Link to="/carrinho" className="btn btn-primary relative py-2" aria-label="Carrinho">
              <ShoppingBasket className="h-4 w-4" /><span className="hidden sm:inline">Carrinho</span>
              {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-accent-foreground">{count}</span>}
            </Link>
          </nav>
        )}
      </div>
      {isClient && (
        <nav className="flex justify-around border-t border-border text-xs font-medium sm:hidden">
          <Link to="/lojas" className="flex-1 py-2 text-center" activeProps={{ className: "text-primary" }}>Lojas</Link>
          <Link to="/encomendas" className="flex-1 py-2 text-center" activeProps={{ className: "text-primary" }}>Encomendas</Link>
        </nav>
      )}
    </header>
  );
}
