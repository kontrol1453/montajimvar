"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const TURKISH_CITIES = [
  "Adana","Adıyaman","Afyon","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın",
  "Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa",
  "Çanakkale","Çankırı","Çorum",
  "Denizli","Diyarbakır","Düzce",
  "Edirne","Elazığ","Erzincan","Erzurum","Eskişehir",
  "Gaziantep","Giresun","Gümüşhane",
  "Hakkari","Hatay",
  "Iğdır","Isparta","İstanbul","İzmir",
  "Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kilis",
  "Kırıkkale","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya",
  "Malatya","Manisa","Mardin","Mersin","Muğla","Muş",
  "Nevşehir","Niğde",
  "Ordu","Osmaniye",
  "Rize",
  "Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak",
  "Tekirdağ","Tokat","Trabzon","Tunceli",
  "Uşak",
  "Van",
  "Yalova","Yozgat",
  "Zonguldak",
];

interface FormData {
  city: string;
  district: string;
  location: string;
  accessInfo: string;
}

interface Props {
  data: FormData;
  updateData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepLocation({ data, updateData, onNext, onBack }: Props) {
  const [citySearch, setCitySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = TURKISH_CITIES.filter(
    (c) => c.toLowerCase().includes(citySearch.toLowerCase()) && c !== data.city
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Konum Bilgisi</h2>
        <p className="text-sub-text text-sm">İşin yapılacağı yeri belirtin</p>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-muted-text mb-1.5">Şehir *</label>
        <input
          type="text"
          value={data.city || citySearch}
          onChange={(e) => {
            setCitySearch(e.target.value);
            if (data.city) updateData({ city: "" });
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Şehir seçin..."
          className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent"
        />
        {showDropdown && (citySearch.length > 0 || !data.city) && (
          <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-dark-card border border-dark-border rounded-lg shadow-lg">
            {data.city && (
              <button
                onClick={() => { setCitySearch(data.city); setShowDropdown(false); }}
                className="w-full text-left px-3 py-2 text-sm bg-montaj/20 text-montaj"
              >
                {data.city}
              </button>
            )}
            {filteredCities.slice(0, 10).map((city) => (
              <button
                key={city}
                onClick={() => { updateData({ city }); setCitySearch(city); setShowDropdown(false); }}
                className="w-full text-left px-3 py-2 text-sm text-muted-text hover:bg-dark-section hover:text-white transition"
              >
                {city}
              </button>
            ))}
            {filteredCities.length === 0 && !data.city && (
              <p className="px-3 py-2 text-sm text-sub-text">Eşleşen şehir bulunamadı</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-text mb-1.5">İlçe (opsiyonel)</label>
        <input
          type="text"
          value={data.district}
          onChange={(e) => updateData({ district: e.target.value })}
          placeholder="Örn: Kadıköy, Çankaya..."
          className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-text mb-1.5">Adres Tarifi (opsiyonel)</label>
        <textarea
          value={data.location}
          onChange={(e) => updateData({ location: e.target.value })}
          placeholder="Mahalle, sokak, bina no, daire..."
          rows={3}
          className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montag focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-text mb-1.5">Giriş Bilgisi (opsiyonel)</label>
        <input
          type="text"
          value={data.accessInfo}
          onChange={(e) => updateData({ accessInfo: e.target.value })}
          placeholder="Site kodu, bina giriş kodu, hangi kat..."
          className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Geri</Button>
        <Button variant="primary" size="lg" disabled={!data.city} onClick={onNext}>
          Devam
        </Button>
      </div>
    </div>
  );
}
