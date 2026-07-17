import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatCurrency } from "../utils/calculations.js";
import styles from "./Page.module.css";

export default function ImportOrders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ orderNumber: "", supplierOrAgent: "", countryOfOrigin: "", totalShippingCost: 0, customsTaxCost: 0, status: "preparing" });

  async function load() {
    setOrders(await apiRequest("/import-orders"));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function submit(event) {
    event.preventDefault();
    await apiRequest("/import-orders", { method: "POST", body: JSON.stringify(form) });
    setForm({ ...form, orderNumber: "" });
    await load();
  }

  return (
    <div className={styles.stack}>
      <form className={styles.inlineForm} onSubmit={submit}>
        <input required placeholder="Número da encomenda" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} />
        <input placeholder="Fornecedor ou agente" value={form.supplierOrAgent} onChange={(e) => setForm({ ...form, supplierOrAgent: e.target.value })} />
        <input placeholder="País de origem" value={form.countryOfOrigin} onChange={(e) => setForm({ ...form, countryOfOrigin: e.target.value })} />
        <input type="number" step="0.01" placeholder="Envio total" value={form.totalShippingCost} onChange={(e) => setForm({ ...form, totalShippingCost: e.target.value })} />
        <input type="number" step="0.01" placeholder="Alfândega/taxas" value={form.customsTaxCost} onChange={(e) => setForm({ ...form, customsTaxCost: e.target.value })} />
        <button>Criar</button>
      </form>
      <DataTable
        rows={orders}
        columns={[
          { key: "orderNumber", label: "Encomenda" },
          { key: "supplierOrAgent", label: "Fornecedor/agente" },
          { key: "countryOfOrigin", label: "Origem" },
          { key: "totalShippingCost", label: "Envio", render: (row) => formatCurrency(row.totalShippingCost) },
          { key: "customsTaxCost", label: "Taxas", render: (row) => formatCurrency(row.customsTaxCost) },
          { key: "status", label: "Estado", render: (row) => <StatusBadge value={row.status} /> }
        ]}
      />
    </div>
  );
}
