import { useEffect, useState } from "react";
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
  const [setting, setSetting] = useState(null);
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const [
          linksResponse,
          settingsResponse,
          themesResponse,
          mySettingsResponse,
        ] = await Promise.all([
          api.get("/add-links"),
          api.get("/design-settings"),
          api.get("/addThemes"),
          api.get("/my-settings"),
        ]);
        const links = Array.isArray(linksResponse.data)
          ? linksResponse.data
          : (linksResponse.data?.data ?? []);
        const settings = settingsResponse.data ?? {};
        const mySettings = Array.isArray(mySettingsResponse.data)
          ? mySettingsResponse.data
          : (mySettingsResponse.data?.data ?? []);
        setSetting(mySettings[0] ?? null);
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

  const handleLinkView = async (linkId) => {
    try {
      const response = await api.post(`/add-links/${linkId}/view`);
      const updatedLink = response.data;

      setData((links) =>
        links.map((link) =>
          link.id === updatedLink.id ? updatedLink : link,
        ),
      );
    } catch (error) {
      // The visitor should still be able to open the destination if tracking fails.
      console.error("Error recording link view:", error);
    }
  };

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
      <button
        type="button"
        className="share-trigger"
        onClick={() => setIsShareOpen(true)}
      >
        <span aria-hidden="true">
          <i className="fa-solid fa-share-nodes"></i>{" "}
        </span>
      </button>
     
      <section className="-mt-12" aria-labelledby="profile-name">
        {/* main content */}
        {setting && (
          <div>
            <img
              src={setting.image_url || logoKicpaa}
              alt="Logo"
              className="h-25 m-auto mt-20"
            />
            <h3
              className="preview-profile-title  text-center DmSans mt-5 font-semibold"
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
                    onClick={() => handleLinkView(link.id)}
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
      {/* spacing */}
      <div className='mb-30'></div>
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        <h2 className='m-auto text-center text-gray-300 font-semiblod text-sm'>Developed by KICPAA IT team</h2>
    </main>
  );
};

export default DataDisplay;
