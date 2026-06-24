"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ProfilePin {
  id: number;
  companyName: string;
  city: string;
  latitude: number;
  longitude: number;
  categoryName: string;
  ratingAvg: number;
}

interface SearchMapProps {
  profiles: ProfilePin[];
}

export default function SearchMap({ profiles }: SearchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current || profiles.length === 0) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a>",
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    const markers: L.Marker[] = [];

    profiles.forEach((p) => {
      if (!p.latitude || !p.longitude) return;
      const latlng = L.latLng(p.latitude, p.longitude);
      bounds.extend(latlng);

      const stars = p.ratingAvg > 0 ? `★ ${p.ratingAvg.toFixed(1)}` : "";
      const icon = L.divIcon({
        html: `<div style="background:#1e3a5f;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:3px solid white;cursor:pointer;">${p.companyName[0]?.toUpperCase() || "?"}</div>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker(latlng, { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:180px;">
            <a href="/firma/${p.id}" style="text-decoration:none;color:#c9a84c;font-weight:600;font-size:14px;">${p.companyName}</a>
            <div style="color:#666;font-size:12px;margin-top:4px;">${p.city} · ${p.categoryName}</div>
            ${stars ? `<div style="color:#c9a84c;font-size:13px;margin-top:2px;">${stars}</div>` : ""}
          </div>
        `);

      markers.push(marker);
    });

    if (markers.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([39.0, 35.0], 6); // Center of Turkey
    }

    mapInstanceRef.current = map;
    markersRef.current = markers;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, [profiles]);

  if (profiles.length === 0) {
    return (
      <div className="w-full h-96 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-sub-text text-sm">
        Haritada gösterilecek firma bulunamadı.
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-96 rounded-xl border border-dark-border" />;
}
