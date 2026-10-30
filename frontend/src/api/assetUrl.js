import api from "./api";

const apiBaseUrl = api.defaults.baseURL || "/api";

export const resolveAssetUrl = (path) => {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  try {
    const base = new URL(apiBaseUrl, window.location.origin);
    return new URL(path, `${base.origin}/`).toString();
  } catch {
    return path;
  }
};
