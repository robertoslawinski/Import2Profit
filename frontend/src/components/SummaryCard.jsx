import styles from "./SummaryCard.module.css";

export default function SummaryCard({ label, value, helper, tone = "default", icon: Icon }) {
  return (
    <article className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.icon}>{Icon ? <Icon size={20} /> : null}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  );
}
