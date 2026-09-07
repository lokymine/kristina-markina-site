"use client";

import styles from "./UploadProgress.module.css";

type Props = {
  progress: number;
};

export default function UploadProgress({
  progress,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <span>{progress}%</span>
    </div>
  );
}