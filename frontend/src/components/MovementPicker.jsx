import { MOVEMENT_OPTIONS } from "../../constants/data";
import styles from "./MovementPicker.module.css";

export default function MovementPicker({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>MOVEMENT</span>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {MOVEMENT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className={styles.arrow}>▾</span>
      </div>
    </div>
  );
}
