import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatCurrency } from "../utils/calculations.js";
import styles from "./Page.module.css";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product: "", marketplace: "Vinted", salePrice: 0, marketplaceFee: 0, shippingChargedToBuyer: 0, shippingPaidBySeller: 0, paymentStatus: "pending", orderStatus: "processing" });

  async function load() {
    const [saleData, productData] = await Promise.all([apiRequest("/sales"), apiRequest("/products")]);
    setSales(saleData);
    setProducts(productData);
    if (!form.product && productData[0]) setForm((current) => ({ ...current, product: productData[0]._id }));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function submit(event) {
    event.preventDefault();
    await apiRequest("/sales", { method: "POST", body: JSON.stringify(form) });
    await load();
  }

  return (
    <div className={styles.stack}>
      <form className={styles.inlineForm} onSubmit={submit}>
        <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>{products.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}</select>
        <select value={form.marketplace} onChange={(e) => setForm({ ...form, marketplace: e.target.value })}><option>Vinted</option><option>eBay</option><option>Amazon Seller</option><option>Wallapop</option><option>OLX</option><option>Other</option></select>
        <input type="number" step="0.01" placeholder="Preço venda" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
        <input type="number" step="0.01" placeholder="Comissão" value={form.marketplaceFee} onChange={(e) => setForm({ ...form, marketplaceFee: e.target.value })} />
        <input type="number" step="0.01" placeholder="Envio pago" value={form.shippingPaidBySeller} onChange={(e) => setForm({ ...form, shippingPaidBySeller: e.target.value })} />
        <button>Registar venda</button>
      </form>
      <DataTable
        rows={sales}
        columns={[
          { key: "product", label: "Produto", render: (row) => row.product?.name },
          { key: "marketplace", label: "Marketplace" },
          { key: "saleDate", label: "Data", render: (row) => new Date(row.saleDate).toLocaleDateString("pt-PT") },
          { key: "salePrice", label: "Venda", render: (row) => formatCurrency(row.salePrice) },
          { key: "netProfit", label: "Lucro líquido", render: (row) => formatCurrency(row.netProfit) },
          { key: "paymentStatus", label: "Pagamento", render: (row) => <StatusBadge value={row.paymentStatus} /> }
        ]}
      />
    </div>
  );
}
