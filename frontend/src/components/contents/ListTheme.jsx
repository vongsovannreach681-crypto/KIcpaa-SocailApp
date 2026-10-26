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

  return `${backendOrigin}/storage/${theme.themes}`;
};

const ListTheme = ({
  defaultTheme,
  selectedThemeId,
  onThemeSelect,
  onAddTheme,
  onThemeDeleted,
}) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingThemeId, setDeletingThemeId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

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

  const handleDeleteTheme = async (theme) => {
    if (!window.confirm(`Delete the "${theme.themeName}" theme? This cannot be undone.`)) {
      return;
    }

    setDeletingThemeId(String(theme.id));
    setDeleteError("");

    try {
      await api.delete(`/addThemes/${theme.id}`);
      setThemes((currentThemes) =>
        currentThemes.filter((currentTheme) => String(currentTheme.id) !== String(theme.id)),
      );
      await onThemeDeleted?.(theme);
    } catch (error) {
      console.error("Error deleting theme:", error);
      setDeleteError("Theme could not be deleted. Please try again.");
    } finally {
      setDeletingThemeId(null);
    }
  };

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
      {deleteError && (
        <p className="theme-picker-empty text-red-600" role="alert">
          {deleteError}
        </p>
      )}
      {allThemes.length === 0 ? (
        <p className="theme-picker-empty">No themes available yet.</p>
      ) : (
        <div className="theme-picker-grid">
          {allThemes.map((theme) => {
            const selected = selectedThemeId === theme.id;
            const imageUrl = themeImageUrl(theme);
            const deletable = String(theme.id) !== String(defaultTheme?.id);
            const deleting = deletingThemeId === String(theme.id);

            return (
              <div key={theme.id} className="relative min-w-0">
                <button
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
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement.querySelector('.theme-picker-default-preview');
                          if (fallback) fallback.style.display = 'grid';
                        }}
                      />
                    ) : null}
                    <span
                      className="theme-picker-default-preview"
                      style={{ display: imageUrl ? 'none' : 'grid' }}
                    >
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                    {selected && (
                      <span className="theme-picker-check">&#10003;</span>
                    )}
                  </span>
                  <span className="theme-picker-name">{theme.themeName}</span>
                </button>
                {deletable && (
                  <button
                    type="button"
                    className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleDeleteTheme(theme)}
                    disabled={deleting}
                    aria-label={`Delete ${theme.themeName} theme`}
                    title={`Delete ${theme.themeName} theme`}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ListTheme;
