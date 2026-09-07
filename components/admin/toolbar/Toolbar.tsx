"use client";

import styles from "./Toolbar.module.css";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;
};

export default function Toolbar({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
}: Props) {
  return (
    <div className={styles.toolbar}>
      <input
        className={styles.search}
        placeholder="🔍 Поиск картины..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
        className={styles.select}
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <option value="all">
          Все
        </option>

        <option value="available">
          В наличии
        </option>

        <option value="sold">
          Продано
        </option>
      </select>

      <select
        className={styles.select}
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
      >
        <option value="new">
          Сначала новые
        </option>

        <option value="old">
          Сначала старые
        </option>

        <option value="priceAsc">
          Цена ↑
        </option>

        <option value="priceDesc">
          Цена ↓
        </option>

        <option value="yearDesc">
          Год ↓
        </option>

        <option value="yearAsc">
          Год ↑
        </option>

        <option value="name">
          Название А-Я
        </option>
      </select>
    </div>
  );
}