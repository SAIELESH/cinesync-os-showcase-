import { LENS_OPTIONS } from "../../constants/data";
import styles from "./LensPicker.module.css";

export default function LensPicker({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>LENS</span>

      <div className={styles.group}>
        {LENS_OPTIONS.map((opt) => {
          const isActive = value === opt.id;

          return (
            <button
              key={opt.id}
              type="button" // 🔥 IMPORTANT (prevents form issues)
              className={`${styles.btn} ${isActive ? styles.btnActive : ""}`}
              onClick={() => onChange(opt.id)}
              aria-pressed={isActive} // ✅ accessibility + state clarity
            >
              <span className={styles.iconCircle} />

              <span className={styles.name}>
                {opt.label}
              </span>

              <span className={styles.mm}>
                {opt.mm}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}