import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CinemaLocation } from '../data/cinemaLocations';
import { MapPin, Phone, Clock } from 'lucide-react';

interface CinemaMapProps {
  cinema: CinemaLocation;
}

// Créer un marqueur personnalisé avec la couleur du cinéma
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 16px;
        ">🎬</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export default function CinemaMap({ cinema }: CinemaMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Définir le style de la carte selon le cinéma
    const tileLayer = cinema.mapStyle === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : cinema.mapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = cinema.mapStyle === 'dark'
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : cinema.mapStyle === 'satellite'
      ? '&copy; Esri'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    // Initialiser la carte
    mapRef.current = L.map(mapContainerRef.current, {
      center: [cinema.lat, cinema.lng],
      zoom: 15,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    // Ajouter le fond de carte
    L.tileLayer(tileLayer, {
      attribution,
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Ajouter un marqueur personnalisé
    const customIcon = createCustomIcon(cinema.markerColor);
    
    const marker = L.marker([cinema.lat, cinema.lng], { icon: customIcon }).addTo(mapRef.current);

    // Popup personnalisé
    const popupContent = `
      <div style="
        background: #1a1a1a;
        color: white;
        padding: 16px;
        border-radius: 12px;
        min-width: 200px;
        font-family: system-ui, sans-serif;
      ">
        <h3 style="
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 700;
          color: ${cinema.markerColor};
        ">${cinema.name}</h3>
        <p style="
          margin: 0 0 12px 0;
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.4;
        ">${cinema.address}</p>
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #d1d5db;
          margin-bottom: 4px;
        ">
          <span>📞</span> ${cinema.phone}
        </div>
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #d1d5db;
        ">
          <span>🕐</span> ${cinema.hours}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      className: 'custom-popup',
      closeButton: true,
      maxWidth: 280,
    });

    // Ouvrir le popup après un court délai
    setTimeout(() => {
      marker.openPopup();
    }, 500);

    // Nettoyer
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cinema]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <MapPin className="w-5 h-5 text-red-500" />
        Salle de cinéma
      </h2>
      
      {/* Infos du cinéma */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-900/50 rounded-2xl p-5 border border-white/5">
        <div className="flex items-start gap-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${cinema.markerColor}20` }}
          >
            <MapPin className="w-7 h-7" style={{ color: cinema.markerColor }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{cinema.name}</h3>
            <p className="text-gray-400 text-sm mb-3">{cinema.address}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-gray-500" />
                {cinema.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-gray-500" />
                {cinema.hours}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carte Map */}
      <div 
        className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        style={{ height: '300px', position: 'relative' }}
      >
        {/* Style de carte badge */}
        <div 
          className="absolute top-3 left-3 z-[1000] px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg"
          style={{ backgroundColor: cinema.markerColor }}
        >
          {cinema.mapStyle === 'dark' && 'Vue nocturne'}
          {cinema.mapStyle === 'satellite' && 'Vue satellite'}
          {cinema.mapStyle === 'streets' && 'Vue streets'}
        </div>
        
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Indications */}
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <MapPin className="w-4 h-4" />
        </div>
        <span>{cinema.city}</span>
      </div>
    </div>
  );
}
