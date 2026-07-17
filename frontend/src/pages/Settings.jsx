import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import styles from "./Page.module.css";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiRequest("/settings").then(setSettings).catch(console.error);
  }, []);

  async function submit(event) {
    event.preventDefault();
    setSettings(await apiRequest("/settings", { method: "PUT", body: JSON.stringify(settings) }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!settings) return <p>A carregar definições...</p>;

  return (
    <form className={styles.settings} onSubmit={submit}>
      <section className={styles.panel}>
        <h2>Margem e moeda</h2>
        <div className={styles.formGrid}>
          <label>Margem de lucro desejada (%)<input type="number" step="0.01" value={settings.desiredProfitMargin} onChange={(e) => setSettings({ ...settings, desiredProfitMargin: e.target.value })} /></label>
          <label>Moeda principal<select value={settings.defaultCurrency} onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}><option>EUR</option><option>USD</option><option>GBP</option><option>CNY</option></select></label>
          {["USD", "GBP", "CNY"].map((currency) => (
            <label key={currency}>Taxa {currency} para EUR<input type="number" step="0.0001" value={settings.exchangeRatesToEur?.[currency]} onChange={(e) => setSettings({ ...settings, exchangeRatesToEur: { ...settings.exchangeRatesToEur, [currency]: e.target.value } })} /></label>
          ))}
        </div>
      </section>
      <button className={styles.primary}><Save size={18} /> Guardar definições</button>
      {saved ? <span className={styles.saved}>Definições guardadas.</span> : null}
    </form>
  );
}
