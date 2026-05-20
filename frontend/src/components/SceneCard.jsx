import { useState, useRef } from "react";
import styles from "./SceneCard.module.css";

export default function SceneCard({ scene, isActive, onSelect }) {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(scene.description);

  const cardRef = useRef(null);

  function handleEditToggle(e) {
    e.stopPropagation();
    setEditing((p) => !p);
  }

  // 🔥 Mouse move → glow + tilt
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Glow position
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);

    // Subtle tilt (premium feel)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    cardRef.current.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.02)
    `;
  };

  // 🔥 Reset smoothly
  const handleMouseLeave = () => {
    cardRef.current.style.setProperty("--x", `50%`);
    cardRef.current.style.setProperty("--y", `50%`);

    cardRef.current.style.transform = `
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      onClick={() => onSelect(scene.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${parseInt(scene.number, 10) * 60}ms` }}
    >
      <div className={styles.topRow}>
        <span className={styles.number}>SC·{scene.number}</span>
        <span className={styles.title}>{scene.title}</span>
        <button
          className={styles.editBtn}
          onClick={handleEditToggle}
          title="Edit scene"
        >
          {editing ? "✓" : "✎"}
        </button>
      </div>

      {editing ? (
        <textarea
          className={styles.editArea}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          rows={3}
        />
      ) : (
        <p className={styles.desc}>{desc}</p>
      )}

      {isActive && <div className={styles.activeLine} />}
    </div>
  );
}