import styles from "./PreviewBox.module.css";

export default function PreviewBox({ status, progress, videoUrl }) {
  return (
    <div className={styles.box}>
      {status === "idle" && <IdleState />}
      {status === "loading" && <LoadingState progress={progress} />}
      {status === "done" && <VideoState url={videoUrl} />}
    </div>
  );
}

function IdleState() {
  return (
    <div className={styles.idle}>
      <div className={styles.idleIcon}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          <polygon points="16,13 16,27 28,20" fill="currentColor" opacity="0.35" />
        </svg>
      </div>
      <p className={styles.idleText}>Configure your shot, then generate</p>
    </div>
  );
}

function LoadingState({ progress }) {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingLabel}>
        <span className={styles.loadingDot} />
        GENERATING
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.progressNum}>{progress}%</span>
    </div>
  );
}

function VideoState({ url }) {
  return (
    <video
      className={styles.video}
      src={url}
      controls
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onError={() => {
        console.error("Video failed to load:", url);
        alert("Video failed to load. Please regenerate.");
      }}
    />
  );
}
