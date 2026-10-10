import { toast } from "sonner";
import type { Product } from "@/data/demo";
import { useApp } from "@/lib/app-state";
import { formatMT } from "@/lib/pricing";
import { Stepper } from "./ui-bits";

export function ProductCard({ product, storeOpen }: { product: Product; storeOpen: boolean }) {
  const { cart, addToCart, setQty } = useApp();
  const qty = cart.items[product.id] ?? 0;
  const out = product.stock <= 0;

  const add = () => {
    if (!addToCart(product)) toast.error("O carrinho já tem produtos de outra loja. Cada encomenda pertence a uma só loja.");
  };

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="grid aspect-[4/3] place-items-center bg-secondary text-5xl" aria-hidden>{product.emoji}</div>
      <div className="flex flex-1 flex-col p-3">
        <p className="font-semibold leading-tight">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.unit}</p>
        <p className="mt-2 font-display text-lg font-bold text-primary">{formatMT(product.price)}</p>
        <div className="mt-auto pt-3">
          {out ? (
            <p className="text-xs font-semibold text-destructive">Esgotado</p>
          ) : qty > 0 ? (
            <Stepper value={qty} max={product.stock} onChange={(v) => setQty(product.id, v)} />
          ) : (
            <button disabled={!storeOpen} className="btn btn-primary w-full py-2" onClick={add}>Adicionar</button>
          )}
        </div>
      </div>
    </div>
  );
}
