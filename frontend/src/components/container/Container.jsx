import React, { useEffect, useState } from "react";
import Display from "../contents/Display";
import ListData from "../contents/ListData";
import api from "../../api/api";

const backendOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

const resolveThemeImage = (theme) => {
  if (!theme?.themeImageUrl) return undefined;

  return theme.themeImageUrl.startsWith("http")
    ? theme.themeImageUrl
    : `${backendOrigin}${theme.themeImageUrl}`;
};

const Container = () => {
  const [links, setLinks] = useState([]);
  const [themeImage, setThemeImage] = useState(undefined);
  const [themeName, setThemeName] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#64748b");

  useEffect(() => {
    const loadEditorData = async () => {
      try {
        const [linksResponse, settingsResponse, themesResponse] =
          await Promise.all([
            api.get("/add-links"),
            api.get("/design-settings"),
            api.get("/addThemes"),
          ]);
        const payload = Array.isArray(linksResponse.data)
          ? linksResponse.data
          : (linksResponse.data?.data ?? []);
        const savedTheme = (themesResponse.data ?? []).find(
          (theme) => String(theme.id) === String(settingsResponse.data.theme),
        );

        setLinks(payload);
        setThemeImage(resolveThemeImage(savedTheme));
        setThemeName(savedTheme?.themeName || "");
        setTextColor(settingsResponse.data.textColor || "#ffffff");
        setBoxColor(settingsResponse.data.boxColor || "#64748b");
      } catch (error) {
        console.error("Error loading editor data:", error);
      }
    };

    loadEditorData();
  }, []);

  return (
    <main className="editor-layout">
      <div className="editor-preview-column">
        <Display
          links={links}
          themeImage={themeImage}
          themeName={themeName}
          textColor={textColor}
          boxColor={boxColor}
        />
      </div>
      <div className="editor-links-column">
        {/* list data */}
        <ListData links={links} onLinksChange={setLinks} />
      </div>
    </main>
  );
};

export default Container;
