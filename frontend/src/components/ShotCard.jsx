import { useState, useEffect } from "react";
import styles from "./ShotCard.module.css";

export default function ShotCard({
  shot,
  isActive,
  onSelect,
  onUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(shot.label);
  const [sub, setSub] = useState(shot.sub);

  // Sync with LLM updates
  useEffect(() => {
    setLabel(shot.label);
    setSub(shot.sub);
  }, [shot]);

  function handleToggle(e) {
    e.stopPropagation();

    if (editing) {
      onUpdate(shot.id, {
        label,
        sub,
      });
    }

    setEditing((prev) => !prev);
  }

  return (
    <div
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      onClick={() => onSelect(shot.id)}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.index}>
          SHOT {shot.id.replace("sh", "").padStart(2, "0")}
        </span>

        {editing ? (
          <input
            className={styles.titleInput}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={styles.label}>{shot.label}</span>
        )}

        <button
          className={styles.editBtn}
          onClick={handleToggle}
          title="Edit shot"
        >
          {editing ? "✓" : "✎"}
        </button>
      </div>

      {/* Description */}
      {editing ? (
        <textarea
          className={styles.textarea}
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          rows={3}
        />
      ) : (
        <p className={styles.sub}>{shot.sub}</p>
      )}
    </div>
  );
}