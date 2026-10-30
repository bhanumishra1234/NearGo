import React, { useState } from 'react';
import { ZoomIn, X, Image as ImageIcon } from 'lucide-react';

export default function PhotoGallery({ photos = [], title = '' }) {
  const [activeModalPhoto, setActiveModalPhoto] = useState(null);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div className="mt-3">
        {photos.length === 1 ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setActiveModalPhoto(photos[0]);
            }}
            className="relative group rounded-xl overflow-hidden border border-[#E8E5DF] bg-stone-100 cursor-pointer max-h-72 sm:max-h-80 shadow-xs"
          >
            <img
              src={photos[0]}
              alt={title || 'Attached photo'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/90 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <ZoomIn className="w-3.5 h-3.5 text-[#D9532F]" />
                <span>View Fullscreen</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photos.map((url, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalPhoto(url);
                }}
                className="relative group rounded-xl overflow-hidden border border-[#E8E5DF] bg-stone-100 cursor-pointer aspect-4/3 shadow-xs"
              >
                <img
                  src={url}
                  alt={`${title || 'Photo'} ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-stone-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <ZoomIn className="w-3 h-3 text-[#D9532F]" />
                    <span>Zoom</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveModalPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#D9532F]" />
                <span className="font-semibold truncate max-w-sm">{title || 'Photo Preview'}</span>
              </div>
              <button
                onClick={() => setActiveModalPhoto(null)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-black p-2">
              <img
                src={activeModalPhoto}
                alt="Enlarged photo view"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
