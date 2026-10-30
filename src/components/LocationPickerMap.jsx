import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair, Sparkles, Check, Compass, AlertCircle } from 'lucide-react';
import { POPULAR_LANDMARKS, findNearestAreaOrLandmark } from '../data/tariffs.js';

export default function LocationPickerMap({
  initialLat = 28.5459,
  initialLng = 77.2732,
  spotName = '',
  onSpotNameChange = null,
  onSelectLocation,
  height = '280px',
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [locationInfo, setLocationInfo] = useState(() =>
    findNearestAreaOrLandmark(initialLat, initialLng)
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState(null);

  // Regional quick zoom presets for easy navigation across Delhi NCR
  const QUICK_ZONES = [
    { label: 'South Delhi', lat: 28.5459, lng: 77.2732, zoom: 14 },
    { label: 'CP / Central', lat: 28.6315, lng: 77.2167, zoom: 15 },
    { label: 'Old Delhi / Chandni Chowk', lat: 28.6562, lng: 77.2309, zoom: 15 },
    { label: 'Majnu Ka Tilla', lat: 28.7032, lng: 77.2289, zoom: 15 },
    { label: 'North Campus', lat: 28.6942, lng: 77.2064, zoom: 15 },
    { label: 'Gurgaon', lat: 28.4950, lng: 77.0895, zoom: 14 },
    { label: 'Noida', lat: 28.5708, lng: 77.3260, zoom: 14 },
  ];

  // Create custom terracotta map pin icon
  const createPinIcon = (isCustom = true) => {
    return L.divIcon({
      className: 'custom-picker-pin',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-9 h-9 rounded-full bg-[#D9532F] ring-4 ring-terracotta-200 shadow-xl flex items-center justify-center text-white scale-110 animate-pulse">
            <span class="text-sm font-bold">📍</span>
          </div>
          <div class="absolute -bottom-1 w-2.5 h-2.5 bg-[#D9532F] rotate-45"></div>
        </div>
      `,
      iconSize: [36, 42],
      iconAnchor: [18, 42],
    });
  };

  // Update position and inform parent
  const updatePosition = (lat, lng, doFly = false) => {
    const roundedLat = parseFloat(lat.toFixed(5));
    const roundedLng = parseFloat(lng.toFixed(5));
    const newCoords = { lat: roundedLat, lng: roundedLng };
    setCoords(newCoords);

    const info = findNearestAreaOrLandmark(roundedLat, roundedLng);
    setLocationInfo(info);

    if (markerRef.current) {
      markerRef.current.setLatLng([roundedLat, roundedLng]);
    }

    if (doFly && leafletMapRef.current) {
      leafletMapRef.current.flyTo([roundedLat, roundedLng], 15, { animate: true, duration: 0.8 });
    }

    if (onSelectLocation) {
      onSelectLocation({
        lat: roundedLat,
        lng: roundedLng,
        area: info.area,
        nearestLandmark: info.nearestLandmark,
        description: info.description,
        isCustomPin: true,
      });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abc',
        maxZoom: 19,
      }).addTo(map);

      // Create draggable pin
      const marker = L.marker([initialLat, initialLng], {
        icon: createPinIcon(),
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        updatePosition(lat, lng, false);
      });

      // Click anywhere to move pin
      map.on('click', (e) => {
        updatePosition(e.latlng.lat, e.latlng.lng, false);
      });

      markerRef.current = marker;
      leafletMapRef.current = map;
    }

    // Leaflet container resize fix
    const timer = setTimeout(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Jump to user's real GPS coordinates
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocateMsg('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocateMsg('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        updatePosition(latitude, longitude, true);
        setLocateMsg('Location pinned successfully!');
        setTimeout(() => setLocateMsg(null), 3000);
      },
      (err) => {
        setIsLocating(false);
        setLocateMsg('Could not fetch GPS. Click anywhere on the map to pin manually.');
        setTimeout(() => setLocateMsg(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-2.5">
      {/* Spot Name Input (if provided) */}
      {onSpotNameChange && (
        <div>
          <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D9532F]" />
              <span>Custom Spot / Secret Stall Name:</span>
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Can be unlisted/unofficial</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Raju Chai Stall near Gate 3, Secret Momo Alley, or Chacha Da Dhaba"
            value={spotName}
            onChange={(e) => onSpotNameChange(e.target.value)}
            className="w-full bg-white border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:border-terracotta-400 shadow-xs"
          />
        </div>
      )}

      {/* Quick Jump Bar & GPS button */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
          <span className="text-[10px] font-bold text-stone-500 whitespace-nowrap mr-0.5">Quick Zones:</span>
          {QUICK_ZONES.map((zone) => (
            <button
              key={zone.label}
              type="button"
              onClick={() => {
                updatePosition(zone.lat, zone.lng, true);
              }}
              className="px-2 py-0.5 rounded-full bg-stone-100 hover:bg-terracotta-50 hover:text-[#D9532F] text-stone-700 text-[10px] font-semibold whitespace-nowrap transition-colors border border-stone-200"
            >
              {zone.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs shrink-0"
        >
          <Crosshair className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting...' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Interactive Map Box */}
      <div className="relative rounded-xl overflow-hidden border-2 border-stone-200 shadow-inner group">
        <div
          ref={mapContainerRef}
          style={{ height }}
          className="w-full z-0 cursor-crosshair"
        />

        {/* Floating Instruction Banner */}
        <div className="absolute top-2 left-2 right-2 z-[400] pointer-events-none flex justify-center">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-stone-200 shadow-md text-[10px] font-bold text-stone-800 flex items-center gap-1.5 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#D9532F] animate-ping"></span>
            <span>Click anywhere or drag the pin to pinpoint exact spot</span>
          </div>
        </div>

        {/* Locate Toast if active */}
        {locateMsg && (
          <div className="absolute bottom-2 left-2 right-2 z-[400] pointer-events-none flex justify-center">
            <div className="bg-stone-900/90 text-white px-3 py-1 rounded-full text-[10px] font-medium shadow-lg backdrop-blur-xs flex items-center gap-1.5">
              <span>{locateMsg}</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Coordinates & Neighborhood Card */}
      <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-terracotta-50 border border-terracotta-200 text-[#D9532F] flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-900">
              {locationInfo.description}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              Lat: {coords.lat.toFixed(4)}°, Lng: {coords.lng.toFixed(4)}°
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <Check className="w-3 h-3" />
          <span>Pin Dropped Successfully</span>
        </div>
      </div>
    </div>
  );
}
