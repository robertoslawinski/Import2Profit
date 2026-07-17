import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import { formatCurrency, formatPercent } from "../utils/calculations.js";
import { exportCsv } from "../utils/exportCsv.js";
import styles from "./Page.module.css";

export default function Reports() {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    apiRequest("/reports").then(setReports).catch(console.error);
  }, []);

  return (
    <div className={styles.stack}>
      <div className={styles.cards}>
        <section className={styles.metricPanel}><span>Custos de importação</span><strong>{formatCurrency(reports?.totalImportCosts)}</strong></section>
        <section className={styles.metricPanel}><span>Custos de envio</span><strong>{formatCurrency(reports?.totalShippingCosts)}</strong></section>
        <section className={styles.metricPanel}><span>Produtos com margem negativa</span><strong>{reports?.productsWithNegativeMargin?.length || 0}</strong></section>
      </div>
      <ReportSection title="Lucro mensal" rows={reports?.monthlyProfit || []} onExport={() => exportCsv("lucro-mensal.csv", reports?.monthlyProfit || [])} columns={[{ key: "name", label: "Mês" }, { key: "value", label: "Lucro", render: (row) => formatCurrency(row.value) }]} />
      <ReportSection title="Vendas por marketplace" rows={reports?.salesByMarketplace || []} columns={[{ key: "name", label: "Marketplace" }, { key: "value", label: "Vendas", render: (row) => formatCurrency(row.value) }]} />
      <ReportSection title="Produtos mais lucrativos" rows={reports?.mostProfitableProducts || []} columns={[{ key: "name", label: "Produto" }, { key: "category", label: "Categoria" }, { key: "realProfit", label: "Lucro real", render: (row) => formatCurrency(row.realProfit, row.currency) }, { key: "roi", label: "ROI", render: (row) => formatPercent(row.roi) }]} />
      <ReportSection title="Envelhecimento de stock" rows={reports?.stockAging || []} columns={[{ key: "name", label: "Produto" }, { key: "sku", label: "SKU" }, { key: "daysInStock", label: "Dias em stock" }, { key: "margin", label: "Margem", render: (row) => formatPercent(row.margin) }]} />
    </div>
  );
}

function ReportSection({ title, rows, columns, onExport }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>{title}</h2>
        <button onClick={onExport || (() => exportCsv(`${title}.csv`, rows))}><Download size={18} /> Exportar</button>
      </div>
      <DataTable rows={rows} columns={columns} />
    </section>
  );
}
