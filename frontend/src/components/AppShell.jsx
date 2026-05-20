import styles from "./AppShell.module.css";

export default function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <span className={styles.wordmark}>CineSync.AI</span>
        <span className={styles.tagline}>Shot Engineering Prototype — M1</span>
        <div className={styles.dot} />
      </header>
      <main className={styles.columns}>{children}</main>
    </div>
  );
}
