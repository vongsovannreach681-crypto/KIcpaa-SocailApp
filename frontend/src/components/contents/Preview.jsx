import { useEffect, useState } from "react";
import logo from "../../assets/KicpaaShot-03.png";
import api from "../../api/api";
import { resolveAssetUrl } from "../../api/assetUrl";
import Loading from "../loadings/Loading";

const getSmartIcon = (title = "", url = "") => {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("youtube") || text.includes("youtu.be")) {
    return { icon: "fa-brands fa-youtube", color: "#ef4444" };
  }
  if (text.includes("telegram") || text.includes("t.me")) {
    return { icon: "fa-brands fa-telegram", color: "#0284c7" };
  }
  if (text.includes("facebook") || text.includes("fb.com") || text.includes("fb.me")) {
    return { icon: "fa-brands fa-facebook-f", color: "#2563eb" };
  }
  if (text.includes("linkedin")) {
    return { icon: "fa-brands fa-linkedin-in", color: "#0a66c2" };
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
  const shouldFetchLinks = links === undefined;

  useEffect(() => {
    const getPreviewData = async () => {
      try {
        const [settingsRes, linksRes] = await Promise.all([
          api.get("/my-settings"),
          shouldFetchLinks ? api.get("/add-links") : Promise.resolve(null),
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
  }, [shouldFetchLinks]);

  const previewData = links ?? data;

  const handleCardPointerMove = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--pointer-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * 100}%`);
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 6}deg`);
  };

  const resetCardPointer = (event) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const handleCardPointerDown = (event) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--ripple-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--ripple-y", `${event.clientY - bounds.top}px`);
    card.classList.remove("is-pressed");
    requestAnimationFrame(() => card.classList.add("is-pressed"));
    if (navigator.vibrate) navigator.vibrate(8);
  };

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
        className={`preview-page hub-preview preview-device-${device} preview-theme-${(themeName || "default-stars").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        style={{
          "--preview-theme-image": themeImage ? `url(${themeImage})` : "none",
          "--preview-text-color": textColor,
          "--preview-box-color": boxColor,
          "--hub-preview-text": textColor,
          "--hub-preview-card-color": boxColor,
          "--box-color": boxColor,
          "--text-color": textColor,
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
          <div className="preview-screen hub-preview-screen">
            <div className="preview-island" aria-hidden="true">
              <span />
            </div>
            <div className="hub-preview-topbar">
              <span className="hub-preview-share" aria-label="Share KICPAA links">
                <i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" /> Share
              </span>
            </div>
            <section className="hub-preview-profile">
              <div className="hub-preview-logo-wrap">
                <img
                  src={resolveAssetUrl(setting?.image_url) || logo}
                  alt="KICPAA logo"
                  className="hub-preview-logo"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = logo;
                  }}
                />
              </div>
              <h1 className="hub-preview-title">
                {(setting?.title || "Kampuchea Institute of Certified Public Accountants and Auditors")
                  .split(/\s+/)
                  .map((word, index) => <span key={`${word}-${index}`} style={{ "--word-index": index }}>{word}&nbsp;</span>)}
              </h1>
              <p className="hub-preview-tagline">{setting?.short_title || "Recognized. Trusted."}</p>
              {!setting && error && <p className="hub-preview-error">{error}</p>}
            </section>

            <section className="hub-preview-links">
              <div className="hub-preview-section-heading">
                <span aria-hidden="true" />
                <h2>Connect with KICPAA</h2>
                <span aria-hidden="true" />
              </div>
              {previewData.length === 0 ? (
                <p className="hub-preview-empty">
                  No links available.
                </p>
              ) : (
                <div className="hub-preview-grid">
                  {previewData.map((item, index) => {
                    const smart = getSmartIcon(item.title, item.URL);
                    const imageUrl = resolveAssetUrl(item.image_url);
                    const showImage = imageUrl && !smart?.icon.startsWith("fa-brands");

                    return (
                      <a
                        key={item.id}
                        href={item.URL}
                        onClick={() => handleLinkView(item.id)}
                        className={`hub-preview-card${index === 1 ? " is-primary" : ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.title}
                        aria-label={`Open ${item.title}`}
                        onPointerMove={handleCardPointerMove}
                        onPointerLeave={resetCardPointer}
                        onPointerDown={handleCardPointerDown}
                      >
                        <span className="hub-preview-icon">
                          {showImage ? (
                            <img
                              src={imageUrl}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : smart ? (
                            <i
                              className={smart.icon}
                              style={{ color: smart.color }}
                              aria-hidden="true"
                            />
                          ) : (
                            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                          )}
                        </span>
                        <span className="hub-preview-card-title">{item.title}</span>
                        <span className="hub-preview-arrow" aria-hidden="true"><i className="fa-solid fa-arrow-up-right-from-square" /></span>
                      </a>
                    );
                  })}
                </div>
              )}
            </section>
            <footer className="hub-preview-footer">
              <span aria-hidden="true" />
              <p>Developed by <strong>KICPAA IT team</strong></p>
            </footer>
          </div>
        </div>
        <div className="preview-laptop-base" aria-hidden="true" />
      </main>
    </>
  );
};

export default Preview;
