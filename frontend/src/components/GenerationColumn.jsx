import ColumnHeader from "../layout/ColumnHeader";
import PreviewBox from "./PreviewBox";
import GenerateButton from "./GenerateButton";
import DownloadButton from "./DownloadButton";
import styles from "./GenerationColumn.module.css";

export default function GenerationColumn({
  isReady,
  status,
  progress,
  videoUrl,
  onGenerate,
  onReset,
  camera,
  activeShotLabel,
  isSlow,
}) {
  const canGenerate = isReady && status === "idle";
  const isDone = status === "done";

  return (
    <section className={styles.column}>
      {/* ───────── Header ───────── */}
      <ColumnHeader
        step="03"
        title="Generation"
        subtitle="Preview & Export"
        rightSlot={
          isDone && (
            <button className={styles.resetBtn} onClick={onReset}>
              ↺ Reset
            </button>
          )
        }
      />

      <div className={styles.body}>
        {/* ───────── Shot Summary Badge ───────── */}
        {activeShotLabel && (
          <div className={styles.shotBadge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>
              {activeShotLabel}
            </span>

            {camera && (
              <span className={styles.badgeMeta}>
                {camera.lens} · {camera.movement}
              </span>
            )}
          </div>
        )}

        {/* ───────── Preview Window ───────── */}
        <PreviewBox
          status={status}
          progress={progress}
          videoUrl={videoUrl}
        />

        {/* ───────── Slow Generation Hint ───────── */}
        {status === "loading" && isSlow && (
          <p className={styles.slowHint}>
            ⏳ Taking longer than usual… still generating
          </p>
        )}

        {/* ───────── Generate Button ───────── */}
        {!isDone && (
          <GenerateButton
            onClick={onGenerate}
            disabled={!canGenerate}
            isLoading={status === "loading"}
          />
        )}

        {/* ───────── Disabled Hint ───────── */}
        {!isReady && status === "idle" && (
          <p className={styles.hint}>
            Complete columns 1 &amp; 2 to unlock generation
          </p>
        )}

        {/* ───────── Export Section ───────── */}
        {isDone && (
          <div className={styles.shareSection}>
            <p className={styles.shareLabel}>EXPORT VIDEO</p>

            <DownloadButton videoUrl={videoUrl} />

            <p className={styles.shareNote}>
              Saved locally · Ready for editing
            </p>
          </div>
        )}
      </div>
    </section>
  );
}