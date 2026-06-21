"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  latitude: number;
  longitude: number;
  companyName: string;
  address?: string | null;
  city: string;
}

export default function CompanyMap({ latitude, longitude, companyName, address, city }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a>",
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="background:#ff7a00;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:3px solid white;">📍</div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup(`<b>${companyName}</b><br/>${address ? address + ", " : ""}${city}`);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, companyName, address, city]);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div>
      <div ref={mapRef} className="w-full h-64 rounded-xl" />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 text-sm text-montaj hover:underline"
      >
        🗺️ Yol Tarifi Al (Google Maps)
      </a>
    </div>
  );
}
