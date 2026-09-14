import React, { useEffect, useState } from "react";
import api from "../api/api";
import logoKicpaa from "../assets/KicpaaShot.png";
import logoKicpaaNobg from "../assets/KicpaaNobg.png";
import LoadingCanvas from "../components/LoadingCanvas";
import ShareModal from "../components/ShareModal";
const backendOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");
const defaultTextColor = "#ffffff";
const defaultBoxColor = "#64748b";
const toBackendUrl = (url) =>
  !url || url.startsWith("http") ? url : `${backendOrigin}${url}`;

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [error, setError] = useState("");
  const [themeImage, setThemeImage] = useState("");
  const [textColor, setTextColor] = useState(defaultTextColor);
  const [boxColor, setBoxColor] = useState(defaultBoxColor);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const [linksResponse, settingsResponse, themesResponse] =
          await Promise.all([
            api.get("/add-links"),
            api.get("/design-settings"),
            api.get("/addThemes"),
          ]);
        const links = Array.isArray(linksResponse.data)
          ? linksResponse.data
          : (linksResponse.data?.data ?? []);
        const settings = settingsResponse.data ?? {};
        const themes = Array.isArray(themesResponse.data)
          ? themesResponse.data
          : (themesResponse.data?.data ?? []);
        const selectedTheme = themes.find(
          (theme) => String(theme.id) === String(settings.theme),
        );

        setData(links);
        setThemeImage(toBackendUrl(selectedTheme?.themeImageUrl));
        setTextColor(settings.textColor || defaultTextColor);
        setBoxColor(settings.boxColor || defaultBoxColor);
      } catch (error) {
        console.error("Error fetching links:", error);
        setError(
          "Unable to load the preview. Please make sure the API is running.",
        );
      } finally {
        setIsDataReady(true);
      }
    };

    fetchPreview();
  }, []);
  if (!showPreview) {
    return (
      <LoadingCanvas
        logo={logoKicpaaNobg}
        isDataReady={isDataReady}
        onComplete={() => setShowPreview(true)}
      />
    );
  }
  return (
    <main
      className="public-preview"
      style={{
        "--text-color": textColor,
        "--box-color": boxColor,
        backgroundImage: themeImage
          ? `linear-gradient(rgba(10, 20, 42, 0.25), rgba(10, 20, 42, 0.25)), url(${themeImage})`
          : undefined,
      }}
    >
      <button type="button" className="share-trigger" onClick={() => setIsShareOpen(true)}>
        <span aria-hidden="true"><i class="fa-solid fa-share-nodes"></i> </span> 
      </button>
      <section className="mt-5" aria-labelledby="profile-name">
        <div className="flex justify-center">
          <img src={logoKicpaa} alt="Logo" className="w-20" />
        </div>
        <h3 className="text-center text-xl font-bold mt-4 DmSans">
          Kampuchea Institute of Certified Public Accountants and Auditors
        </h3>
        <p className="text-center DmSans text-md mt-1">Recognized. Trusted.</p>
      </section>
      <section className="mt-10 pb-8" aria-labelledby="links-section">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 DmSans">
            No links available.
          </p>
        ) : (
          <div className="flex flex-col poppins gap-4 w-[90%] m-auto">
            {data.map((link) => (
              <div
                key={link.id}
                className="preview-link-card bg-white/25 backdrop-blur-md p-4 rounded-full shadow-md
                           transition-all duration-300 ease-out
                           hover:bg-white/35 hover:shadow-xl hover:-translate-y-1
                           hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: boxColor }}
              >
                <div className="relative flex min-h-13 items-center justify-center text-center">
                  <img
                    src={link.image_url || logoKicpaa}
                    alt={link.title}
                    className={`absolute left-0 h-13 w-13 rounded-full object-cover ${
                      !link.image_url ? "hidden" : ""
                    }`}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.classList.add("hidden");
                    }}
                  />
                  <a
                    href={link.URL}
                    className="w-full px-14 text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h2
                      className="preview-link-caption text-xl Poppins font-semibold"
                      style={{ color: textColor }}
                    >
                      {link.title}
                    </h2>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </main>
  );
};

export default DataDisplay;
