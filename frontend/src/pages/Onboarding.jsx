import { CheckCircle2 } from "lucide-react";
import styles from "./Page.module.css";

const steps = [
  "Crie os produtos assim que faz a encomenda ao fornecedor.",
  "Registe custos reais: compra, envio internacional, alfândega, IVA, embalagem e comissões.",
  "Use encomendas de importação para agrupar lotes e distribuir custos de envio.",
  "Publique nos marketplaces e acompanhe preço anunciado, margem e ROI.",
  "Registe a venda quando o artigo sair para atualizar lucro e stock.",
  "Consulte relatórios para perceber categorias, fornecedores e marketplaces mais fortes."
];

export default function Onboarding() {
  return (
    <section className={styles.panel}>
      <h2>Como usar o Import2Profit</h2>
      <div className={styles.steps}>
        {steps.map((step) => (
          <article key={step}>
            <CheckCircle2 size={22} />
            <p>{step}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
