import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest, getAssetUrl } from "../api/client.js";
import ProductForm from "../components/ProductForm.jsx";
import { formatCurrency, formatPercent } from "../utils/calculations.js";
import styles from "./Page.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    apiRequest(`/products/${id}`).then(setProduct).catch(console.error);
  }, [id]);

  async function updateProduct(payload) {
    const saved = await apiRequest(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    setProduct(saved);
  }

  if (!product) return <p>A carregar produto...</p>;

  return (
    <div className={styles.stack}>
      <section className={styles.detailHeader}>
        {product.imageUrl ? <img src={getAssetUrl(product.imageUrl)} alt={product.name} /> : <div className={styles.placeholder}>Sem imagem</div>}
        <div>
          <h2>{product.name}</h2>
          <p>{product.sku} · {product.supplier || "Sem fornecedor"}</p>
          <div className={styles.statusGrid}>
            <span>Custo total <strong>{formatCurrency(product.totalCost, product.currency)}</strong></span>
            <span>Lucro real <strong>{formatCurrency(product.realProfit, product.currency)}</strong></span>
            <span>Margem <strong>{formatPercent(product.profitMarginPercentage)}</strong></span>
            <span>ROI <strong>{formatPercent(product.roi)}</strong></span>
          </div>
        </div>
        <button onClick={() => navigate("/products")}>Voltar</button>
      </section>
      <ProductForm initialProduct={product} onSave={updateProduct} />
    </div>
  );
}
