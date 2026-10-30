import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Filter, CheckCircle2, Sparkles, X, Compass } from 'lucide-react';

export default function MapContainer({
  questions = [],
  onSelectQuestion,
  highlightedPin = null,
  onClearHighlight = null,
  isPinningMode = false,
  onMapClickPin = null,
}) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersLayer = useRef(null);
  const markersRegistry = useRef([]);
  const [filterType, setFilterType] = useState('all'); // all | questions | gems
  const [activeCenter, setActiveCenter] = useState('southDelhi');

  // Centers dictionary
  const PRESET_CENTERS = {
    southDelhi: { name: 'South Delhi (Okhla/Kalkaji)', lat: 28.5459, lng: 77.2732, zoom: 14 },
    chandniChowk: { name: 'Old Delhi / Chandni Chowk', lat: 28.6562, lng: 77.2309, zoom: 14 },
    moolchand: { name: 'Moolchand / Lajpat Nagar', lat: 28.5670, lng: 77.2389, zoom: 14 },
    mkt: { name: 'Majnu Ka Tilla', lat: 28.7032, lng: 77.2289, zoom: 14 },
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      // Initialize map centered at South Delhi
      const map = L.map(mapRef.current, {
        center: [28.5459, 77.2732],
        zoom: 13,
        zoomControl: true,
      });

      // OpenStreetMap high-detail free tiles (no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        maxZoom: 19,
      }).addTo(map);

      markersLayer.current = L.layerGroup().addTo(map);
      leafletMap.current = map;

      // Handle map clicks for pin-dropping mode
      map.on('click', (e) => {
        if (onMapClickPin) {
          onMapClickPin(e.latlng);
        }
      });
    }

    // Leaflet resize invalidate timer
    const timer = setTimeout(() => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Update markers whenever questions, filterType, or highlightedPin change
  useEffect(() => {
    if (!leafletMap.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();
    markersRegistry.current = [];

    // 1. Question Markers (Terracotta Clay Accent)
    if (filterType === 'all' || filterType === 'questions') {
      questions.forEach((q) => {
        if (!q.lat || !q.lng) return;

        const isHighlighted = highlightedPin && (highlightedPin.id === q.id || (Math.abs(highlightedPin.lat - q.lat) < 0.0001 && Math.abs(highlightedPin.lng - q.lng) < 0.0001));

        const customIcon = L.divIcon({
          className: 'custom-pin-icon',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-8 h-8 rounded-full ${
                isHighlighted
                  ? 'bg-[#D9532F] ring-4 ring-terracotta-200 scale-125 shadow-xl animate-pulse'
                  : 'bg-white border-2 border-[#D9532F] shadow-md'
              } flex items-center justify-center transition-transform hover:scale-125">
                <span class="text-xs font-bold ${isHighlighted ? 'text-white' : 'text-[#D9532F]'}">?</span>
              </div>
              <div class="absolute -bottom-1 w-2 h-2 ${isHighlighted ? 'bg-[#D9532F]' : 'bg-[#D9532F]'} rotate-45"></div>
            </div>
          `,
          iconSize: [32, 38],
          iconAnchor: [16, 38],
        });

        const marker = L.marker([q.lat, q.lng], { icon: customIcon }).addTo(markersLayer.current);

        const fareTag = q.fareCheck
          ? `<div style="margin-top:6px; padding:5px 8px; border-radius:6px; background:#FAF8F5; border:1px solid #E8DEC8; font-size:11px; color:#A03216;">
              <strong>🛡️ Fair Auto Meter:</strong> ${q.fareCheck.officialAutoMeter}
             </div>`
          : '';

        marker.bindPopup(`
          <div style="font-family:'Plus Jakarta Sans', system-ui, sans-serif; padding:2px; min-width:180px;">
            <div style="font-size:10px; text-transform:uppercase; font-weight:800; color:#D9532F; margin-bottom:2px;">Traveler Question</div>
            <div style="font-weight:700; font-size:13px; color:#1C1917; margin-bottom:4px; line-height:1.3;">${q.title}</div>
            <div style="font-size:11px; color:#6B7280; margin-bottom:6px;">📍 ${q.locationName}</div>
            ${fareTag}
            <div style="margin-top:8px;">
              <button id="btn-view-${q.id}" style="width:100%; background:#D9532F; color:#FFFFFF; font-weight:700; padding:6px 10px; border-radius:6px; border:none; cursor:pointer; font-size:11px;">
                View Answers (${q.answers.length})
              </button>
            </div>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-view-${q.id}`);
          if (btn) {
            btn.onclick = () => onSelectQuestion(q);
          }
        });

        markersRegistry.current.push({
          lat: q.lat,
          lng: q.lng,
          name: q.locationName || q.title,
          marker,
        });
      });
    }

    // 2. Answer Pinned Spots (Emerald Green / Local Secret Spots)
    if (filterType === 'all' || filterType === 'gems') {
      questions.forEach((q) => {
        q.answers.forEach((ans) => {
          if (!ans.pin || !ans.pin.lat || !ans.pin.lng) return;

          const p = ans.pin;
          const isHighlighted = highlightedPin && (
            (highlightedPin.lat && Math.abs(highlightedPin.lat - p.lat) < 0.0001 && Math.abs(highlightedPin.lng - p.lng) < 0.0001) ||
            (highlightedPin.name && highlightedPin.name.toLowerCase() === p.name.toLowerCase())
          );

          const customIcon = L.divIcon({
            className: 'custom-gem-icon',
            html: `
              <div class="relative flex items-center justify-center cursor-pointer group">
                <div class="w-8 h-8 rounded-full ${
                  isHighlighted
                    ? 'bg-[#D9532F] ring-4 ring-terracotta-200 scale-125 shadow-xl animate-pulse text-white'
                    : 'bg-emerald-600 border-2 border-white shadow-md text-white'
                } flex items-center justify-center transition-transform hover:scale-125">
                  <span class="text-xs">📍</span>
                </div>
                <div class="absolute -bottom-1 w-2 h-2 ${isHighlighted ? 'bg-[#D9532F]' : 'bg-emerald-600'} rotate-45"></div>
              </div>
            `,
            iconSize: [32, 38],
            iconAnchor: [16, 38],
          });

          const marker = L.marker([p.lat, p.lng], { icon: customIcon }).addTo(markersLayer.current);

          marker.bindPopup(`
            <div style="font-family:'Plus Jakarta Sans', system-ui, sans-serif; padding:2px; min-width:200px;">
              <div style="display:flex; align-items:center; gap:4px; font-size:10px; text-transform:uppercase; font-weight:800; color:#15803D; margin-bottom:2px;">
                <span>Suggested Local Spot</span> • <span>${ans.author.badge}</span>
              </div>
              <div style="font-weight:700; font-size:13px; color:#1C1917; margin-bottom:4px;">${p.name}</div>
              <div style="font-size:11px; color:#6B7280; margin-bottom:6px;">📍 ${p.neighborhood || 'Delhi Area'}</div>
              <div style="font-size:11px; color:#374151; background:#FAF8F5; padding:6px 8px; border-radius:6px; border-left:3px solid #15803D; margin-bottom:6px;">
                "${ans.insiderTip || ans.body.slice(0, 95) + '...'}"
              </div>
              <div style="font-size:10px; color:#B57850;">Suggested by: <strong>${ans.author.name}</strong></div>
            </div>
          `);

          markersRegistry.current.push({
            lat: p.lat,
            lng: p.lng,
            name: p.name,
            marker,
          });
        });
      });
    }

    // 3. Handle Highlighted Location Pin Flying & Popup Opening
    if (highlightedPin && highlightedPin.lat && highlightedPin.lng) {
      const targetLat = highlightedPin.lat;
      const targetLng = highlightedPin.lng;

      // Find matching marker
      let matched = markersRegistry.current.find(
        (m) =>
          Math.abs(m.lat - targetLat) < 0.0002 && Math.abs(m.lng - targetLng) < 0.0002
      );

      // If no marker found in existing list (e.g., custom suggestion), create an active marker
      if (!matched) {
        const customActiveIcon = L.divIcon({
          className: 'custom-active-icon',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-10 h-10 rounded-full bg-[#D9532F] ring-4 ring-terracotta-200 scale-110 shadow-2xl flex items-center justify-center text-white animate-bounce">
                <span class="text-sm">📍</span>
              </div>
              <div class="absolute -bottom-1 w-2.5 h-2.5 bg-[#D9532F] rotate-45"></div>
            </div>
          `,
          iconSize: [40, 46],
          iconAnchor: [20, 46],
        });

        const activeMarker = L.marker([targetLat, targetLng], { icon: customActiveIcon }).addTo(markersLayer.current);
        activeMarker.bindPopup(`
          <div style="font-family:'Plus Jakarta Sans', system-ui, sans-serif; padding:4px; min-width:200px;">
            <div style="font-size:10px; text-transform:uppercase; font-weight:800; color:#D9532F; margin-bottom:2px;">📍 Clicked Location</div>
            <div style="font-weight:700; font-size:14px; color:#1C1917; margin-bottom:2px;">${highlightedPin.name || 'Suggested Spot'}</div>
            <div style="font-size:11px; color:#6B7280; margin-bottom:4px;">📍 ${highlightedPin.neighborhood || 'Selected Area'}</div>
            ${highlightedPin.insiderTip ? `<div style="font-size:11px; color:#374151; background:#FAF8F5; padding:6px; border-radius:6px; border-left:3px solid #D9532F;">"${highlightedPin.insiderTip}"</div>` : ''}
          </div>
        `);
        matched = { marker: activeMarker };
      }

      // Smoothly fly to coordinates and open the popup
      leafletMap.current.flyTo([targetLat, targetLng], 16, {
        animate: true,
        duration: 1.0,
      });

      setTimeout(() => {
        if (matched && matched.marker) {
          matched.marker.openPopup();
        }
      }, 700);
    }
  }, [questions, filterType, highlightedPin]);

  // Quick preset center jump
  const handleCenterSelect = (key) => {
    setActiveCenter(key);
    const target = PRESET_CENTERS[key];
    if (target && leafletMap.current) {
      leafletMap.current.flyTo([target.lat, target.lng], target.zoom, { animate: true, duration: 1.0 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col bg-[#F4F1EA] rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-sm">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Preset Center Navigation Chips */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-[#E8E5DF] shadow-md pointer-events-auto overflow-x-auto max-w-full">
          <Navigation className="w-3.5 h-3.5 text-[#D9532F] ml-1 shrink-0" />
          <span className="text-[11px] font-bold text-stone-500 hidden sm:inline mr-1">Quick Jump:</span>
          {Object.entries(PRESET_CENTERS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => handleCenterSelect(key)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCenter === key
                  ? 'bg-[#D9532F] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {item.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-[#E8E5DF] shadow-md pointer-events-auto">
          <Filter className="w-3 h-3 text-stone-400 ml-1.5 mr-0.5" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-1 rounded-full text-[11px] font-bold transition-colors ${
              filterType === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Pins
          </button>
          <button
            onClick={() => setFilterType('questions')}
            className={`px-2 py-1 rounded-full text-[11px] font-bold transition-colors ${
              filterType === 'questions' ? 'bg-terracotta-50 text-[#D9532F]' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ❓ Questions
          </button>
          <button
            onClick={() => setFilterType('gems')}
            className={`px-2 py-1 rounded-full text-[11px] font-bold transition-colors ${
              filterType === 'gems' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            💎 Suggested Spots
          </button>
        </div>
      </div>

      {/* Floating Active Highlighted Location Toast */}
      {highlightedPin && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-white border-2 border-[#D9532F] text-stone-900 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold pointer-events-auto animate-pulse">
          <MapPin className="w-4 h-4 text-[#D9532F]" />
          <span>Viewing Spot: {highlightedPin.name || 'Suggested Location'}</span>
          {onClearHighlight && (
            <button
              onClick={onClearHighlight}
              className="text-stone-400 hover:text-stone-700 ml-1 p-0.5 rounded-full"
              title="Clear Highlight"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Pinning Mode Active Indicator */}
      {isPinningMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-[#D9532F] text-white px-4 py-1.5 rounded-full font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4" />
          <span>Click anywhere on the map to place your pin!</span>
        </div>
      )}

      {/* Map DOM Element */}
      <div ref={mapRef} className="w-full h-full flex-1" />

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E5DF] shadow-md flex items-center gap-4 text-[11px] text-stone-700 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9532F]"></span>
          <span>Traveler Questions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Suggested Local Spots</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-stone-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
          <span>OpenStreetMap Live</span>
        </div>
      </div>
    </div>
  );
}
