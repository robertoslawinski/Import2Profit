import styles from "./StatusBadge.module.css";

const labels = {
  ordered: "Encomendado",
  in_transit: "Em trânsito",
  received: "Recebido",
  listed: "Publicado",
  sold: "Vendido",
  returned: "Devolvido",
  lost: "Perdido",
  preparing: "A preparar",
  shipped: "Enviado",
  in_customs: "Na alfândega",
  delivered: "Entregue",
  partially_received: "Parcialmente recebido",
  pending: "Pendente",
  paid: "Pago",
  refunded: "Reembolsado"
};

export default function StatusBadge({ value }) {
  return <span className={`${styles.badge} ${styles[value] || ""}`}>{labels[value] || value || "Sem estado"}</span>;
}
