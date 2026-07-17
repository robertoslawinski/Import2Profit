import { BarChart3, Boxes, ClipboardList, LayoutDashboard, LogOut, Package, ReceiptText, Settings, ShoppingBag } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./AppLayout.module.css";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Produtos", icon: Package },
  { to: "/orders", label: "Importações", icon: ClipboardList },
  { to: "/sales", label: "Vendas", icon: ShoppingBag },
  { to: "/stock", label: "Stock", icon: Boxes },
  { to: "/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/settings", label: "Definições", icon: Settings }
];

const titles = {
  "/": "Visão geral",
  "/products": "Gestão de produtos",
  "/orders": "Encomendas de importação",
  "/sales": "Vendas por marketplace",
  "/stock": "Controlo de stock",
  "/reports": "Relatórios",
  "/settings": "Definições",
  "/onboarding": "Primeiros passos"
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = titles[location.pathname] || "Import2Profit";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <ReceiptText size={28} />
          <div>
            <strong>Import2Profit</strong>
            <span>Gestão para revenda</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? styles.active : undefined)} end={item.to === "/"}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <button className={styles.logout} onClick={logout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <span>Olá, {user?.name}</span>
            <h1>{title}</h1>
          </div>
          <NavLink className={styles.onboarding} to="/onboarding">Guia rápido</NavLink>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
