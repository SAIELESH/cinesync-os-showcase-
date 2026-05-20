import styles from "./ScriptInput.module.css";

export default function ScriptInput({ value, onChange, onParse, isParsing }) {
  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your script here…"
        spellCheck={false}
      />
      <button
        className={`${styles.parseBtn} ${isParsing ? styles.parseBtnLoading : ""}`}
        onClick={onParse}
        disabled={isParsing || !value.trim()}
      >
        {isParsing ? (
          <>
            <span className={styles.spinner} />
            Parsing Script…
          </>
        ) : (
          <>
            <span className={styles.icon}>⬡</span>
            Parse into Scenes
          </>
        )}
      </button>
    </div>
  );
}
