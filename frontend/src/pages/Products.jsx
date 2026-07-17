import { Download, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import ProductForm from "../components/ProductForm.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { exportCsv } from "../utils/exportCsv.js";
import { formatCurrency, formatPercent } from "../utils/calculations.js";
import styles from "./Page.module.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  async function loadProducts() {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    setProducts(await apiRequest(`/products${query}`));
  }

  useEffect(() => {
    loadProducts().catch(console.error);
  }, []);

  async function saveProduct(product) {
    await apiRequest("/products", { method: "POST", body: JSON.stringify(product) });
    setShowForm(false);
    await loadProducts();
  }

  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <div className={styles.search}><Search size={18} /><input placeholder="Pesquisar por nome, SKU ou fornecedor" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadProducts()} /></div>
        <button onClick={loadProducts}>Filtrar</button>
        <button onClick={() => exportCsv("produtos.csv", products)}><Download size={18} /> CSV</button>
        <button className={styles.primary} onClick={() => setShowForm((value) => !value)}><Plus size={18} /> Produto</button>
      </div>
      {showForm ? <ProductForm onSave={saveProduct} /> : null}
      <DataTable
        rows={products}
        columns={[
          { key: "name", label: "Produto", render: (row) => <Link to={`/products/${row._id}`}>{row.name}</Link> },
          { key: "sku", label: "SKU" },
          { key: "supplier", label: "Fornecedor" },
          { key: "status", label: "Estado", render: (row) => <StatusBadge value={row.status} /> },
          { key: "totalCost", label: "Custo total", render: (row) => formatCurrency(row.totalCost, row.currency) },
          { key: "listingPrice", label: "Preço", render: (row) => formatCurrency(row.listingPrice, row.currency) },
          { key: "profitMarginPercentage", label: "Margem", render: (row) => <span className={row.profitMarginPercentage < 15 ? styles.alertText : ""}>{formatPercent(row.profitMarginPercentage)}</span> }
        ]}
      />
    </div>
  );
}
