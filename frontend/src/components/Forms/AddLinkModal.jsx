import React, { useState, useRef } from "react";
import api from "../../api/api";
import logo from "../../assets/KicpaaShot-03.png";
const AddLinkModal = ({
  isOpen,
  onClose,
  onLinkAdded,
  onLinkUpdated,
  item,
}) => {
  const fileInputRef = useRef(null);
  const isEditing = Boolean(item);
  const [formData, setFormData] = useState({
    title: "",
    URL: "",
    image: null,
    highlighted: false,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          title: item.title || "",
          URL: item.URL || "",
          image: null,
          highlighted: Boolean(item.highlighted),
        });
        setImagePreview(item.image_url || "");
      } else {
        setFormData({ title: "", URL: "", image: null, highlighted: false });
        setImagePreview("");
      }
      setErrors({});
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("URL", formData.URL);
    if (formData.image) {
      payload.append("image", formData.image);
    }
    payload.append("highlighted", formData.highlighted ? "1" : "0");

    try {
      if (isEditing && item?.id) {
        const response = await api.post(
          `/add-links/${item.id}?_method=PUT`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        onLinkUpdated(response.data);
      } else {
        const response = await api.post("/add-links", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        onLinkAdded(response.data);
      }

      setFormData({ title: "", URL: "", image: null, highlighted: false });
      setImagePreview("");
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        console.error("Error saving link:", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[710px] rounded-[18px] bg-[#f4f4f4] shadow-[0_10px_40px_rgba(0,0,0,0.18)] overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300">
          <h2 className="text-2xl text-blue-950 font-semibold">
            {isEditing ? "Edit Link" : "Add new Link"}
          </h2>
          
          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-black hover:text-gray-700 leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-[1fr_200px] gap-5 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-[#e7e7e7] border border-dashed border-gray-400 rounded-xl px-4 py-3 text-gray-700 placeholder:text-gray-500 outline-none focus:border-gray-600"
                  placeholder="My Instagram"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="text"
                  name="URL"
                  value={formData.URL}
                  onChange={handleChange}
                  className="w-full bg-[#e7e7e7] border border-dashed border-gray-400 rounded-xl px-4 py-3 text-gray-700 placeholder:text-gray-500 outline-none focus:border-gray-600"
                  placeholder="https://instagram.com/yourname"
                />
                {errors.URL && (
                  <p className="text-red-500 text-sm mt-1">{errors.URL[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Picture
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[156px] border-2 border-dashed border-gray-400 rounded-xl bg-[#e7e7e7] flex items-center justify-center overflow-hidden hover:bg-[#e0e0e0] transition"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-600">
                    <i className="fa-solid fa-image text-2xl mb-2"></i>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
              )}
            </div>
          </div>

         

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-blue-900 cursor-pointer text-white font-bold text-2xl py-3 shadow-md hover:brightness-105 disabled:opacity-60"
          >
            {submitting
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "UPDATE"
                : "SAVE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;
