import styles from "./GenerateButton.module.css";

export default function GenerateButton({ onClick, disabled, isLoading }) {
  return (
    <button
      className={`${styles.btn} ${isLoading ? styles.loading : ""}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <span className={styles.spinner} />
          Generating…
        </>
      ) : (
        <>
          <span className={styles.icon}>▶</span>
          Generate Preview
        </>
      )}
    </button>
  );
}
