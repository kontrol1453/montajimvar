"use client";

import { useState, useEffect } from "react";

interface Video {
  id: number;
  title: string;
  url: string;
  description: string | null;
  sortOrder: number;
}

function embedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
}

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/profile/videos").then((r) => r.json()).then(setVideos).catch(() => {});
  }, []);

  const addVideo = async () => {
    if (!title || !url) return;
    const res = await fetch("/api/profile/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, description }),
    });
    if (res.ok) {
      const video = await res.json();
      setVideos((prev) => [...prev, video]);
      setTitle("");
      setUrl("");
      setDescription("");
      setShowForm(false);
    }
  };

  const deleteVideo = async (id: number) => {
    const res = await fetch(`/api/profile/videos/${id}`, { method: "DELETE" });
    if (res.ok) setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Video Portföy</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-1.5 bg-montaj text-white text-xs font-medium rounded-lg hover:bg-montaj-dark transition-all">
          {showForm ? "İptal" : "+ Video Ekle"}
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-section rounded-xl p-4 space-y-3 border border-dark-border">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video başlığı" className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white placeholder-sub-text" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL (youtube.com/watch?v=...)" className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white placeholder-sub-text" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Açıklama (opsiyonel)" rows={2} className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white placeholder-sub-text" />
          <button onClick={addVideo} className="px-4 py-2 bg-montaj text-white text-sm font-medium rounded-lg hover:bg-montaj-dark transition-all">Ekle</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((v) => (
          <div key={v.id} className="bg-dark-card rounded-xl border border-dark-border overflow-hidden group">
            <div className="aspect-video bg-dark-section">
              <iframe src={embedUrl(v.url)} title={v.title} className="w-full h-full" allowFullScreen />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{v.title}</p>
                  {v.description && <p className="text-sub-text text-xs mt-0.5">{v.description}</p>}
                </div>
                <button onClick={() => deleteVideo(v.id)} className="text-red-400 text-xs hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all">Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
