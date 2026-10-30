import React, { useState } from 'react';
import {
  ThumbsUp,
  MapPin,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Navigation,
  Info,
  X,
  Compass
} from 'lucide-react';
import { POPULAR_LANDMARKS } from '../data/tariffs.js';
import PhotoGallery from './PhotoGallery.jsx';
import PhotoUploader from './PhotoUploader.jsx';

export default function QuestionDetailModal({
  question,
  onClose,
  onAddAnswer,
  onUpvoteQuestion,
  onUpvoteAnswer,
  onHighlightOnMap,
}) {
  const [answerText, setAnswerText] = useState('');
  const [authorName, setAuthorName] = useState('Local Explorer');
  const [authorBadge, setAuthorBadge] = useState('Verified Local');
  const [attachPin, setAttachPin] = useState(true);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState('moolchand');
  const [customSpotName, setCustomSpotName] = useState('');
  const [insiderTip, setInsiderTip] = useState('');
  const [answerPhotos, setAnswerPhotos] = useState([]);

  if (!question) return null;

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    let pin = null;
    if (attachPin) {
      const landmark = POPULAR_LANDMARKS.find((l) => l.id === selectedLandmarkId) || POPULAR_LANDMARKS[0];
      const spotName = customSpotName.trim() || landmark.name;

      pin = {
        name: spotName,
        lat: landmark.lat,
        lng: landmark.lng,
        neighborhood: landmark.area,
        type: 'gem',
        insiderTip: insiderTip.trim() || null,
        suggestedBy: authorName || 'Helpful Resident',
      };
    }

    onAddAnswer(question.id, {
      body: answerText,
      authorName: authorName || 'Helpful Resident',
      badge: authorBadge,
      pin,
      insiderTip: insiderTip.trim() || null,
      photos: answerPhotos,
    });

    setAnswerText('');
    setCustomSpotName('');
    setInsiderTip('');
    setAnswerPhotos([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-stone-900 rounded-2xl border border-[#E8E5DF] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E5DF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#D9532F] bg-terracotta-50 border border-terracotta-200 px-2.5 py-0.5 rounded-full">
              {question.community || 'c/DelhiTransit'}
            </span>
            <span className="text-xs text-stone-500 font-medium">📍 {question.locationName}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Question Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-[#D9532F] text-white font-bold flex items-center justify-center text-sm shadow-inner">
                  {question.author.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">{question.author.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 font-medium">
                      {question.author.badge}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">{question.createdAt}</span>
                </div>
              </div>

              <button
                onClick={() => onUpvoteQuestion(question.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  question.userUpvoted
                    ? 'bg-[#D9532F] border-[#D9532F] text-white shadow-xs'
                    : 'bg-[#F4F1EA] border-stone-200 text-stone-700 hover:text-stone-900'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${question.userUpvoted ? 'fill-white' : ''}`} />
                <span>{question.upvotes} Upvotes</span>
              </button>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight">
              {question.title}
            </h1>
            <p className="text-sm text-stone-700 leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E5DF]">
              {question.body}
            </p>

            {/* Question Attached Photos Gallery */}
            <PhotoGallery photos={question.photos} title={question.title} />

            {/* Embedded Fair Fare Protection Card */}
            {question.fareCheck && (
              <div className="bg-[#FAF8F5] border border-terracotta-200 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#D9532F] font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-[#D9532F]" />
                    <span>Real-Time Fair Fare Protection Card</span>
                  </div>
                  <span className="font-mono text-stone-500 text-[11px] font-semibold">
                    Distance: {question.fareCheck.distanceKm} km
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-terracotta-200 shadow-xs">
                    <div className="text-[10px] text-stone-500 font-medium">Official Auto Meter</div>
                    <div className="text-base font-extrabold text-[#D9532F] font-mono">
                      {question.fareCheck.officialAutoMeter}
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-xs">
                    <div className="text-[10px] text-stone-500 font-medium">Cab Aggregators</div>
                    <div className="text-base font-extrabold text-stone-800 font-mono">
                      {question.fareCheck.cabEstimate}
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-xs">
                    <div className="text-[10px] text-emerald-700 font-medium">Delhi Metro</div>
                    <div className="text-base font-extrabold text-emerald-700 font-mono">
                      {question.fareCheck.metroFare}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-medium">
                  {question.fareCheck.scamWarning}
                </div>
              </div>
            )}
          </div>

          {/* Answers & Local Suggestions List */}
          <div className="space-y-3.5 pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 flex items-center justify-between">
              <span>Local Answers & Suggested Spots ({question.answers.length})</span>
              <span className="text-xs font-normal text-stone-500">Ranked by local upvotes</span>
            </h3>

            {question.answers.length === 0 ? (
              <div className="text-center py-6 bg-[#FAF8F5] rounded-xl border border-[#E8E5DF] text-xs text-stone-500">
                No suggestions yet. Share your local insight and pin a location below!
              </div>
            ) : (
              question.answers.map((ans) => (
                <div
                  key={ans.id}
                  className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {ans.author.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900">{ans.author.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                            {ans.author.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">{ans.createdAt}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onUpvoteAnswer(question.id, ans.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                        ans.userUpvoted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-stone-200 text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${ans.userUpvoted ? 'fill-white' : ''}`} />
                      <span>{ans.upvotes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    {ans.body}
                  </p>

                  {/* Suggestion Attached Photos */}
                  <PhotoGallery photos={ans.photos} title={`Photo suggestion by ${ans.author.name}`} />

                  {/* PROMINENT SUGGESTED LOCATION BUTTON (Interactive Map Pin) */}
                  {ans.pin && (
                    <div className="bg-white border-2 border-stone-200 hover:border-terracotta-300 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-terracotta-50 border border-terracotta-200 text-[#D9532F] flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-[#D9532F]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                            <span>{ans.pin.name}</span>
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-bold uppercase">
                              Pinned Location
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">
                            📍 {ans.pin.neighborhood || 'Delhi Area'} • Click button to view on map
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onHighlightOnMap(ans.pin);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                        title="Click to see location on map"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Show on Map</span>
                      </button>
                    </div>
                  )}

                  {/* Insider Tip Badge */}
                  {ans.insiderTip && (
                    <div className="text-xs text-amber-900 bg-amber-50/80 border-l-2 border-amber-500 p-2 rounded-r-lg font-medium">
                      <strong>Insider Tip:</strong> {ans.insiderTip}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Post a Suggestion & Give Location Form */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D9532F]" />
              <span>Know the answer? Share advice and give a location:</span>
            </h3>

            <form onSubmit={handleSubmitAnswer} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Aditya M.)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-terracotta-400 font-medium"
                />
                <select
                  value={authorBadge}
                  onChange={(e) => setAuthorBadge(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-terracotta-400 font-medium"
                >
                  <option value="Verified Local">Verified Local</option>
                  <option value="College Student">College Student Resident</option>
                  <option value="Delhiite (10+ yrs)">Delhiite (10+ yrs)</option>
                  <option value="Food & Transit Curator">Food & Transit Curator</option>
                </select>
              </div>

              <textarea
                rows={3}
                required
                placeholder="Give real local advice (e.g., skip the unmetered auto, take the Violet line metro, or recommend a secret food stall)..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-3 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-terracotta-400"
              />

              {/* DEDICATED LOCATION SUGGESTION BOX */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-terracotta-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachPin}
                      onChange={(e) => setAttachPin(e.target.checked)}
                      className="rounded accent-[#D9532F] w-4 h-4"
                    />
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#D9532F]" />
                      <span>Give a location with this suggestion (Interactive Map Pin)</span>
                    </span>
                  </label>
                  <span className="text-[10px] text-[#D9532F] font-bold bg-terracotta-50 px-2 py-0.5 rounded-full">
                    Clickable on Map
                  </span>
                </div>

                {attachPin && (
                  <div className="pt-2 border-t border-stone-200/80 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Select nearby area / landmark:
                        </label>
                        <select
                          value={selectedLandmarkId}
                          onChange={(e) => setSelectedLandmarkId(e.target.value)}
                          className="w-full bg-white border border-[#E8E5DF] rounded-lg p-2 text-xs text-stone-900 font-medium"
                        >
                          {POPULAR_LANDMARKS.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name} ({l.area})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Specific spot / stall name:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Moolchand Paratha Corner Gate 2"
                          value={customSpotName}
                          onChange={(e) => setCustomSpotName(e.target.value)}
                          className="w-full bg-white border border-[#E8E5DF] rounded-lg p-2 text-xs text-stone-900"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        When travelers click your answer, the map will smoothly fly to <strong>{customSpotName || POPULAR_LANDMARKS.find(l => l.id === selectedLandmarkId)?.name}</strong>!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Insider Tip Field */}
              <input
                type="text"
                placeholder="Secret Insider Tip (e.g. Ask for extra spicy chutney, bargaining rule, or metro exit gate)"
                value={insiderTip}
                onChange={(e) => setInsiderTip(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-terracotta-400"
              />

              {/* Attach Photos with Suggestion */}
              <PhotoUploader
                photos={answerPhotos}
                onChange={setAnswerPhotos}
                label="Attach Photos with your Suggestion (Food, Stall, Menu, Bill...)"
                maxPhotos={4}
              />

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-md shadow-terracotta-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Suggestion with Location Pin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
