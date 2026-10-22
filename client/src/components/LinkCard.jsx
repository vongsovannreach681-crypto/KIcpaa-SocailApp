import { useRef } from "react";

const LinkCard = ({ link, imageUrl, fallbackImage, icon, iconColor, index, onVisit }) => {
  const cardRef = useRef(null);
  const hasBrandIcon = icon.startsWith("fa-brands");
  const showImage = imageUrl && !hasBrandIcon;

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    cardRef.current.style.setProperty("--pointer-x", `${x * 100}%`);
    cardRef.current.style.setProperty("--pointer-y", `${y * 100}%`);
    cardRef.current.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
  };

  const resetTilt = () => {
    cardRef.current?.style.setProperty("--tilt-x", "0deg");
    cardRef.current?.style.setProperty("--tilt-y", "0deg");
  };

  const handlePointerDown = (event) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    cardRef.current.style.setProperty("--ripple-x", `${event.clientX - bounds.left}px`);
    cardRef.current.style.setProperty("--ripple-y", `${event.clientY - bounds.top}px`);
    cardRef.current.classList.remove("is-pressed");
    requestAnimationFrame(() => cardRef.current?.classList.add("is-pressed"));
    if (navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <a
      ref={cardRef}
      className={`hub-card${index === 1 ? " hub-card-primary" : ""}`}
      href={link.URL}
      title={link.title}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${link.title}`}
      style={{ "--card-index": index }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerDown={handlePointerDown}
      onClick={() => onVisit(link.id)}
    >
      <span className="hub-card-spotlight" aria-hidden="true" />
      <span className={`hub-card-icon${showImage ? " is-loading" : ""}`} aria-hidden="true">
        {showImage ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={(event) => event.currentTarget.parentElement.classList.remove("is-loading")}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.parentElement.classList.remove("is-loading");
              event.currentTarget.src = fallbackImage;
            }}
          />
        ) : (
          <i className={icon} style={{ color: iconColor }} />
        )}
      </span>
      <span className="hub-card-title">{link.title}</span>
      <span className="hub-card-arrow" aria-hidden="true"><i className="fa-solid fa-arrow-up-right-from-square" /></span>
    </a>
  );
};

export default LinkCard;
