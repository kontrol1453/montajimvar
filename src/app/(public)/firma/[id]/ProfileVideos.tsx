"use client";

import { useState, useEffect } from "react";

interface Video {
  id: number;
  title: string;
  url: string;
  description: string | null;
  thumbnail: string | null;
  sortOrder: number;
}

export default function ProfileVideos({ userId }: { userId: number }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/portfolio?type=videos&userId=${userId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setVideos(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return null;
  if (videos.length === 0) return null;

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Video Portföy</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-dark-bg rounded-lg overflow-hidden border border-dark-border">
            <div className="aspect-video relative">
              <iframe
                src={video.url}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-medium">{video.title}</p>
              {video.description && (
                <p className="text-xs text-sub-text mt-1">{video.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
