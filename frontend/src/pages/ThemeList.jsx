import React, { useEffect, useRef, useState } from "react";
import Header from "../components/navbar/Header";
import Display from "../components/contents/Display";
import ListTheme from "../components/contents/ListTheme";
import AddThemeModal from "../components/Forms/AddThemeModal";
import api from "../api/api";

const backendOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

const resolveThemeImage = (theme) => {
  if (!theme?.themeImageUrl && !theme?.themeImage) return undefined;

  const url = theme.themeImageUrl || theme.themeImage;
  return url.startsWith("http")
    ? url
    : `${backendOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const ThemeList = () => {
  const defaultTheme = { id: "default-stars", themeName: "Default Stars" };
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#64748b");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveMessageType, setSaveMessageType] = useState("success");
  const colorTimeouts = useRef({});

  useEffect(() => {
    return () => {
      Object.values(colorTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!saveMessage) return;
    const timer = setTimeout(() => setSaveMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [saveMessage]);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const [settingsResponse, themesResponse] = await Promise.all([
          api.get("/design-settings"),
          api.get("/addThemes"),
        ]);
        const savedId = String(settingsResponse.data.theme);
        const savedTheme = (themesResponse.data ?? []).find(
          (theme) => String(theme.id) === savedId,
        );
        setSelectedTheme(savedTheme ?? defaultTheme);
        setTextColor(settingsResponse.data.textColor || "#ffffff");
        setBoxColor(settingsResponse.data.boxColor || "#64748b");
      } catch (error) {
        console.error("Error loading saved theme:", error);
      }
    };

    loadSavedTheme();
  }, []);

  const handleThemeSelect = async (theme) => {
    setSelectedTheme(theme);
    setSaveMessage("");

    try {
      await api.patch("/design-settings", { theme: String(theme.id) });
      setSaveMessageType("success");
      setSaveMessage("Theme saved successfully.");
    } catch (error) {
      console.error("Error saving selected theme:", error);
      setSaveMessageType("error");
      setSaveMessage("Theme could not be saved.");
    }
  };

  const handleThemeDeleted = async (theme) => {
    if (String(selectedTheme?.id) !== String(theme.id)) {
      setSaveMessageType("success");
      setSaveMessage("Theme deleted successfully.");
      return;
    }

    setSelectedTheme(defaultTheme);
    try {
      await api.patch("/design-settings", { theme: String(defaultTheme.id) });
      setSaveMessageType("success");
      setSaveMessage("Theme deleted. Default theme selected.");
    } catch (error) {
      console.error("Error selecting default theme after deletion:", error);
      setSaveMessageType("error");
      setSaveMessage("Theme deleted, but the default theme could not be saved.");
    }
  };

  const saveColor = (field, value, setter) => {
    setter(value);

    if (colorTimeouts.current[field]) {
      clearTimeout(colorTimeouts.current[field]);
    }

    colorTimeouts.current[field] = setTimeout(async () => {
      try {
        await api.patch("/design-settings", { [field]: value });
        setSaveMessageType("success");
        setSaveMessage(
          `${field === "boxColor" ? "Link box color" : "Text color"} saved.`,
        );
      } catch (error) {
        console.error("Error saving preview color:", error);
        setSaveMessageType("error");
        setSaveMessage("Color could not be saved.");
      }
    }, 300);
  };

  return (
    <>
      <Header />
      <main className="editor-layout">
        <div className="editor-preview-column">
          <Display
            themeImage={resolveThemeImage(selectedTheme)}
            themeName={selectedTheme?.themeName}
            textColor={textColor}
            boxColor={boxColor}
          />
        </div>
        <div className="editor-links-column">
          <ListTheme
            defaultTheme={defaultTheme}
            selectedThemeId={selectedTheme?.id}
            onThemeSelect={handleThemeSelect}
            onThemeDeleted={handleThemeDeleted}
            onAddTheme={() => setIsThemeModalOpen(true)}
          />
          <section
            className="preview-color-controls poppins"
            aria-label="Preview colors"
          >
            <h2>Customize colors</h2>
            <label>
              <span>Text color</span>
              <input
                type="color"
                value={textColor}
                onChange={(event) =>
                  saveColor("textColor", event.target.value, setTextColor)
                }
              />
            </label>
            <label>
              <span>Link box color</span>
              <input
                type="color"
                value={boxColor}
                onChange={(event) =>
                  saveColor("boxColor", event.target.value, setBoxColor)
                }
              />
            </label>
          </section>
          <AddThemeModal
            isOpen={isThemeModalOpen}
            onClose={() => setIsThemeModalOpen(false)}
          />
        </div>
      </main>
      {saveMessage && (
        <div
          className={`theme-save-toast theme-save-toast-${saveMessageType}`}
          role="status"
        >
          <span aria-hidden="true">
            {saveMessageType === "success" ? "✓" : "!"}
          </span>
          {saveMessage}
          <button
            type="button"
            onClick={() => setSaveMessage("")}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default ThemeList;
