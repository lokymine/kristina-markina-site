import styles from "./StatusBadge.module.css";

type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  const available =
    status === "available";

  return (
    <span
      className={
        available
          ? styles.available
          : styles.sold
      }
    >
      <span className={styles.dot} />

      {available
        ? "В наличии"
        : "Продано"}
    </span>
  );
}