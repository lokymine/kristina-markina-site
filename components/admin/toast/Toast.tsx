"use client";

import styles from "./Toast.module.css";

export type ToastType =
  | "success"
  | "error";

type Props = {
  show: boolean;
  message: string;
  type: ToastType;
};

export default function Toast({
  show,
  message,
  type,
}: Props) {
  return (
    <div
      className={`${styles.toast} ${
        show ? styles.show : ""
      } ${
        type === "success"
          ? styles.success
          : styles.error
      }`}
    >
      <div className={styles.icon}>
        {type === "success"
          ? "✓"
          : "✕"}
      </div>

      <div>{message}</div>
    </div>
  );
}