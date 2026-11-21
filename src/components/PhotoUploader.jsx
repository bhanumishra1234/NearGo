import React, { useState, useRef } from 'react';
import { Camera, Upload, Link, X, Plus, Sparkles, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadImage } from '../utils/imageUpload';

const PRESET_PHOTOS = [
  { label: '🛺 Auto Rickshaw', url: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80' },
  { label: '🥟 Street Food', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { label: '🚇 Metro Station', url: 'https://images.unsplash.com/photo-1581447109200-bf276912b649?auto=format&fit=crop&w=800&q=80' },
  { label: '🛍️ Flea Market', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80' },
  { label: '🏰 Heritage Fort', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' }
];

export default function PhotoUploader({ photos = [], onChange, maxPhotos = 4, label = 'Attach Photos' }) {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlBox, setShowUrlBox] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = maxPhotos - photos.length;
    if (availableSlots <= 0) return;

    const validFiles = files.filter(f => f.type.startsWith('image/')).slice(0, availableSlots);
    if (!validFiles.length) return;

    setUploading(true);
    setUploadStatus('Optimizing & uploading to Cloudinary CDN...');

    try {
      const uploadedUrls = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadStatus(`Uploading ${i + 1}/${validFiles.length}...`);
        const result = await uploadImage(file);
        if (result?.url) {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...photos, ...uploadedUrls]);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (photos.length >= maxPhotos) return;

    onChange([...photos, urlInput.trim()]);
    setUrlInput('');
    setShowUrlBox(false);
  };

  const handleAddPreset = (url) => {
    if (photos.length >= maxPhotos) return;
    if (photos.includes(url)) return;
    onChange([...photos, url]);
  };

  const handleRemovePhoto = (index) => {
    const next = photos.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E5DF] space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-[#D9532F]" />
          <span>{label}</span>
          <span className="text-[10px] text-stone-400 font-normal">
            ({photos.length}/{maxPhotos})
          </span>
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowUrlBox(!showUrlBox)}
            className="text-[11px] font-semibold text-stone-600 hover:text-[#D9532F] px-2 py-0.5 rounded-md hover:bg-stone-200/60 transition-colors flex items-center gap-1"
          >
            <Link className="w-3 h-3" />
            <span>Paste URL</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || photos.length >= maxPhotos}
            className="text-[11px] font-bold text-white bg-[#D9532F] hover:bg-[#C2411E] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 disabled:opacity-50 shadow-2xs"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3 h-3" />
                <span>Upload Photo</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Uploading progress indicator */}
      {uploading && (
        <div className="flex items-center gap-2 py-1 px-2.5 bg-amber-50 border border-amber-200/70 rounded-lg text-amber-800 text-[11px]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D9532F] shrink-0" />
          <span className="font-medium">{uploadStatus || 'Processing image...'}</span>
        </div>
      )}

      {/* URL input box */}
      {showUrlBox && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="url"
            placeholder="Paste image link (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-white border border-[#E8E5DF] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-terracotta-400"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 rounded-lg bg-stone-900 text-white font-bold text-xs hover:bg-black transition-colors shrink-0"
          >
            Add Link
          </button>
        </div>
      )}

      {/* Preset Photo Suggestions */}
      {photos.length < maxPhotos && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-[10px] text-stone-400 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Presets:</span>
          </span>
          {PRESET_PHOTOS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddPreset(preset.url)}
              disabled={photos.includes(preset.url)}
              className={`px-2 py-0.5 rounded-full whitespace-nowrap font-medium border text-[11px] transition-colors ${
                photos.includes(preset.url)
                  ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-default'
                  : 'bg-white border-[#E8E5DF] text-stone-700 hover:border-terracotta-400 hover:text-[#D9532F]'
              }`}
            >
              + {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Thumbnails preview strip */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2 pt-1">
          {photos.map((photo, index) => {
            const isCloudinary = typeof photo === 'string' && photo.includes('cloudinary.com');
            return (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-[#E8E5DF] bg-stone-100 group shadow-2xs"
              >
                <img
                  src={photo}
                  alt={`Upload preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isCloudinary && (
                  <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-[9px] text-emerald-300 px-1 py-0.2 rounded font-medium">
                    CDN
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
                  title="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
