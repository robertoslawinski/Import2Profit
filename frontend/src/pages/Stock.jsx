import { AlertTriangle, Clock, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import { formatCurrency, formatPercent } from "../utils/calculations.js";
import { exportCsv } from "../utils/exportCsv.js";
import styles from "./Page.module.css";

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", brand: "", status: "", marketplace: "", size: "" });

  useEffect(() => {
    apiRequest("/products").then(setProducts).catch(console.error);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return Object.entries(filters).every(([key, value]) => !value || product[key === "marketplace" ? "listedMarketplace" : key] === value);
    });
  }, [products, filters]);

  const stockProducts = filteredProducts.filter((product) => product.status !== "sold");
  const lowMarginProducts = stockProducts.filter((product) => product.profitMarginPercentage < 15);
  const stoppedProducts = stockProducts.filter((product) => (Date.now() - new Date(product.createdAt).getTime()) / 86400000 > 60);
  const stockValue = stockProducts.reduce((sum, product) => sum + product.totalCost, 0);

  async function markStatus(product, status) {
    const saved = await apiRequest(`/products/${product._id}`, { method: "PUT", body: JSON.stringify({ ...product, status }) });
    setProducts((current) => current.map((item) => (item._id === saved._id ? saved : item)));
  }

  return (
    <div className={styles.stack}>
      <div className={styles.cards}>
        <SummaryCard icon={Download} label="Valor em stock" value={formatCurrency(stockValue)} />
        <SummaryCard icon={AlertTriangle} label="Margem baixa" value={lowMarginProducts.length} tone="warning" />
        <SummaryCard icon={Clock} label="Parados há mais de 60 dias" value={stoppedProducts.length} tone="danger" />
      </div>
      <div className={styles.toolbar}>
        {["category", "brand", "size"].map((key) => (
          <input key={key} placeholder={{ category: "Categoria", brand: "Marca", size: "Tamanho" }[key]} value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })} />
        ))}
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">Todos os estados</option><option value="received">Recebido</option><option value="listed">Publicado</option><option value="returned">Devolvido</option><option value="lost">Perdido</option></select>
        <select value={filters.marketplace} onChange={(e) => setFilters({ ...filters, marketplace: e.target.value })}><option value="">Todos os marketplaces</option><option>Vinted</option><option>eBay</option><option>Amazon Seller</option><option>Wallapop</option><option>OLX</option><option>Other</option></select>
        <button onClick={() => exportCsv("stock.csv", filteredProducts)}>CSV</button>
      </div>
      <DataTable
        rows={filteredProducts}
        columns={[
          { key: "name", label: "Produto" },
          { key: "category", label: "Categoria" },
          { key: "size", label: "Tamanho" },
          { key: "brand", label: "Marca" },
          { key: "listedMarketplace", label: "Marketplace" },
          { key: "status", label: "Estado", render: (row) => <StatusBadge value={row.status} /> },
          { key: "profitMarginPercentage", label: "Margem", render: (row) => formatPercent(row.profitMarginPercentage) },
          { key: "actions", label: "Ações", render: (row) => <div className={styles.tableActions}><button onClick={() => markStatus(row, "sold")}>Vendido</button><button onClick={() => markStatus(row, "returned")}>Devolvido</button><button onClick={() => markStatus(row, "lost")}>Perdido</button></div> }
        ]}
      />
    </div>
  );
}
