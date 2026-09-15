import React, { useState, useEffect } from "react";
import api from "../../api/api";
import logo from "../../assets/KicpaaShot-03.png";
import AddLinkModal from "../Forms/AddLinkModal";
import Loading from "../loadings/Loading";
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  //   count the time difference in various intervals (years, months, days, hours, minutes, seconds)
  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }
  return "just now";
};

const ListData = ({ links, onLinksChange }) => {
  const [data, setData] = useState(links ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    if (links !== undefined) {
      setData(links);
      setLoading(false);
    }
  }, [links]);

  useEffect(() => {
    if (links !== undefined) {
      return undefined;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/add-links");
        const payload = Array.isArray(response.data)
          ? response.data
          : (response.data?.data ?? []);

        setData(payload);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load links.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [links]);

  const openCreateModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;

    try {
      await api.delete(`/add-links/${id}`);
      setData((prevData) => {
        const nextData = prevData.filter((item) => item.id !== id);
        onLinksChange?.(nextData);
        return nextData;
      });
      setOpenMenuId(null);
    } catch (err) {
      console.error("Error deleting link:", err);
      alert("Failed to delete link.");
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleDragStart = (event, id) => {
    setDraggingId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(id));
  };

  const handleDragOver = (event, id) => {
    event.preventDefault();
    if (id !== draggingId) {
      setDragOverId(id);
    }
  };

  const handleDrop = async (event, targetId) => {
    event.preventDefault();
    const sourceId = Number(event.dataTransfer.getData("text/plain"));

    if (!sourceId || sourceId === targetId) {
      return;
    }

    const sourceIndex = data.findIndex((item) => item.id === sourceId);
    const targetIndex = data.findIndex((item) => item.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      handleDragEnd();
      return;
    }

    const nextData = [...data];
    const [movedItem] = nextData.splice(sourceIndex, 1);
    nextData.splice(targetIndex, 0, movedItem);
    setData(nextData);
    onLinksChange?.(nextData);

    try {
      await api.post("/add-links/reorder", {
        ids: nextData.map((item) => item.id),
      });
    } catch (error) {
      console.error("Error saving link order:", error);
      alert("The new order could not be saved.");
    }

    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  if (loading) {
    return <Loading label="Loading links..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="poppins w-full bg-gray-100 m-auto mt-5 px-5  py-5">
      <div>
        
        <button
          onClick={openCreateModal}
          className="bg-blue-950 text-white px-4 py-2 rounded-md w-[95%]  mb-5 hover:bg-blue-800 transition-colors duration-300 m-auto flex items-center justify-center gap-2 cursor-pointer"
        >
          <span class>
            <i className="fa-solid fa-plus"></i>
          </span>{" "}
          Add New Link
        </button>
      </div>
      {data.length === 0 ? (
        <div>No links available.</div>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(event) => handleDragStart(event, item.id)}
            onDragOver={(event) => handleDragOver(event, item.id)}
            onDrop={(event) => handleDrop(event, item.id)}
            onDragEnd={handleDragEnd}
            className={`bg-white shadow-md mb-3 px-7 py-4 w-[95%] m-auto border-l-4 rounded-sm border-l-blue-900 cursor-grab transition-transform ${
              draggingId === item.id ? "opacity-50 scale-[0.98]" : ""
            } ${
              dragOverId === item.id
                ? "-translate-y-1 ring-2 ring-blue-300"
                : ""
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex justify-end text-gray-500 cursor-grab -mb-8">
                  <span
                    className="text-gray-500 hover:bg-gray-200 p-1 rounded-md"
                    title="Drag to reorder"
                  >
                    <i className="fa-solid fa-arrows-up-down-left-right"></i>
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-blue-950">
                  {item.title}
                </h2>
              </div>
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleMenu(item.id)}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  <i class="fa-solid fa-list"></i>
                </button>

                {openMenuId === item.id && (
                  <div className="absolute right-0 top-10 z-10 w-36 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        openEditModal(item);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fa-solid fa-pen-to-square text-blue-600"></i>
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        handleDelete(item.id);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <i className="fa-solid fa-trash text-red-600"></i>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <a
                className="text-gray-700 text-[14px] hover:underline"
                href={item.URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{item.URL}</span>
              </a>
              <p className="text-[14px] text-gray-500">
                Created at: {timeAgo(item.created_at)}
              </p>
            </div>
          </div>
        ))
      )}
      <AddLinkModal
        isOpen={isModalOpen}
        item={editingLink}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }}
        onLinkAdded={(newLink) => {
          setData((prevData) => {
            const nextData = [newLink, ...prevData];
            onLinksChange?.(nextData);
            return nextData;
          });
        }}
        onLinkUpdated={(updatedLink) => {
          setData((prevData) => {
            const nextData = prevData.map((item) =>
              item.id === updatedLink.id ? updatedLink : item,
            );
            onLinksChange?.(nextData);
            return nextData;
          });
        }}
      />
    </div>
  );
};

export default ListData;
