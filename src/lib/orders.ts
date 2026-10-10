export type OrderStatus =
  | "recebida" | "aceite" | "rejeitada" | "em_preparacao" | "pronta"
  | "recolhida" | "entregue" | "cancelada";

export type PaymentStatus = "pendente" | "aguarda_verificacao" | "confirmado" | "falhado" | "reembolsado";
export type PaymentMethod = "mpesa" | "emola" | "dinheiro";

export type OrderItem = { productId: string; name: string; unit: string; price: number; qty: number };

export type Order = {
  id: string;
  storeId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  commission: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef?: string | undefined;
  address: string;
  notes?: string | undefined;
  courierId?: string;
  incident?: string;
  createdAt: string;
  history: { status: OrderStatus; at: string }[];
};

export const orderStatusLabel: Record<OrderStatus, string> = {
  recebida: "Recebida",
  aceite: "Aceite pela loja",
  rejeitada: "Rejeitada",
  em_preparacao: "Em preparação",
  pronta: "Pronta para recolha",
  recolhida: "A caminho",
  entregue: "Entregue",
  cancelada: "Cancelada",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pendente: "Pagamento pendente",
  aguarda_verificacao: "A aguardar verificação",
  confirmado: "Pagamento confirmado",
  falhado: "Pagamento falhado",
  reembolsado: "Reembolsado",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  mpesa: "M-Pesa",
  emola: "e-Mola",
  dinheiro: "Dinheiro na entrega",
};

export const trackingSteps: OrderStatus[] = ["recebida", "aceite", "em_preparacao", "pronta", "recolhida", "entregue"];

export type Tone = "neutral" | "info" | "warning" | "success" | "danger";
export const orderTone = (s: OrderStatus): Tone =>
  s === "entregue" ? "success" : s === "rejeitada" || s === "cancelada" ? "danger" : s === "recebida" ? "warning" : "info";
export const paymentTone = (s: PaymentStatus): Tone =>
  s === "confirmado" ? "success" : s === "falhado" ? "danger" : s === "reembolsado" ? "neutral" : "warning";
