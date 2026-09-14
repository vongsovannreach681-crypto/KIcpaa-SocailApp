import React from "react";

const Loading = ({ label = "Loading...", fullPage = false }) => (
  <div
    className={`app-loading ${fullPage ? "app-loading-full" : ""}`}
    role="status"
    aria-live="polite"
  >
    <span className="app-loading-spinner" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default Loading;
