"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/components/admin/layout/AdminLayout";
import Dashboard from "@/components/admin/dashboard/Dashboard";

import styles from "./page.module.css";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  async function logout() {
    try {
      await fetch(
        "/api/admin/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Ошибка выхода:",
        error
      );
    }

    router.replace(
      "/admin/login"
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const response =
          await fetch(
            "/api/admin/check",
            {
              credentials:
                "include",

              cache:
                "no-store",
            }
          );

        if (!response.ok) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        if (cancelled) {
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error(
          "Ошибка проверки авторизации:",
          error
        );

        if (!cancelled) {
          router.replace(
            "/admin/login"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <main
        className={
          styles.center
        }
      >
        Загрузка...
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <AdminLayout
      onLogout={logout}
    >
      <main
        className={
          styles.page
        }
      >
        <header
          className={
            styles.header
          }
        >
          <div>
            <h1>
              Dashboard
            </h1>

            <p>
              Аналитика сайта
            </p>
          </div>
        </header>

        <Dashboard />
      </main>
    </AdminLayout>
  );
}