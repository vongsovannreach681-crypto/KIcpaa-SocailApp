import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import logoKicpaa from "../assets/KicpaaShot.png";
import logoKicpaaNobg from "../assets/KicpaaNobg.png";
import LoadingCanvas from "../components/LoadingCanvas";
import ShareModal from "../components/ShareModal";
import LinkCard from "../components/LinkCard";
const backendOrigin = api.defaults.baseURL.replace(/\/api\/?$/, "");
const toBackendUrl = (url) => {
  if (!url) return null;
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${backendOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const getSmartIcon = (title = "", url = "") => {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("youtube") || text.includes("youtu.be")) {
    return { icon: "fa-brands fa-youtube", color: "#ff5d68" };
  }
  if (text.includes("telegram") || text.includes("t.me")) {
    return { icon: "fa-brands fa-telegram", color: "#48b8f4" };
  }
  if (text.includes("facebook") || text.includes("fb.com") || text.includes("fb.me")) {
    return { icon: "fa-brands fa-facebook-f", color: "#2563eb" };
  }
  if (text.includes("linkedin")) {
    return { icon: "fa-brands fa-linkedin-in", color: "#55a7ff" };
  }
  if (text.includes("tiktok")) {
    return { icon: "fa-brands fa-tiktok", color: "#ffffff" };
  }
  if (text.includes("instagram") || text.includes("instagr.am")) {
    return { icon: "fa-brands fa-instagram", color: "#ec4899" };
  }
  if (text.includes("twitter") || text.includes("x.com")) {
    return { icon: "fa-brands fa-x-twitter", color: "#ffffff" };
  }
  if (text.includes("whatsapp")) {
    return { icon: "fa-brands fa-whatsapp", color: "#22c55e" };
  }
  if (text.includes("member") || text.includes("directory")) {
    return { icon: "fa-solid fa-address-book", color: "#d4af37" };
  }
  if (/\bapp\b/.test(text) || text.includes("mobile")) {
    return { icon: "fa-solid fa-mobile-screen-button", color: "#d4af37" };
  }
  if (text.includes("career") || text.includes("job") || text.includes("work") || text.includes("recruit")) {
    return { icon: "fa-solid fa-briefcase", color: "#10b981" };
  }
  if (text.includes("website") || text.includes("web") || text.includes("portal") || text.includes("online")) {
    return { icon: "fa-solid fa-globe", color: "#06b6d4" };
  }
  if (text.includes("phone") || text.includes("call") || text.includes("tel") || text.includes("hotline")) {
    return { icon: "fa-solid fa-phone", color: "#22c55e" };
  }
  if (text.includes("mail") || text.includes("email") || text.includes("inbox")) {
    return { icon: "fa-solid fa-envelope", color: "#f59e0b" };
  }
  if (text.includes("map") || text.includes("location") || text.includes("address")) {
    return { icon: "fa-solid fa-location-dot", color: "#ef4444" };
  }
  if (text.includes("book") || text.includes("study") || text.includes("course") || text.includes("education") || text.includes("academy") || text.includes("cpd")) {
    return { icon: "fa-solid fa-graduation-cap", color: "#8b5cf6" };
  }
  if (text.includes("news") || text.includes("article") || text.includes("press")) {
    return { icon: "fa-solid fa-newspaper", color: "#f97316" };
  }
  if (text.includes("doc") || text.includes("pdf") || text.includes("file") || text.includes("form")) {
    return { icon: "fa-solid fa-file-lines", color: "#6366f1" };
  }
  return null;
};

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [error, setError] = useState("");
  const [themeImage, setThemeImage] = useState("");
  const [themeName, setThemeName] = useState("");
  const [setting, setSetting] = useState(null);
  const [lightMode, setLightMode] = useState(
    () => window.localStorage.getItem("kicpaa-theme") === "light",
  );
  const headerRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem("kicpaa-theme", lightMode ? "light" : "dark");
  }, [lightMode]);

  useEffect(() => {
    const updateScroll = () => {
      headerRef.current?.classList.toggle("is-scrolled", window.scrollY > 24);
      profileRef.current?.style.setProperty("--scroll-shift", `${Math.min(window.scrollY * -0.08, 24)}px`);
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);
  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const [settingsResponse, themesResponse, mySettingsResponse] = await Promise.all([
          api.get("/design-settings"),
          api.get("/addThemes"),
          api.get("/my-settings"),
        ]);
        if (!active) return;
        const settings = settingsResponse.data ?? {};
        const mySettings = Array.isArray(mySettingsResponse.data)
          ? mySettingsResponse.data
          : (mySettingsResponse.data?.data ?? []);
        const themes = Array.isArray(themesResponse.data)
          ? themesResponse.data
          : (themesResponse.data?.data ?? []);
        const selectedTheme = themes.find(
          (theme) => String(theme.id) === String(settings.theme),
        );

        setSetting(mySettings[0] ?? null);
        setThemeImage(toBackendUrl(selectedTheme?.themeImageUrl));
        setThemeName(selectedTheme?.themeName || "");
      } catch (error) {
        console.error("Error fetching display settings:", error);
      }
    };

    const fetchLinks = async () => {
      try {
        const response = await api.get("/add-links");
        if (!active) return;
        const links = Array.isArray(response.data)
          ? response.data
          : (response.data?.data ?? []);
        setData(links);
      } catch (error) {
        console.error("Error fetching links:", error);
        if (active) {
          setError("Unable to load the preview. Please make sure the API is running.");
        }
      } finally {
        if (active) setIsDataReady(true);
      }
    };

    fetchSettings();
    fetchLinks();
    return () => { active = false; };
  }, []);

  const handleLinkView = async (linkId) => {
    try {
      await api.post(`/add-links/${linkId}/view`);
    } catch (error) {
      // The visitor should still be able to open the destination if tracking fails.
      console.error("Error recording link view:", error);
    }
  };

  const moveShareButton = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
    event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
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
      className="hub-page"
      data-theme={lightMode ? "light" : "dark"}
      style={{ "--hub-wallpaper": themeImage ? `url("${themeImage}")` : "none" }}
    >
      <div className="hub-aurora" aria-hidden="true">
        <span className="aurora-blob aurora-blob-one" />
        <span className="aurora-blob aurora-blob-two" />
        <span className="aurora-blob aurora-blob-three" />
        <span className="hub-particle particle-one" />
        <span className="hub-particle particle-two" />
        <span className="hub-particle particle-three" />
        <span className="hub-particle particle-four" />
        <span className="hub-grain" />
      </div>
      <header ref={headerRef} className="hub-topbar">
        <div className="hub-top-actions">
          <button
            type="button"
            className="hub-share-button"
            onClick={() => setIsShareOpen(true)}
            onPointerMove={moveShareButton}
            onPointerLeave={(event) => { event.currentTarget.style.transform = "translate(0, 0)"; }}
            aria-label="Share KICPAA links"
          >
            <i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" />
            <span>Share</span>
          </button>
        </div>
      </header>

      <div className=" -mt-10" id="home">
        <section ref={profileRef} className="hub-profile" aria-labelledby="profile-name">
          <div className="">
            <span className="logo-aura" aria-hidden="true" />
            <img
              className="w-[25%] m-auto mb-5"
              src={toBackendUrl(setting?.image_url) || logoKicpaa}
              alt="KICPAA logo"
              fetchPriority="high"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = logoKicpaa;
              }}
            />
          </div>
          <h1 id="profile-name" className="hub-title">
            {(setting?.title || "Kampuchea Institute of Certified Public Accountants and Auditors")
              .split(/\s+/)
              .map((word, index) => <span key={`${word}-${index}`} style={{ "--word-index": index }}>{word}&nbsp;</span>)}
          </h1>
          <p className="hub-tagline">{setting?.short_title || "Recognized. Trusted."}</p>
          {error && <p className="hub-error" role="status">{error}</p>}
          {themeName && <p className="hub-theme-label">{""}</p>}
        </section>

        <section className="hub-links-section" aria-labelledby="links-heading">
          <div className="hub-section-heading">
            <span className="gold-rule" />
            <h2 id="links-heading">Connect with KICPAA</h2>
            <span className="gold-rule" />
          </div>
          {data.length === 0 ? (
            <p className="hub-empty">No links available.</p>
          ) : (
            <div className="hub-grid">
              {data.map((link, index) => {
                const smartIcon = getSmartIcon(link.title, link.URL);
                return (
                  <LinkCard
                    key={link.id}
                    link={link}
                    index={index}
                    imageUrl={toBackendUrl(link.image_url)}
                    fallbackImage={logoKicpaa}
                    icon={smartIcon?.icon || "fa-solid fa-arrow-up-right-from-square"}
                    iconColor={smartIcon?.color || "currentColor"}
                    onVisit={handleLinkView}
                  />
                );
              })}
            </div>
          )}
        </section>
        <footer className="hub-footer">
          <span className="footer-line" />
          <p>Developed by <strong>KICPAA IT team</strong></p>
        </footer>
      </div>
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </main>
  );
};

export default DataDisplay;
