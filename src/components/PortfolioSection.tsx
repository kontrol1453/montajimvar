"use client";

import { useState, useEffect, useRef } from "react";

interface Skill {
  id: number;
  categoryId: number;
  title: string | null;
  yearsExp: number | null;
  certificate: string | null;
  verified: boolean;
  category: { id: number; name: string; icon: string | null };
}

interface Video {
  id: number;
  title: string;
  url: string;
  description: string | null;
  thumbnail: string | null;
  sortOrder: number;
}

interface Props {
  userId: number;
  categories: { id: number; name: string }[];
  initialCoverPhoto?: string | null;
  initialBio?: string | null;
}

export default function PortfolioSection({ userId, categories, initialCoverPhoto, initialBio }: Props) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [coverPhoto, setCoverPhoto] = useState(initialCoverPhoto || "");
  const [bio, setBio] = useState(initialBio || "");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Skill form
  const [skillCategoryId, setSkillCategoryId] = useState(categories[0]?.id || 0);
  const [skillTitle, setSkillTitle] = useState("");
  const [skillYears, setSkillYears] = useState("");
  const [skillCert, setSkillCert] = useState("");

  // Video form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");

  useEffect(() => {
    fetch(`/api/skills?userId=${userId}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setSkills)
      .catch(() => {});
    fetch(`/api/user/portfolio?type=videos&userId=${userId}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setVideos)
      .catch(() => {});
  }, [userId]);

  // Handle cover photo upload
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setCoverPhoto(data.url);
        await fetch("/api/user/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coverPhoto: data.url }),
        });
      }
    } catch {}
    e.target.value = "";
  }

  // Save bio
  async function saveBio() {
    try {
      const res = await fetch("/api/user/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Biyografi kaydedildi." });
      }
    } catch {
      setMessage({ type: "error", text: "Kaydedilirken hata oluştu." });
    }
  }

  // Add skill
  async function addSkill() {
    if (!skillCategoryId) return;
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: skillCategoryId,
          title: skillTitle || undefined,
          yearsExp: skillYears ? Number(skillYears) : undefined,
          certificate: skillCert || undefined,
        }),
      });
      if (res.ok) {
        const skill = await res.json();
        setSkills((prev) => [...prev, skill]);
        setSkillTitle("");
        setSkillYears("");
        setSkillCert("");
        setMessage({ type: "success", text: "Uzmanlık eklendi." });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Ekleme başarısız." });
      }
    } catch {
      setMessage({ type: "error", text: "Bir hata oluştu." });
    }
  }

  // Delete skill
  async function deleteSkill(id: number) {
    if (!confirm("Bu uzmanlığı silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {}
  }

  // Add video
  async function addVideo() {
    if (!videoTitle || !videoUrl) return;
    try {
      const res = await fetch("/api/user/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: videoTitle,
          url: videoUrl,
          description: videoDesc || undefined,
        }),
      });
      if (res.ok) {
        const video = await res.json();
        setVideos((prev) => [...prev, video]);
        setVideoTitle("");
        setVideoUrl("");
        setVideoDesc("");
        setMessage({ type: "success", text: "Video eklendi." });
      }
    } catch {
      setMessage({ type: "error", text: "Video eklenirken hata oluştu." });
    }
  }

  // Delete video
  async function deleteVideo(id: number) {
    if (!confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/user/portfolio?id=${id}`, { method: "DELETE" });
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch {}
  }

  return (
    <div className="space-y-8">
      {/* Kapak Fotoğrafı */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Kapak Fotoğrafı</h3>
        {coverPhoto && (
          <div className="relative mb-4 rounded-lg overflow-hidden h-40 bg-dark-bg">
            <img src={coverPhoto} alt="Kapak fotoğrafı" loading="lazy" className="w-full h-full object-cover" />
            <button
              onClick={() => { setCoverPhoto(""); fetch("/api/user/portfolio", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coverPhoto: "" }) }).catch(() => {}); }}
              className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full hover:bg-red-600 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
        <button
          onClick={() => coverInputRef.current?.click()}
          className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-gray-300 hover:border-montaj/50 transition"
        >
          {coverPhoto ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
        </button>
      </div>

      {/* Biyografi */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Biyografi</h3>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Kendinizden kısaca bahsedin..."
          className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-card text-white placeholder-gray-500 mb-3"
        />
        <button
          onClick={saveBio}
          className="px-4 py-2 bg-montaj text-white rounded-lg text-sm hover:bg-montaj/90 transition"
        >
          Kaydet
        </button>
      </div>

      {/* Uzmanlıklar / Sertifikalar */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Uzmanlıklar & Sertifikalar</h3>

        {/* Existing skills */}
        {skills.length > 0 && (
          <div className="space-y-2 mb-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between bg-dark-bg rounded-lg p-3 border border-dark-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{skill.category.name}</span>
                    {skill.verified && (
                      <span className="bg-green-900/30 text-green-400 text-xs px-1.5 py-0.5 rounded">Onaylı</span>
                    )}
                  </div>
                  {skill.title && <p className="text-sm text-sub-text">{skill.title}</p>}
                  {skill.yearsExp && <p className="text-xs text-sub-text">{skill.yearsExp} yıl deneyim</p>}
                  {skill.certificate && (
                    <a href={skill.certificate} target="_blank" rel="noopener noreferrer" className="text-xs text-montaj hover:underline">
                      Sertifika ↗
                    </a>
                  )}
                </div>
                <button onClick={() => deleteSkill(skill.id)} className="text-red-400 hover:text-red-300 p-1" title="Sil">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add skill form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={skillCategoryId}
            onChange={(e) => setSkillCategoryId(Number(e.target.value))}
            className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white"
          >
            <option value={0}>Kategori seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            value={skillTitle}
            onChange={(e) => setSkillTitle(e.target.value)}
            placeholder="Uzmanlık başlığı (opsiyonel)"
            className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-gray-500"
          />
          <input
            value={skillYears}
            onChange={(e) => setSkillYears(e.target.value)}
            placeholder="Deneyim yılı (opsiyonel)"
            type="number"
            className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-gray-500"
          />
          <input
            value={skillCert}
            onChange={(e) => setSkillCert(e.target.value)}
            placeholder="Sertifika URL (opsiyonel)"
            className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-gray-500"
          />
        </div>
        <button onClick={addSkill} className="mt-3 px-4 py-2 bg-montaj text-white rounded-lg text-sm hover:bg-montaj/90 transition">
          Uzmanlık Ekle
        </button>
      </div>

      {/* Video Portföy */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Video Portföy</h3>

        {videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {videos.map((video) => (
              <div key={video.id} className="relative bg-dark-bg rounded-lg overflow-hidden border border-dark-border group">
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
                  {video.description && <p className="text-xs text-sub-text mt-1">{video.description}</p>}
                </div>
                <button
                  onClick={() => deleteVideo(video.id)}
                  className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Video başlığı"
            className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-gray-500"
          />
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="YouTube URL (ör: https://youtu.be/...)"
            className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-gray-500"
          />
          <input
            value={videoDesc}
            onChange={(e) => setVideoDesc(e.target.value)}
            placeholder="Açıklama (opsiyonel)"
            className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-gray-500 sm:col-span-2"
          />
        </div>
        <button onClick={addVideo} disabled={!videoTitle || !videoUrl} className="mt-3 px-4 py-2 bg-montaj text-white rounded-lg text-sm hover:bg-montaj/90 transition disabled:opacity-50">
          Video Ekle
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/20 text-red-400"
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
