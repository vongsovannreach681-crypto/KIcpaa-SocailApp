import React, { useEffect, useState } from "react";
import Header from "../components/navbar/Header";
import Preview from "../components/contents/Preview";
import api from "../api/api";

const backendOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

const PreviewsPage = () => {
  const [device, setDevice] = useState("phone");
  const [themeImage, setThemeImage] = useState(undefined);
  const [themeName, setThemeName] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#64748b");

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const [settingsResponse, themesResponse] = await Promise.all([
          api.get("/design-settings"),
          api.get("/addThemes"),
        ]);
        const savedTheme = (themesResponse.data ?? []).find(
          (theme) => String(theme.id) === String(settingsResponse.data.theme),
        );
        const imageUrl = savedTheme?.themeImageUrl;

        setThemeName(savedTheme?.themeName || "");

        setThemeImage(
          imageUrl
            ? imageUrl.startsWith("http")
              ? imageUrl
              : `${backendOrigin}${imageUrl}`
            : undefined,
        );
        setTextColor(settingsResponse.data.textColor || "#ffffff");
        setBoxColor(settingsResponse.data.boxColor || "#64748b");
      } catch (error) {
        console.error("Error loading saved preview theme:", error);
      }
    };

    loadSavedTheme();
  }, []);

  return (
    <>
      <Header />
      <div className="previews-page">
        <div className="preview-toolbar" aria-label="Preview device selector">
          {[
            ["laptop", "Laptop", "L"],
            ["tablet", "Tablet", "T"],
            ["phone", "Phone", "P"],
          ].map(([deviceType, label, icon]) => (
            <button
              key={deviceType}
              type="button"
              className={device === deviceType ? "is-active" : ""}
              onClick={() => setDevice(deviceType)}
              aria-pressed={device === deviceType}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </button>
          ))}
        </div>
        <Preview
          device={device}
          themeImage={themeImage}
          themeName={themeName}
          textColor={textColor}
          boxColor={boxColor}
        />
      </div>
    </>
  );
};

export default PreviewsPage;
