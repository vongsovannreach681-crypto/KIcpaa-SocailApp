import React, { useEffect, useRef, useState } from "react";
import api from "../../api/api";

const Setting = () => {
  const [setting, setSetting] = useState(null);
  const [form, setForm] = useState({ title: "", short_title: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await api.get("/my-settings");
        const settings = Array.isArray(response.data)
          ? response.data
          : (response.data?.data ?? []);
        const latest = settings[0] ?? null;

        setSetting(latest);
        if (latest) {
          setForm({
            title: latest.title ?? "",
            short_title: latest.short_title ?? "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile settings:", err);
        setError("Unable to load profile settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  // Revoke the object URL when it's replaced or the component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageFailed(false);
    setSaved(false);
  };

  const hasChanges =
    setting &&
    (form.title !== (setting.title ?? "") ||
      form.short_title !== (setting.short_title ?? "") ||
      !!imageFile);

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("short_title", form.short_title);
      if (imageFile) payload.append("image", imageFile);

      // PHP does not reliably populate multipart PUT request data.  Use a
      // method-spoofed POST so Laravel receives the text fields and image.
      const response = await api.post(
        `/my-settings/${setting.id}?_method=PUT`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const updated = response.data?.data ?? response.data ?? {};
      setSetting((prev) => ({ ...prev, ...updated }));
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setSaved(true);
    } catch (err) {
      console.error("Error updating profile settings:", err);
      setSaveError("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="my-5 px-5 text-sm text-slate-500">Loading profile...</div>;
  }

  if (error) {
    return <div className="my-5 px-5 text-sm text-red-600">{error}</div>;
  }

  const displayImage = imagePreview || (!imageFailed ? setting?.image_url : null);

  return (
    <section className="my-5 w-full rounded-md bg-white px-8 py-8 shadow-sm poppins">
      <h1 className="mb-8 text-2xl text-xl font-semibold text-blue-900 border-b-3  pb-3"> Setting</h1>

      {!setting ? (
        <p className="text-sm text-slate-500">No profile settings available.</p>
      ) : (
        <>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8">
            <div className="min-w-0 space-y-6">
              <input
                className="truncate rounded-sm w-full bg-slate-100 px-4 py-3 text-sm text-slate-950 font-medium focus:outline-2 focus:outline-blue-950 transition-colors"
                type="text"
                value={form.title}
                onChange={handleChange("title")}
              />
              <input
                className="truncate rounded-sm w-full bg-slate-100 px-4 py-3 text-sm text-slate-950 font-medium focus:outline-2 focus:outline-blue-950 transition-colors"
                type="text"
                value={form.short_title}
                onChange={handleChange("short_title")}
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative grid h-24 w-24 place-items-center overflow-hidden rounded-sm bg-slate-50"
              title="Click to change logo"
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={`${setting.title} logo`}
                  className="h-full w-full object-contain"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span className="text-2xl font-semibold text-slate-400" aria-hidden="true">
                  {setting.title?.charAt(0)?.toUpperCase() || "P"}
                </span>
              )}
              <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-xs font-medium text-white group-hover:flex">
                Change
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="rounded-sm bg-blue-950 px-5 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>

            {saveError && <span className="text-sm text-red-600">{saveError}</span>}
            {saved && !saveError && (
              <span className="text-sm text-emerald-600">Saved.</span>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Setting;
