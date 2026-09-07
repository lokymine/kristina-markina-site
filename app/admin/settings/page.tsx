"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import { AVAILABLE_FONTS } from "@/lib/fonts";

import styles from "./page.module.css";

import AdminLayout from "@/components/admin/layout/AdminLayout";
import { useRouter } from "next/navigation";

type Section =
  | "about"
  | "contacts"
  | "home";

type AboutData = {
  title: string;
  description: string;
  image: string | null;

  titleColor: string;
  descriptionColor: string;

  fontFamily: string;
};

type ContactsData = {
  phone: string | null;
  email: string | null;
  telegram: string | null;
  vk: string | null;
  whatsapp: string | null;
  instagram: string | null;

  fontFamily: string;
};

type HomeData = {
  label: string;
  title: string;
  description: string;
  buttonText: string;

  heroImage: string | null;
  backgroundImage: string | null;

  backgroundColor: string;

  homeLabelColor: string;
  homeTitleColor: string;
  homeDescriptionColor: string;

  homeButtonColor: string;
  homeButtonTextColor: string;

  homeFontFamily: string;

  homeLayout:
    | "left"
    | "center"
    | "right";

  backgroundOverlay: number;
};

type FontAsset = {
  id: number;
  name: string;
  url: string;
};

export default function SettingsPage() {
  const router = useRouter();

  const [section, setSection] =
    useState<Section>("about");

  const [about, setAbout] =
    useState<AboutData>({
      title: "",
      description: "",
      image: null,

      titleColor: "#292722",
      descriptionColor: "#5f5b54",

      fontFamily: "system",
    });

  const [contacts, setContacts] =
    useState<ContactsData>({
      phone: "",
      email: "",
      telegram: "",
      vk: "",
      whatsapp: "",
      instagram: "",

      fontFamily: "system",
    });

  const [home, setHome] =
    useState<HomeData>({
      label: "",
      title: "",
      description: "",
      buttonText: "Смотреть каталог",

      heroImage: null,
      backgroundImage: null,

      backgroundColor: "#f8f7f3",

      homeLabelColor: "#f8f7f3",
      homeTitleColor: "#f8f7f3",
      homeDescriptionColor: "#f8f7f3",

      homeButtonColor: "#292722",
      homeButtonTextColor: "#f8f7f3",

      homeFontFamily: "system",

      homeLayout: "left",

      backgroundOverlay: 0,
    });

  const [customFonts, setCustomFonts] =
    useState<FontAsset[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [uploading, setUploading] =
    useState<string | null>(null);

  const [fontUploading, setFontUploading] =
    useState(false);

  useEffect(() => {
    loadSettings();
    loadCustomFonts();
  }, []);

  async function loadCustomFonts() {
    try {
      const response =
        await fetch("/api/fonts", {
          cache: "no-store",
        });

      if (!response.ok) {
        throw new Error(
          "Ошибка загрузки шрифтов"
        );
      }

      const data =
        await response.json();

      setCustomFonts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(error);
    }
  }
  async function deleteCustomFont(
    id: number,
    name: string
  ) {
    const confirmed =
      window.confirm(
        `Удалить шрифт «${name}»?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          "/api/fonts",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Не удалось удалить шрифт"
        );
      }

      await loadCustomFonts();
    } catch (error) {
      console.error(
        "Ошибка удаления шрифта:",
        error
      );

      alert(
        "Не удалось удалить шрифт"
      );
    }
  }
  async function loadSettings() {
    try {
      setLoading(true);
      setMessage("");

      const [
        aboutResponse,
        contactsResponse,
        homeResponse,
      ] = await Promise.all([
        fetch("/api/about", {
          cache: "no-store",
        }),

        fetch("/api/contacts", {
          cache: "no-store",
        }),

        fetch("/api/home-settings", {
          cache: "no-store",
        }),
      ]);

      if (!aboutResponse.ok) {
        throw new Error(
          "Ошибка загрузки About"
        );
      }

      if (!contactsResponse.ok) {
        throw new Error(
          "Ошибка загрузки контактов"
        );
      }

      if (!homeResponse.ok) {
        throw new Error(
          "Ошибка загрузки главной"
        );
      }

      const aboutData =
        await aboutResponse.json();

      const contactsData =
        await contactsResponse.json();

      const homeData =
        await homeResponse.json();

      setAbout({
        title:
          aboutData.title ?? "",

        description:
          aboutData.description ?? "",

        image:
          aboutData.image ?? null,

        titleColor:
          aboutData.titleColor ??
          "#292722",

        descriptionColor:
          aboutData.descriptionColor ??
          "#5f5b54",

        fontFamily:
          aboutData.fontFamily ??
          "system",
      });

      setContacts({
        phone:
          contactsData.phone ?? "",

        email:
          contactsData.email ?? "",

        telegram:
          contactsData.telegram ?? "",

        vk:
          contactsData.vk ?? "",

        whatsapp:
          contactsData.whatsapp ?? "",

        instagram:
          contactsData.instagram ?? "",

        fontFamily:
          contactsData.fontFamily ??
          "system",
      });

      setHome({
        label:
          homeData.label ?? "",

        title:
          homeData.title ?? "",

        description:
          homeData.description ?? "",

        buttonText:
          homeData.buttonText ??
          "Смотреть каталог",

        heroImage:
          homeData.heroImage ??
          null,

        backgroundImage:
          homeData.backgroundImage ??
          null,

        backgroundColor:
          homeData.backgroundColor ??
          "#f8f7f3",

        homeLabelColor:
          homeData.homeLabelColor ??
          "#f8f7f3",

        homeTitleColor:
          homeData.homeTitleColor ??
          "#f8f7f3",

        homeDescriptionColor:
          homeData.homeDescriptionColor ??
          "#f8f7f3",

        homeButtonColor:
          homeData.homeButtonColor ??
          "#292722",

        homeButtonTextColor:
          homeData.homeButtonTextColor ??
          "#f8f7f3",

        homeFontFamily:
          homeData.homeFontFamily ??
          "system",

        homeLayout:
          homeData.homeLayout === "center"
            ? "center"
            : homeData.homeLayout === "right"
            ? "right"
            : "left",

        backgroundOverlay:
          Number.isFinite(
            Number(
              homeData.backgroundOverlay
            )
          )
            ? Math.min(
                100,
                Math.max(
                  0,
                  Number(
                    homeData.backgroundOverlay
                  )
                )
              )
            : 0,
      });
    } catch (error) {
      console.error(error);

      setMessage(
        "Не удалось загрузить настройки"
      );
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(
    file: File
  ): Promise<string> {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

    if (!response.ok) {
      throw new Error(
        "Ошибка загрузки изображения"
      );
    }

    const data =
      await response.json();

    if (!data.url) {
      throw new Error(
        "Сервер не вернул URL изображения"
      );
    }

    return data.url;
  }

  async function uploadFont(
    file: File
  ): Promise<FontAsset> {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await fetch(
        "/api/fonts",
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Ошибка загрузки шрифта"
      );
    }

    return data as FontAsset;
  }

  async function handleFontUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setFontUploading(true);
      setMessage("");

      const font =
        await uploadFont(file);

      setCustomFonts(
        (prev) => [
          ...prev,
          font,
        ]
      );

      setMessage(
        `Шрифт «${font.name}» загружен. Теперь его можно выбрать в настройках.`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить шрифт"
      );
    } finally {
      setFontUploading(false);

      event.target.value = "";
    }
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    type:
      | "about"
      | "hero"
      | "background"
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(type);
      setMessage("");

      const url =
        await uploadImage(file);

      if (type === "about") {
        setAbout((prev) => ({
          ...prev,
          image: url,
        }));
      }

      if (type === "hero") {
        setHome((prev) => ({
          ...prev,
          heroImage: url,
        }));
      }

      if (type === "background") {
        setHome((prev) => ({
          ...prev,
          backgroundImage: url,
        }));
      }

      setMessage(
        "Изображение загружено. Не забудьте сохранить изменения."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Не удалось загрузить изображение"
      );
    } finally {
      setUploading(null);

      event.target.value = "";
    }
  }

  function removeAboutImage() {
    setAbout((prev) => ({
      ...prev,
      image: null,
    }));
  }

  function removeHeroImage() {
    setHome((prev) => ({
      ...prev,
      heroImage: null,
    }));
  }

  function removeBackgroundImage() {
    setHome((prev) => ({
      ...prev,
      backgroundImage: null,
    }));
  }

  async function saveAbout() {
    const response =
      await fetch(
        "/api/about",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            about
          ),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Ошибка сохранения About"
      );
    }
  }

  async function saveContacts() {
    const response =
      await fetch(
        "/api/contacts",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            contacts
          ),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Ошибка сохранения контактов"
      );
    }
  }

  async function saveHome() {
    const response =
      await fetch(
        "/api/home-settings",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            home
          ),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Ошибка сохранения главной"
      );
    }
  }

  async function saveCurrentSection() {
    try {
      setSaving(true);
      setMessage("");

      if (section === "about") {
        await saveAbout();
      }

      if (section === "contacts") {
        await saveContacts();
      }

      if (section === "home") {
        await saveHome();
      }

      setMessage(
        "Изменения успешно сохранены"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Не удалось сохранить изменения"
      );
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch(
      "/api/admin/logout",
      {
        method: "POST",
      }
    );

    router.replace(
      "/admin/login"
    );
  }

  if (loading) {
    return (
      <div
        className={
          styles.loading
        }
      >
        Загрузка настроек...
      </div>
    );
  }

  return (
    <AdminLayout
      onLogout={logout}
    >
      <div
        className={
          styles.page
        }
      >
        <div
          className={
            styles.header
          }
        >
          <div>
            <p
              className={
                styles.label
              }
            >
              Gallery CMS
            </p>

            <h1
              className={
                styles.title
              }
            >
              Настройки
            </h1>
          </div>

          <button
            type="button"
            className={
              styles.saveButton
            }
            onClick={
              saveCurrentSection
            }
            disabled={saving}
          >
            {saving
              ? "Сохранение..."
              : "Сохранить"}
          </button>
        </div>

        {message && (
          <div
            className={
              styles.message
            }
          >
            {message}
          </div>
        )}

        {/* =====================================
            CUSTOM FONTS
        ===================================== */}

        <section
          className={
            styles.fontManager
          }
        >
          <div
            className={
              styles.editorHeader
            }
          >
            <div>
              <p
                className={
                  styles.editorLabel
                }
              >
                Шрифты
              </p>

              <h2>
                Свои шрифты
              </h2>
            </div>
          </div>

          <div
            className={
              styles.fontManagerContent
            }
          >
            <div
              className={
                styles.fontUpload
              }
            >
              <label
                className={
                  styles.secondaryButton
                }
              >
                {fontUploading
                  ? "Загрузка..."
                  : "Добавить свой шрифт"}

                <input
                  type="file"
                  accept=".woff2,.woff,.ttf"
                  disabled={
                    fontUploading
                  }
                  onChange={
                    handleFontUpload
                  }
                />
              </label>

              <small>
                Поддерживаются WOFF2,
                WOFF и TTF.
                Максимальный размер —
                10 МБ.
              </small>
            </div>

            {customFonts.length > 0 && (
              <div
                className={
                  styles.fontList
                }
              >
                {customFonts.map(
                  (font) => (
                    <div
                      key={font.id}
                      className={
                        styles.fontItem
                      }
                    >
                      <div>
                        <strong
                          style={{
                            fontFamily:
                              `"${font.name}"`,
                          }}
                        >
                          {font.name}
                        </strong>

                        <small>
                          {font.url}
                        </small>
                      </div>

                      <button
                        type="button"
                        className={
                          styles.fontDelete
                        }
                        onClick={() =>
                          deleteCustomFont(
                            font.id,
                            font.name
                          )
                        }
                      >
                        Удалить
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {customFonts.length === 0 && (
              <div
                className={
                  styles.fontEmpty
                }
              >
                Пока нет загруженных
                шрифтов.
              </div>
            )}
          </div>
        </section>

        {/* =====================================
            SECTIONS
        ===================================== */}

        <div
          className={
            styles.sections
          }
        >
          <button
            type="button"
            className={
              section === "about"
                ? styles.sectionButtonActive
                : styles.sectionButton
            }
            onClick={() =>
              setSection("about")
            }
          >
            <span>01</span>

            <div>
              <strong>
                О художнике
              </strong>

              <small>
                Текст и фотография
              </small>
            </div>
          </button>

          <button
            type="button"
            className={
              section === "contacts"
                ? styles.sectionButtonActive
                : styles.sectionButton
            }
            onClick={() =>
              setSection(
                "contacts"
              )
            }
          >
            <span>02</span>

            <div>
              <strong>
                Контакты
              </strong>

              <small>
                Телефон и социальные сети
              </small>
            </div>
          </button>

          <button
            type="button"
            className={
              section === "home"
                ? styles.sectionButtonActive
                : styles.sectionButton
            }
            onClick={() =>
              setSection("home")
            }
          >
            <span>03</span>

            <div>
              <strong>
                Главная страница
              </strong>

              <small>
                Текст, фото и фон
              </small>
            </div>
          </button>
        </div>

        {/* =====================================
            ABOUT
        ===================================== */}

        {section === "about" && (
          <section
            className={
              styles.editor
            }
          >
            <div
              className={
                styles.editorHeader
              }
            >
              <div>
                <p
                  className={
                    styles.editorLabel
                  }
                >
                  Секция 01
                </p>

                <h2>
                  О художнике
                </h2>
              </div>
            </div>

            <div
              className={
                styles.twoColumns
              }
            >
              <div
                className={
                  styles.form
                }
              >
                <div
                  className={
                    styles.field
                  }
                >
                  <label>
                    Заголовок
                  </label>

                  <input
                    value={
                      about.title
                    }
                    onChange={(
                      event
                    ) =>
                      setAbout(
                        (prev) => ({
                          ...prev,
                          title:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="О художнике"
                  />
                </div>

                <div
                  className={
                    styles.field
                  }
                >
                  <label>
                    Описание
                  </label>

                  <textarea
                    value={
                      about.description
                    }
                    onChange={(
                      event
                    ) =>
                      setAbout(
                        (prev) => ({
                          ...prev,
                          description:
                            event.target
                              .value,
                        })
                      )
                    }
                    rows={14}
                    placeholder="Введите информацию о художнике..."
                  />

                  <small>
                    Enter создаёт новый
                    абзац.
                  </small>
                </div>

                {/* ЦВЕТ ЗАГОЛОВКА */}

                <div
                  className={
                    styles.field
                  }
                >
                  <label>
                    Цвет заголовка
                  </label>

                  <div
                    className={
                      styles.colorRow
                    }
                  >
                    <input
                      type="color"
                      value={
                        about.titleColor ||
                        "#292722"
                      }
                      onChange={(
                        event
                      ) =>
                        setAbout(
                          (prev) => ({
                            ...prev,
                            titleColor:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    />

                    <input
                      type="text"
                      value={
                        about.titleColor ||
                        "#292722"
                      }
                      onChange={(
                        event
                      ) =>
                        setAbout(
                          (prev) => ({
                            ...prev,
                            titleColor:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="#292722"
                    />
                  </div>
                </div>

                {/* ЦВЕТ ОПИСАНИЯ */}

                <div
                  className={
                    styles.field
                  }
                >
                  <label>
                    Цвет описания
                  </label>

                  <div
                    className={
                      styles.colorRow
                    }
                  >
                    <input
                      type="color"
                      value={
                        about.descriptionColor ||
                        "#5f5b54"
                      }
                      onChange={(
                        event
                      ) =>
                        setAbout(
                          (prev) => ({
                            ...prev,
                            descriptionColor:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    />

                    <input
                      type="text"
                      value={
                        about.descriptionColor ||
                        "#5f5b54"
                      }
                      onChange={(
                        event
                      ) =>
                        setAbout(
                          (prev) => ({
                            ...prev,
                            descriptionColor:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="#5f5b54"
                    />
                  </div>
                </div>

                {/* ШРИФТ */}

                <div
                  className={
                    styles.field
                  }
                >
                  <label>
                    Шрифт
                  </label>

                  <select
                    value={
                      about.fontFamily
                    }
                    onChange={(
                      event
                    ) =>
                      setAbout(
                        (prev) => ({
                          ...prev,
                          fontFamily:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  >
                    {AVAILABLE_FONTS.map(
                      (
                        font
                      ) => (
                        <option
                          key={
                            font.value
                          }
                          value={
                            font.value
                          }
                        >
                          {
                            font.label
                          }
                        </option>
                      )
                    )}

                    {customFonts.map(
                      (
                        font
                      ) => (
                        <option
                          key={`custom-about-${font.id}`}
                          value={
                            font.name
                          }
                        >
                          {
                            font.name
                          }{" "}
                          — свой шрифт
                        </option>
                      )
                    )}
                  </select>

                  <small>
                    Шрифт будет
                    использоваться
                    для всей секции
                    «О художнике».
                  </small>
                </div>
              </div>

              <div
                className={
                  styles.imageEditor
                }
              >
                <label>
                  Фотография художника
                </label>

                <div
                  className={
                    styles.imagePreview
                  }
                >
                  {about.image ? (
                    <img
                      src={
                        about.image
                      }
                      alt="О художнике"
                    />
                  ) : (
                    <div
                      className={
                        styles.noImage
                      }
                    >
                      Фотография
                      отключена
                    </div>
                  )}
                </div>

                <div
                  className={
                    styles.imageButtons
                  }
                >
                  <label
                    className={
                      styles.secondaryButton
                    }
                  >
                    {uploading ===
                    "about"
                      ? "Загрузка..."
                      : "Заменить фотографию"}

                    <input
                      type="file"
                      accept="image/*"
                      disabled={
                        uploading ===
                        "about"
                      }
                      onChange={(
                        event
                      ) =>
                        handleImageUpload(
                          event,
                          "about"
                        )
                      }
                    />
                  </label>

                  {about.image && (
                    <button
                      type="button"
                      className={
                        styles.dangerButton
                      }
                      onClick={
                        removeAboutImage
                      }
                    >
                      Убрать фотографию
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================
            CONTACTS
        ===================================== */}

        {section ===
          "contacts" && (
          <section
            className={
              styles.editor
            }
          >
            <div
              className={
                styles.editorHeader
              }
            >
              <div>
                <p
                  className={
                    styles.editorLabel
                  }
                >
                  Секция 02
                </p>

                <h2>
                  Контакты
                </h2>
              </div>
            </div>

            <div
              className={
                styles.contactsGrid
              }
            >
              <div
                className={
                  styles.field
                }
              >
                <label>
                  Телефон
                </label>

                <input
                  value={
                    contacts.phone ??
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setContacts(
                      (prev) => ({
                        ...prev,
                        phone:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    contacts.email ??
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setContacts(
                      (prev) => ({
                        ...prev,
                        email:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="mail@example.com"
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Telegram
                </label>

                <input
                  value={
                    contacts.telegram ??
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setContacts(
                      (prev) => ({
                        ...prev,
                        telegram:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="https://t.me/..."
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  VK
                </label>

                <input
                  value={
                    contacts.vk ??
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setContacts(
                      (prev) => ({
                        ...prev,
                        vk:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="https://vk.com/..."
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  WhatsApp
                </label>

                <input
                  value={
                    contacts.whatsapp ??
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setContacts(
                      (prev) => ({
                        ...prev,
                        whatsapp:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="+7..."
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Instagram
                </label>

                <input
                  value={
                    contacts.instagram ??
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setContacts(
                      (prev) => ({
                        ...prev,
                        instagram:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* ШРИФТ КОНТАКТОВ */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Шрифт контактов
                </label>

                <select
                  value={
                    contacts.fontFamily
                  }
                  onChange={(
                    event
                  ) =>
                    setContacts(
                      (prev) => ({
                        ...prev,
                        fontFamily:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                >
                  {AVAILABLE_FONTS.map(
                    (
                      font
                    ) => (
                      <option
                        key={
                          font.value
                        }
                        value={
                          font.value
                        }
                      >
                        {
                          font.label
                        }
                      </option>
                    )
                  )}

                  {customFonts.map(
                    (
                      font
                    ) => (
                      <option
                        key={`custom-contacts-${font.id}`}
                        value={
                          font.name
                        }
                      >
                        {
                          font.name
                        }{" "}
                        — свой шрифт
                      </option>
                    )
                  )}
                </select>

                <small>
                  Этот шрифт будет
                  использоваться
                  в блоках контактов.
                </small>
              </div>
            </div>
          </section>
        )}

        {/* =====================================
            HOME
        ===================================== */}

        {section === "home" && (
          <section
            className={
              styles.editor
            }
          >
            <div
              className={
                styles.editorHeader
              }
            >
              <div>
                <p
                  className={
                    styles.editorLabel
                  }
                >
                  Секция 03
                </p>

                <h2>
                  Главная страница
                </h2>
              </div>
            </div>

            <div
              className={
                styles.form
              }
            >
              <div
                className={
                  styles.field
                }
              >
                <label>
                  Маленькая надпись
                </label>

                <input
                  value={
                    home.label
                  }
                  onChange={(
                    event
                  ) =>
                    setHome(
                      (prev) => ({
                        ...prev,
                        label:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Художник"
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Заголовок
                </label>

                <input
                  value={
                    home.title
                  }
                  onChange={(
                    event
                  ) =>
                    setHome(
                      (prev) => ({
                        ...prev,
                        title:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Кристина Маркина"
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Описание
                </label>

                <textarea
                  value={
                    home.description
                  }
                  onChange={(
                    event
                  ) =>
                    setHome(
                      (prev) => ({
                        ...prev,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  rows={7}
                  placeholder="Описание на главной странице..."
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Текст кнопки
                </label>

                <input
                  value={
                    home.buttonText
                  }
                  onChange={(
                    event
                  ) =>
                    setHome(
                      (prev) => ({
                        ...prev,
                        buttonText:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Смотреть каталог"
                />
              </div>

              {/* ЦВЕТ НАДПИСИ */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Цвет маленькой
                  надписи
                </label>

                <div
                  className={
                    styles.colorRow
                  }
                >
                  <input
                    type="color"
                    value={
                      home.homeLabelColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeLabelColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      home.homeLabelColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeLabelColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="#f8f7f3"
                  />
                </div>
              </div>

              {/* ЦВЕТ ЗАГОЛОВКА */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Цвет заголовка
                </label>

                <div
                  className={
                    styles.colorRow
                  }
                >
                  <input
                    type="color"
                    value={
                      home.homeTitleColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeTitleColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      home.homeTitleColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeTitleColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="#f8f7f3"
                  />
                </div>
              </div>

              {/* ЦВЕТ ОПИСАНИЯ */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Цвет описания
                </label>

                <div
                  className={
                    styles.colorRow
                  }
                >
                  <input
                    type="color"
                    value={
                      home.homeDescriptionColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeDescriptionColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      home.homeDescriptionColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeDescriptionColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="#f8f7f3"
                  />
                </div>
              </div>

              {/* ЦВЕТ КНОПКИ */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Цвет кнопки
                </label>

                <div
                  className={
                    styles.colorRow
                  }
                >
                  <input
                    type="color"
                    value={
                      home.homeButtonColor ||
                      "#292722"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeButtonColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      home.homeButtonColor ||
                      "#292722"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeButtonColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="#292722"
                  />
                </div>
              </div>

              {/* ЦВЕТ ТЕКСТА КНОПКИ */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Цвет текста кнопки
                </label>

                <div
                  className={
                    styles.colorRow
                  }
                >
                  <input
                    type="color"
                    value={
                      home.homeButtonTextColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeButtonTextColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      home.homeButtonTextColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeButtonTextColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="#f8f7f3"
                  />
                </div>
              </div>

              {/* ШРИФТ ГЛАВНОЙ */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Шрифт главной страницы
                </label>

                <select
                  value={
                    home.homeFontFamily
                  }
                  onChange={(
                    event
                  ) =>
                    setHome(
                      (prev) => ({
                        ...prev,
                        homeFontFamily:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                >
                  {AVAILABLE_FONTS.map(
                    (
                      font
                    ) => (
                      <option
                        key={
                          font.value
                        }
                        value={
                          font.value
                        }
                      >
                        {
                          font.label
                        }
                      </option>
                    )
                  )}

                  {customFonts.map(
                    (
                      font
                    ) => (
                      <option
                        key={`custom-home-${font.id}`}
                        value={
                          font.name
                        }
                      >
                        {
                          font.name
                        }{" "}
                        — свой шрифт
                      </option>
                    )
                  )}
                </select>

                <small>
                  Шрифт будет
                  применён ко всему
                  тексту главной
                  страницы.
                </small>
              </div>

              {/* РАСПОЛОЖЕНИЕ */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Расположение текста
                </label>

                <div
                  className={
                    styles.positionOptions
                  }
                >
                  <button
                    type="button"
                    className={
                      home.homeLayout ===
                      "left"
                        ? styles.positionOptionActive
                        : styles.positionOption
                    }
                    onClick={() =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeLayout:
                            "left",
                        })
                      )
                    }
                  >
                    <span
                      className={
                        styles.positionIcon
                      }
                    >
                      ←
                    </span>

                    <span>
                      Слева
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      home.homeLayout ===
                      "right"
                        ? styles.positionOptionActive
                        : styles.positionOption
                    }
                    onClick={() =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeLayout:
                            "right",
                        })
                      )
                    }
                  >
                    <span
                      className={
                        styles.positionIcon
                      }
                    >
                      →
                    </span>

                    <span>
                      Справа
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      home.homeLayout ===
                      "center"
                        ? styles.positionOptionActive
                        : styles.positionOption
                    }
                    onClick={() =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          homeLayout:
                            "center",
                        })
                      )
                    }
                  >
                    <span
                      className={
                        styles.positionIcon
                      }
                    >
                      ↔
                    </span>

                    <span>
                      По центру
                    </span>
                  </button>
                </div>

                <small>
                  Если фотография справа
                  включена, текст
                  автоматически
                  располагается слева.
                </small>
              </div>

              {/* ИЗОБРАЖЕНИЯ */}

              <div
                className={
                  styles.homeImages
                }
              >
                <div
                  className={
                    styles.imageEditor
                  }
                >
                  <label>
                    Фотография справа
                  </label>

                  <div
                    className={
                      styles.imagePreview
                    }
                  >
                    {home.heroImage ? (
                      <img
                        src={
                          home.heroImage
                        }
                        alt="Главная"
                      />
                    ) : (
                      <div
                        className={
                          styles.noImage
                        }
                      >
                        Фотография
                        отключена
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      styles.imageButtons
                    }
                  >
                    <label
                      className={
                        styles.secondaryButton
                      }
                    >
                      {uploading ===
                      "hero"
                        ? "Загрузка..."
                        : "Заменить"}

                      <input
                        type="file"
                        accept="image/*"
                        disabled={
                          uploading ===
                          "hero"
                        }
                        onChange={(
                          event
                        ) =>
                          handleImageUpload(
                            event,
                            "hero"
                          )
                        }
                      />
                    </label>

                    {home.heroImage && (
                      <button
                        type="button"
                        className={
                          styles.dangerButton
                        }
                        onClick={
                          removeHeroImage
                        }
                      >
                        Убрать фотографию
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={
                    styles.imageEditor
                  }
                >
                  <label>
                    Фоновая фотография
                  </label>

                  <div
                    className={
                      styles.imagePreview
                    }
                  >
                    {home.backgroundImage ? (
                      <img
                        src={
                          home.backgroundImage
                        }
                        alt="Фон главной"
                      />
                    ) : (
                      <div
                        className={
                          styles.noImage
                        }
                      >
                        Фоновая
                        фотография
                        отключена
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      styles.imageButtons
                    }
                  >
                    <label
                      className={
                        styles.secondaryButton
                      }
                    >
                      {uploading ===
                      "background"
                        ? "Загрузка..."
                        : "Заменить"}

                      <input
                        type="file"
                        accept="image/*"
                        disabled={
                          uploading ===
                          "background"
                        }
                        onChange={(
                          event
                        ) =>
                          handleImageUpload(
                            event,
                            "background"
                          )
                        }
                      />
                    </label>

                    {home.backgroundImage && (
                      <button
                        type="button"
                        className={
                          styles.dangerButton
                        }
                        onClick={
                          removeBackgroundImage
                        }
                      >
                        Убрать фон
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ФОН */}

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Цвет фона
                </label>

                <div
                  className={
                    styles.overlayField
                  }
                >
                  <div
                    className={
                      styles.overlayHeader
                    }
                  >
                    <div>
                      <label>
                        Затемнение
                        фоновой фотографии
                      </label>

                      <small>
                        0% — без затемнения,
                        100% — полностью
                        затемнено.
                      </small>
                    </div>

                    <strong>
                      {
                        home.backgroundOverlay
                      }
                      %
                    </strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={
                      home.backgroundOverlay ??
                      0
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          backgroundOverlay:
                            Number(
                              event
                                .target
                                .value
                            ),
                        })
                      )
                    }
                    className={
                      styles.range
                    }
                  />

                  <div
                    className={
                      styles.rangeLabels
                    }
                  >
                    <span>
                      0%
                    </span>

                    <span>
                      50%
                    </span>

                    <span>
                      100%
                    </span>
                  </div>
                </div>

                <div
                  className={
                    styles.colorRow
                  }
                >
                  <input
                    type="color"
                    value={
                      home.backgroundColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          backgroundColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      home.backgroundColor ||
                      "#f8f7f3"
                    }
                    onChange={(
                      event
                    ) =>
                      setHome(
                        (prev) => ({
                          ...prev,
                          backgroundColor:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="#f8f7f3"
                  />
                </div>

                <small>
                  Используется,
                  когда фоновая
                  фотография отключена.
                </small>
              </div>
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}