import React, { useState } from "react";

const Template = ({
  themes,
  backgrounds,
  theme,
  onThemeChange,
  background,
  onBackgroundChange,
}) => {
  const [designType, setDesignType] = useState("themes");

  const renderOptions = (items, selected, onChange, prefix) => (
    <div className="template-grid">
      {items.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`template-option ${isSelected ? "is-selected" : ""}`}
            onClick={() => onChange(item.id)}
            aria-pressed={isSelected}
          >
            <span className={`template-thumbnail ${prefix}-${item.swatch}`}>
              <span />
              <span />
              <span />
              <span />
              {isSelected && (
                <span className="template-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </span>
            <span className="template-name">{item.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      className="template-canvas poppins"
      aria-labelledby="themes-heading"
    >
      <div className="template-heading-row">
        <div>
          <p className="template-kicker">Personalize your page</p>
          <h1 id="themes-heading">Choose a theme</h1>
        </div>
        <span className="template-count">
          {themes.length} themes / {backgrounds.length} backgrounds
        </span>
      </div>
      <div className="template-tabs" role="tablist" aria-label="Page type">
        <button
          className="is-active"
          type="button"
          role="tab"
          aria-selected="true"
        >
          Link in bio
        </button>
        <button type="button" role="tab" aria-selected="false">
          Blog
        </button>
        <button type="button" role="tab" aria-selected="false">
          Shop
        </button>
      </div>
      <div
        className="template-design-tabs"
        role="tablist"
        aria-label="Design options"
      >
        <button
          type="button"
          className={designType === "themes" ? "is-active" : ""}
          onClick={() => setDesignType("themes")}
          role="tab"
          aria-selected={designType === "themes"}
        >
          Themes <span>{themes.length}</span>
        </button>
        <button
          type="button"
          className={designType === "backgrounds" ? "is-active" : ""}
          onClick={() => setDesignType("backgrounds")}
          role="tab"
          aria-selected={designType === "backgrounds"}
        >
          Backgrounds <span>{backgrounds.length}</span>
        </button>
      </div>
      {designType === "themes"
        ? renderOptions(themes, theme, onThemeChange, "template-thumbnail")
        : renderOptions(
            backgrounds,
            background,
            onBackgroundChange,
            "template-background-thumbnail",
          )}
    </section>
  );
};

export default Template;
