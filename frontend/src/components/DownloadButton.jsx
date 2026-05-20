import styles from "./DownloadButton.module.css";

export default function DownloadButton({ videoUrl }) {
  if (!videoUrl) return null;

  return (
    <a
      href={videoUrl}
      download="cinesync-output.mp4"
      className={styles.downloadBtn}
    >
      <span className={styles.icon}>⬇</span>
      <span>Download Video</span>
    </a>
  );
}