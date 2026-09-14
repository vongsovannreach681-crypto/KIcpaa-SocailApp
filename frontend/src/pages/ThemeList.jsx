import React, { useEffect, useState } from "react";
import Header from "../components/navbar/Header";
import Display from "../components/contents/Display";
import ListTheme from "../components/contents/ListTheme";
import AddThemeModal from "../components/Forms/AddThemeModal";
import api from "../api/api";

const ThemeList = () => {
  const defaultTheme = { id: "default-stars", themeName: "Default Stars" };
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#64748b");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveMessageType, setSaveMessageType] = useState("success");

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

  const saveColor = async (field, value, setter) => {
    setter(value);
    try {
      await api.patch("/design-settings", { [field]: value });
    } catch (error) {
      console.error("Error saving preview color:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="editor-layout">
        <div className="editor-preview-column">
          <Display
            themeImage={selectedTheme?.themeImageUrl}
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
