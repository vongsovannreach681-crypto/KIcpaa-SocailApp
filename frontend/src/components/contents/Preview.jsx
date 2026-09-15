import React, { useEffect, useState } from "react";
import logo from "../../assets/KicpaaShot-03.png";
import api from "../../api/api";
import Loading from "../loadings/Loading";

const stars = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  style: {
    "--star-x": `${(index * 37) % 100}%`,
    "--star-y": `${(index * 61) % 100}%`,
    "--star-size": `${index % 5 === 0 ? 3 : 1 + (index % 2)}px`,
    "--star-delay": `${(index % 9) * -0.45}s`,
    "--star-duration": `${2.6 + (index % 6) * 0.45}s`,
  },
}));

const Preview = ({
  links,
  device = "phone",
  themeImage,
  themeName,
  textColor = "#ffffff",
  boxColor = "#64748b",
  onLinkViewed,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setting, setSetting] = useState(null);

  useEffect(() => {
    const getPreviewData = async () => {
      try {
        const [settingsRes, linksRes] = await Promise.all([
          api.get("/my-settings"),
          links === undefined ? api.get("/add-links") : Promise.resolve(null),
        ]);

        const settings = Array.isArray(settingsRes.data)
          ? settingsRes.data
          : (settingsRes.data?.data ?? []);

        setSetting(settings[0] ?? null);

        if (linksRes) {
          const linkData = Array.isArray(linksRes.data)
            ? linksRes.data
            : (linksRes.data?.data ?? []);
          setData(linkData);
        }
      } catch (err) {
        console.error("Error fetching preview data:", err);
        setError("Unable to load preview data.");
      } finally {
        setLoading(false);
      }
    };

    getPreviewData();

    const refreshInterval = setInterval(getPreviewData, 3000);

    return () => clearInterval(refreshInterval);
  }, [links]);

  const previewData = links ?? data;

  const handleLinkView = async (linkId) => {
    try {
      const response = await api.post(`/add-links/${linkId}/view`);
      const updatedLink = response.data;

      setData((currentLinks) =>
        currentLinks.map((link) =>
          link.id === updatedLink.id ? updatedLink : link,
        ),
      );
      onLinkViewed?.(updatedLink);
    } catch (error) {
      console.error("Error recording link view:", error);
    }
  };

  // loading mentain

  if (loading) {
    return <Loading label="Loading preview..." fullPage />;
  }

  return (
    <>
      <main
        className={`preview-page preview-device-${device} preview-theme-${(themeName || "default-stars").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        style={{
          "--preview-theme-image": themeImage ? `url(${themeImage})` : "none",
          "--preview-text-color": textColor,
          "--preview-box-color": boxColor,
        }}
      >
        <div className="preview-device-frame">
          <div
            className="preview-side-button preview-side-button-top"
            aria-hidden="true"
          />
          <div
            className="preview-side-button preview-side-button-middle"
            aria-hidden="true"
          />
          <div
            className="preview-side-button preview-side-button-bottom"
            aria-hidden="true"
          />
          <div className="preview-screen">
            <div className="preview-island" aria-hidden="true">
              <span />
            </div>
            <div className="preview-stars" aria-hidden="true">
              {stars.map((star) => (
                <span
                  key={star.id}
                  className="preview-star"
                  style={star.style}
                />
              ))}
            </div>
            <div className="preview-glow" aria-hidden="true" />
            <div className="preview-decoration" aria-hidden="true">
              <span className="preview-decoration-ring" />
              <span className="preview-decoration-line" />
              <span className="preview-decoration-diamond" />
              <span className="preview-decoration-dots" />
            </div>

            {/* container */}

            <section>
              {/* main content */}
              {setting && (
                <div>
                  <img
                    src={setting.image_url || logo}
                    alt="Logo"
                    className="h-25 m-auto mt-20"
                  />
                  <h3
                    className="preview-profile-title text-xl text-center DmSans mt-5 font-semibold"
                    style={{ color: textColor }}
                  >
                    {setting.title}
                  </h3>
                  <p
                    className="preview-profile-subtitle text-lg text-center DmSans mt-2"
                    style={{ color: textColor }}
                  >
                    {setting.short_title}
                  </p>
                </div>
              )}
              {!setting && error && (
                <p className="mt-20 text-center text-sm text-red-200">{error}</p>
              )}
            </section>

            {/* list Links */}

            <section className="mt-10 pb-8">
              <div className="flex flex-col gap-4 w-[90%] m-auto">
                {previewData.map((item) => (
                  <div
                    key={item.id}
                    className="preview-link-card bg-white/25 backdrop-blur-md p-4 rounded-full shadow-md
             transition-all duration-300 ease-out
             hover:bg-white/35 hover:shadow-xl hover:-translate-y-1
             hover:scale-[1.02] cursor-pointer"
                    style={{ backgroundColor: boxColor }}
                  >
                    <div className="relative flex min-h-13 items-center justify-center text-center">
                      <img
                        src={item.image_url || logo}
                        alt={item.title}
                        className={`absolute left-0 h-13 w-13 rounded-full object-cover ${
                          !item.image_url ? "hidden" : ""
                        }`}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.classList.add("hidden");
                        }}
                      />
                      <a
                        href={item.URL}
                        onClick={() => handleLinkView(item.id)}
                        className="w-full px-14 text-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h2
                          className="preview-link-caption text-xl Poppins font-semibold"
                          style={{ color: textColor }}
                        >
                          {item.title}
                        </h2>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <div className="preview-laptop-base" aria-hidden="true" />
      </main>
    </>
  );
};

export default Preview;
