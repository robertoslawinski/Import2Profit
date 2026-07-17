import { useMemo, useState } from "react";
import { ImagePlus, Save } from "lucide-react";
import { apiRequest } from "../api/client.js";
import { calculateProductMetrics, formatCurrency, formatPercent } from "../utils/calculations.js";
import styles from "./ProductForm.module.css";

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  gender: "unisex",
  size: "",
  color: "",
  supplier: "",
  supplierCountry: "",
  purchaseLink: "",
  imageUrl: "",
  purchaseDate: "",
  status: "ordered",
  acquisitionCost: 0,
  internationalShippingCost: 0,
  customsDuties: 0,
  vatTaxes: 0,
  marketplaceFees: 0,
  packagingCost: 0,
  otherCosts: 0,
  listedMarketplace: "",
  listingPrice: 0,
  finalSellingPrice: 0,
  currency: "EUR",
  conversionRateToEur: 1,
  notes: ""
};

export default function ProductForm({ initialProduct, onSave }) {
  const [product, setProduct] = useState({ ...emptyProduct, ...initialProduct });
  const [saving, setSaving] = useState(false);
  const metrics = useMemo(() => calculateProductMetrics(product), [product]);

  function updateField(field, value) {
    setProduct((current) => ({ ...current, [field]: value }));
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const result = await apiRequest("/products/upload", { method: "POST", body: formData });
    updateField("imageUrl", result.imageUrl);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(product);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <section className={styles.section}>
        <h2>Dados do produto</h2>
        <div className={styles.grid}>
          <label>Nome<input required value={product.name} onChange={(e) => updateField("name", e.target.value)} /></label>
          <label>SKU / código interno<input required value={product.sku} onChange={(e) => updateField("sku", e.target.value)} /></label>
          <label>Categoria<input value={product.category} onChange={(e) => updateField("category", e.target.value)} /></label>
          <label>Marca<input value={product.brand} onChange={(e) => updateField("brand", e.target.value)} /></label>
          <label>Género<select value={product.gender} onChange={(e) => updateField("gender", e.target.value)}><option value="men">Homem</option><option value="women">Mulher</option><option value="kids">Criança</option><option value="unisex">Unissexo</option></select></label>
          <label>Tamanho<input value={product.size} onChange={(e) => updateField("size", e.target.value)} /></label>
          <label>Cor<input value={product.color} onChange={(e) => updateField("color", e.target.value)} /></label>
          <label>Estado<select value={product.status} onChange={(e) => updateField("status", e.target.value)}><option value="ordered">Encomendado</option><option value="in_transit">Em trânsito</option><option value="received">Recebido</option><option value="listed">Publicado</option><option value="sold">Vendido</option><option value="returned">Devolvido</option><option value="lost">Perdido</option></select></label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Fornecedor e compra</h2>
        <div className={styles.grid}>
          <label>Fornecedor<input value={product.supplier} onChange={(e) => updateField("supplier", e.target.value)} /></label>
          <label>País do fornecedor<input value={product.supplierCountry} onChange={(e) => updateField("supplierCountry", e.target.value)} /></label>
          <label>Link de compra<input value={product.purchaseLink} onChange={(e) => updateField("purchaseLink", e.target.value)} /></label>
          <label>Data de compra<input type="date" value={product.purchaseDate?.slice?.(0, 10) || ""} onChange={(e) => updateField("purchaseDate", e.target.value)} /></label>
          <label className={styles.upload}><ImagePlus size={18} /> Imagem<input type="file" accept="image/*" onChange={uploadImage} /></label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Custos e preços</h2>
        <div className={styles.grid}>
          {[
            ["acquisitionCost", "Custo de aquisição"],
            ["internationalShippingCost", "Envio internacional"],
            ["customsDuties", "Direitos alfandegários"],
            ["vatTaxes", "IVA / taxas"],
            ["marketplaceFees", "Comissões marketplace"],
            ["packagingCost", "Embalagem"],
            ["otherCosts", "Outros custos"],
            ["listingPrice", "Preço anunciado"],
            ["finalSellingPrice", "Preço final de venda"],
            ["conversionRateToEur", "Conversão para EUR"]
          ].map(([field, label]) => (
            <label key={field}>{label}<input type="number" step="0.01" value={product[field]} onChange={(e) => updateField(field, e.target.value)} /></label>
          ))}
          <label>Marketplace<select value={product.listedMarketplace} onChange={(e) => updateField("listedMarketplace", e.target.value)}><option value="">Não publicado</option><option>Vinted</option><option>eBay</option><option>Amazon Seller</option><option>Wallapop</option><option>OLX</option><option>Other</option></select></label>
          <label>Moeda<select value={product.currency} onChange={(e) => updateField("currency", e.target.value)}><option>EUR</option><option>USD</option><option>GBP</option><option>CNY</option></select></label>
        </div>
        <div className={styles.metrics}>
          <span>Custo total: <strong>{formatCurrency(metrics.totalCost, product.currency)}</strong></span>
          <span>Lucro estimado: <strong>{formatCurrency(metrics.estimatedProfit, product.currency)}</strong></span>
          <span>Margem: <strong>{formatPercent(metrics.profitMarginPercentage)}</strong></span>
          <span>Preço sugerido: <strong>{formatCurrency(metrics.suggestedResalePrice, product.currency)}</strong></span>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Notas</h2>
        <textarea value={product.notes || ""} onChange={(e) => updateField("notes", e.target.value)} rows="4" />
      </section>

      <button className={styles.save} disabled={saving}><Save size={18} /> {saving ? "A guardar..." : "Guardar produto"}</button>
    </form>
  );
}
