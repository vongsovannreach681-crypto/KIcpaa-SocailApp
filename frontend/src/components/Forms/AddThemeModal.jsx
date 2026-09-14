import React, { useEffect, useRef, useState } from "react";
import api from "../../api/api";

const AddThemeModal = ({ isOpen, onClose, onThemeAdded }) => {
  const fileInputRef = useRef(null);
  const [themeName, setThemeName] = useState("");
  const [themeImage, setThemeImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setThemeName("");
      setThemeImage(null);
      setImagePreview("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setThemeImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});

    const payload = new FormData();
    payload.append("themeName", themeName);
    payload.append("themeImage", themeImage);

    try {
      const response = await api.post("/addThemes", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onThemeAdded?.(response.data);
      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Error saving theme:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 poppins z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-140 overflow-hidden rounded-2xl border border-gray-200 bg-[#f4f4f4] shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between border-b border-gray-300 px-5 py-4">
          <h2 className="text-2xl font-semibold text-blue-950">Add Theme</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-3xl leading-none text-black hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700">
              Theme name
            </label>
            <input
              type="text"
              value={themeName}
              onChange={(event) => setThemeName(event.target.value)}
              className="w-full rounded-xl border border-dashed border-gray-400 bg-[#e7e7e7] px-4 py-3 text-gray-700 outline-none focus:border-gray-600"
              placeholder="My animated theme"
            />
            {errors.themeName && (
              <p className="mt-1 text-sm text-red-500">{errors.themeName[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700">
              Theme image or GIF
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-400 bg-[#e7e7e7] transition hover:bg-[#e0e0e0]"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Theme preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-600">Choose an image or GIF</span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            {errors.themeImage && (
              <p className="mt-1 text-sm text-red-500">
                {errors.themeImage[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !themeImage}
            className="w-full rounded-full bg-blue-900 py-3 text-xl font-bold text-white shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "SAVE THEME"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddThemeModal;
