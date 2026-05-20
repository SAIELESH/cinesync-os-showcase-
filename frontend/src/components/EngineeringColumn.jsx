import ColumnHeader   from "../layout/ColumnHeader";
import ShotCard       from "./ShotCard";
import LensPicker     from "./LensPicker";
import MovementPicker from "./MovementPicker";
import FramingGrid    from "./FramingGrid";
import styles         from "./EngineeringColumn.module.css";

export default function EngineeringColumn({
  activeScene,
  shots,
  isGenerating,
  activeShotId,
  onShotSelect,
  onShotUpdate,
  camera,
  onLensChange,
  onMovementChange,
  onFramingChange,
  imagePath,
  setImagePath,
  useReference,
  setUseReference
}) {

  const cameraReady = activeShotId !== null;

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/upload-image", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setImagePath(data.file_path);
  }

  return (
    <section className={styles.column}>
      <ColumnHeader
        step="02"
        title="Engineering"
        subtitle={
          activeScene
            ? `Shot list — ${activeScene.title}`
            : "Select a scene first"
        }
      />

      {!activeScene && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>←</span>
          <p>Select a scene card to generate shots</p>
        </div>
      )}

      {activeScene && (
        <div className={styles.body}>

          {/* SHOTS */}
          <div className={styles.shotList}>
            <p className={styles.sectionLabel}>SUGGESTED SHOTS</p>

            {isGenerating && (
              <div className={styles.skeletonList}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard} />
                ))}
              </div>
            )}

            {!isGenerating && shots.length > 0 && shots.map((shot, i) => (
              <ShotCard
                key={shot.id}
                shot={shot}
                index={i}
                isActive={activeShotId === shot.id}
                onSelect={onShotSelect}
                onUpdate={onShotUpdate}
              />
            ))}

            {!isGenerating && shots.length === 0 && (
              <div className={styles.empty}>
                <p>No shots generated</p>
              </div>
            )}
          </div>

          {/* CAMERA */}
          <div className={`${styles.cameraPanel} ${cameraReady ? styles.cameraPanelVisible : ""}`}>
            <p className={styles.sectionLabel}>CineSync Controls</p>

            <div className={styles.controls}>
              <LensPicker value={camera.lens} onChange={onLensChange} />
              <div className={styles.divider} />
              <MovementPicker value={camera.movement} onChange={onMovementChange} />
              <div className={styles.divider} />
              <FramingGrid value={camera.framing} onChange={onFramingChange} />
            </div>

            {/* 🔥 NEW: Reference Image */}
            <div className={styles.referencePanel}>
              <p className={styles.sectionLabel}>Reference</p>

              <div className={styles.referenceCard}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                />

                {imagePath && (
                  <p className={styles.fileName}>Image selected</p>
                )}

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={useReference}
                    onChange={(e) => setUseReference(e.target.checked)}
                  />
                  <span>Enable consistency mode</span>
                </label>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}