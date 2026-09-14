import React, { useEffect, useState } from "react";
import api from "../../api/api";
import Loading from "../loadings/Loading";

const backendOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");

const themeImageUrl = (theme) => {
  if (!theme.themeImage && !theme.themeImageUrl) return null;

  if (theme.themeImageUrl) {
    return theme.themeImageUrl.startsWith("http")
      ? theme.themeImageUrl
      : `${backendOrigin}${theme.themeImageUrl}`;
  }

  return `${backendOrigin}/storage/${theme.themeImage}`;
};

const ListTheme = ({
  defaultTheme,
  selectedThemeId,
  onThemeSelect,
  onAddTheme,
}) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await api.get("/addThemes");
        setThemes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching themes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  if (loading) {
    return <Loading label="Loading themes..." />;
  }

  const allThemes = [...(defaultTheme ? [defaultTheme] : []), ...themes];

  return (
    <section className="theme-picker" aria-labelledby="theme-picker-title">
      <button type="button" onClick={onAddTheme}>
        <span className="poppins bg-blue-900 px-2 py-2 rounded-sm hover:bg-blue-900 hover:transform-cpu text-white font-bold cursor-pointer">
          Add Theme
        </span>
      </button>
      <div className="theme-picker-heading">
        <br />
        <span className="theme-picker-count poppins text-gray-600">
          {allThemes.length} themes
        </span>
      </div>
      {allThemes.length === 0 ? (
        <p className="theme-picker-empty">No themes available yet.</p>
      ) : (
        <div className="theme-picker-grid">
          {allThemes.map((theme) => {
            const selected = selectedThemeId === theme.id;
            const imageUrl = themeImageUrl(theme);

            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-picker-option ${selected ? "is-selected" : ""}`}
                onClick={() => onThemeSelect?.(theme)}
                aria-pressed={selected}
              >
                <span className="theme-picker-image-wrap">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={theme.themeName}
                      className="theme-picker-image"
                    />
                  ) : (
                    <span className="theme-picker-default-preview">
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                  {selected && (
                    <span className="theme-picker-check">&#10003;</span>
                  )}
                </span>
                <span className="theme-picker-name">{theme.themeName}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ListTheme;
