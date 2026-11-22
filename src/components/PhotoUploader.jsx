import React, { useState, useRef } from 'react';
import { Camera, Upload, Link, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../utils/imageUpload';

export default function PhotoUploader({ photos = [], onChange, maxPhotos = 4, label = 'Photos' }) {
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
    setUploadStatus('Uploading...');

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

  const handleRemovePhoto = (index) => {
    const next = photos.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {/* Action Buttons Row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || photos.length >= maxPhotos}
          className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#262626] bg-stone-50 dark:bg-[#141414] hover:bg-stone-100 dark:hover:bg-[#1a1a1a] text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D9532F]" />
              <span>{uploadStatus}</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5 text-[#D9532F]" />
              <span>Attach Photos ({photos.length}/{maxPhotos})</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowUrlBox(!showUrlBox)}
          disabled={photos.length >= maxPhotos}
          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#262626] bg-stone-50 dark:bg-[#141414] hover:bg-stone-100 dark:hover:bg-[#1a1a1a] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Link className="w-3 h-3" />
          <span>URL</span>
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

      {/* URL input box */}
      {showUrlBox && (
        <div className="flex items-center gap-2 pt-1 animate-fadeIn">
          <input
            type="url"
            placeholder="Paste image link (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-white dark:bg-[#141414] border border-stone-200 dark:border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#D9532F]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs hover:bg-black transition-colors shrink-0 cursor-pointer"
          >
            Add
          </button>
        </div>
      )}

      {/* Thumbnails preview strip */}
      {photos.length > 0 && (
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200 dark:border-[#282828] bg-stone-100 group shadow-2xs"
            >
              <img
                src={photo}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-colors"
                title="Remove photo"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
