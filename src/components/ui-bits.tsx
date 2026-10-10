import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/orders";
import { formatMT } from "@/lib/pricing";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/15 text-info",
  warning: "bg-warning/20 text-accent-foreground",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/12 text-destructive",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", toneClass[tone])}>{children}</span>;
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stepper({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
      <button aria-label="Diminuir" className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted" onClick={() => onChange(value - 1)}><Minus className="h-4 w-4" /></button>
      <span className="w-6 text-center text-sm font-semibold">{value}</span>
      <button aria-label="Aumentar" disabled={value >= max} className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted disabled:opacity-40" onClick={() => onChange(value + 1)}><Plus className="h-4 w-4" /></button>
    </div>
  );
}

export function TotalsBox({ subtotal, deliveryFee, total }: { subtotal: number; deliveryFee: number; total: number }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt className="text-muted-foreground">Produtos</dt><dd>{formatMT(subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-muted-foreground">Taxa de entrega</dt><dd>{formatMT(deliveryFee)}</dd></div>
      <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><dt>Total</dt><dd>{formatMT(total)}</dd></div>
    </dl>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="card p-8 text-center text-sm text-muted-foreground">{children}</div>;
}
