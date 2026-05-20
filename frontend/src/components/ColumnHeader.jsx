import styles from "./ColumnHeader.module.css";

export default function ColumnHeader({ step, title, subtitle, rightSlot }) {
  return (
    <div className={styles.header}>
      <div className={styles.stepBadge}>{step}</div>
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {rightSlot && <div className={styles.right}>{rightSlot}</div>}
    </div>
  );
}
