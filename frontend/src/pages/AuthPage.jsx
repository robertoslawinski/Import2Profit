import { useState } from "react";
import { Box, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, register, loading } = useAuth();

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}><Box size={32} /><strong>Import2Profit</strong></div>
        <h1>{mode === "login" ? "Entrar na conta" : "Criar conta"}</h1>
        <p>Controle custos, margens, stock e vendas dos seus produtos importados.</p>
        <form onSubmit={submit}>
          {mode === "register" ? <label>Nome<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label> : null}
          <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Password<input required type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          {error ? <span className={styles.error}>{error}</span> : null}
          <button disabled={loading}>{mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}{loading ? "A processar..." : mode === "login" ? "Entrar" : "Registar"}</button>
        </form>
        <button className={styles.switcher} onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Ainda não tenho conta" : "Já tenho conta"}
        </button>
      </section>
    </main>
  );
}
