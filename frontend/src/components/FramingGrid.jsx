import { FRAMING_LABELS } from "../../constants/data";
import styles from "./FramingGrid.module.css";

export default function FramingGrid({ value, onChange }) {
  // value format: "row-col" e.g. "1-1" = center
  const [activeRow, activeCol] = value.split("-").map(Number);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>FRAMING</span>
      <div className={styles.frame}>
        {/* Rule-of-thirds guide lines */}
        <div className={styles.lineV1} />
        <div className={styles.lineV2} />
        <div className={styles.lineH1} />
        <div className={styles.lineH2} />

        <div className={styles.grid}>
          {FRAMING_LABELS.map((row, r) =>
            row.map((cellLabel, c) => {
              const isActive = r === activeRow && c === activeCol;
              return (
                <button
                  key={`${r}-${c}`}
                  className={`${styles.cell} ${isActive ? styles.cellActive : ""}`}
                  onClick={() => onChange(`${r}-${c}`)}
                  title={cellLabel}
                  aria-label={cellLabel}
                />
              );
            })
          )}
        </div>
      </div>
      <span className={styles.hint}>
        {FRAMING_LABELS[activeRow][activeCol]}
      </span>
    </div>
  );
}
