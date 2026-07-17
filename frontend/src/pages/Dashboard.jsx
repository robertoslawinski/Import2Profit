import { Boxes, ChartNoAxesCombined, CircleDollarSign, PackageCheck, ShoppingCart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import { formatCurrency, formatPercent } from "../utils/calculations.js";
import styles from "./Page.module.css";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    apiRequest("/dashboard").then(setDashboard).catch(console.error);
  }, []);

  const counts = dashboard?.statusCounts || {};
  const rows = dashboard?.monthlyProfitSummary || [];

  return (
    <div className={styles.stack}>
      <div className={styles.cards}>
        <SummaryCard icon={CircleDollarSign} label="Total investido" value={formatCurrency(dashboard?.totalInvested)} />
        <SummaryCard icon={Boxes} label="Valor em stock" value={formatCurrency(dashboard?.totalStockValue)} />
        <SummaryCard icon={ShoppingCart} label="Total de vendas" value={formatCurrency(dashboard?.totalSales)} />
        <SummaryCard icon={TrendingUp} label="Lucro líquido" value={formatCurrency(dashboard?.netProfit)} tone={dashboard?.netProfit < 0 ? "danger" : "success"} />
        <SummaryCard icon={ChartNoAxesCombined} label="Margem média" value={formatPercent(dashboard?.averageProfitMargin)} />
        <SummaryCard icon={PackageCheck} label="Melhor marketplace" value={dashboard?.bestPerformingMarketplace || "Sem vendas"} />
      </div>
      <section className={styles.panel}>
        <h2>Estado dos produtos</h2>
        <div className={styles.statusGrid}>
          <span>Encomendados <strong>{counts.ordered || 0}</strong></span>
          <span>Recebidos <strong>{counts.received || 0}</strong></span>
          <span>Publicados <strong>{counts.listed || 0}</strong></span>
          <span>Vendidos <strong>{counts.sold || 0}</strong></span>
          <span>Devolvidos <strong>{counts.returned || 0}</strong></span>
        </div>
      </section>
      <section className={styles.panel}>
        <h2>Resumo mensal de lucro</h2>
        <DataTable columns={[{ key: "month", label: "Mês" }, { key: "profit", label: "Lucro", render: (row) => formatCurrency(row.profit) }]} rows={rows} />
      </section>
    </div>
  );
}
