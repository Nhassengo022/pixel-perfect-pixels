import loja1 from "@/assets/loja-1.jpg";
import loja2 from "@/assets/loja-2.jpg";
import loja3 from "@/assets/loja-3.jpg";

export type Store = {
  id: string;
  name: string;
  type: string;
  area: string;
  image: string;
  eta: string;
  open: boolean;
  phone: string;
};

export type Product = {
  id: string;
  storeId: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  category: string;
  emoji: string;
};

export type Courier = { id: string; name: string; phone: string; active: boolean };

export const stores: Store[] = [
  { id: "s1", name: "Mercearia Boa Esperança", type: "Mercearia", area: "Matola A, Rua 1", image: loja1, eta: "30–45 min", open: true, phone: "84 000 0001" },
  { id: "s2", name: "Cantina da Dona Albertina", type: "Cantina", area: "Matola A, perto do mercado", image: loja2, eta: "25–40 min", open: true, phone: "84 000 0002" },
  { id: "s3", name: "Frutas & Verduras Matola", type: "Frutaria", area: "Matola A, Av. principal", image: loja3, eta: "35–50 min", open: false, phone: "84 000 0003" },
];

const p = (id: string, storeId: string, name: string, unit: string, price: number, stock: number, category: string, emoji: string): Product =>
  ({ id, storeId, name, unit, price, stock, category, emoji });

export const products: Product[] = [
  p("p1", "s1", "Arroz", "saco 5 kg", 450, 20, "Mercearia", "🍚"),
  p("p2", "s1", "Óleo de cozinha", "garrafa 2 L", 320, 15, "Mercearia", "🫗"),
  p("p3", "s1", "Açúcar castanho", "pacote 1 kg", 95, 30, "Mercearia", "🧂"),
  p("p4", "s1", "Farinha de milho", "saco 5 kg", 280, 12, "Mercearia", "🌽"),
  p("p5", "s1", "Feijão manteiga", "pacote 1 kg", 160, 18, "Mercearia", "🫘"),
  p("p6", "s1", "Refrigerante", "lata 330 ml", 45, 48, "Bebidas", "🥤"),
  p("p7", "s1", "Água mineral", "garrafa 1,5 L", 50, 40, "Bebidas", "💧"),
  p("p8", "s1", "Sabão em barra", "unidade", 60, 0, "Limpeza", "🧼"),
  p("p9", "s2", "Pão", "unidade", 10, 100, "Padaria", "🥖"),
  p("p10", "s2", "Ovos", "dúzia", 180, 25, "Frescos", "🥚"),
  p("p11", "s2", "Tomate", "1 kg", 90, 20, "Frescos", "🍅"),
  p("p12", "s2", "Cebola", "1 kg", 80, 22, "Frescos", "🧅"),
  p("p13", "s2", "Atum em lata", "lata 170 g", 120, 30, "Mercearia", "🐟"),
  p("p14", "s2", "Leite", "pacote 1 L", 95, 24, "Frescos", "🥛"),
  p("p15", "s3", "Banana", "cacho", 120, 15, "Fruta", "🍌"),
  p("p16", "s3", "Manga", "1 kg", 100, 20, "Fruta", "🥭"),
  p("p17", "s3", "Couve", "unidade", 60, 18, "Verduras", "🥬"),
  p("p18", "s3", "Coco", "unidade", 50, 25, "Fruta", "🥥"),
];

export const couriers: Courier[] = [
  { id: "c1", name: "Edson Mabunda", phone: "84 111 2222", active: true },
  { id: "c2", name: "Célia Nhantumbo", phone: "86 333 4444", active: true },
];

export const demoCustomer = {
  name: "Ana Cossa",
  phone: "84 555 6666",
  addresses: [
    { id: "a1", label: "Casa", line: "Matola A, Rua 4, casa n.º 12", ref: "Portão verde, perto da escola" },
  ],
};
