import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ThumbsUp,
  MapPin,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Navigation,
  Info,
  Compass,
  Share2,
  Check,
  Clock,
  Calendar,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Languages,
  Volume2,
  Loader2
} from 'lucide-react';
import { POPULAR_LANDMARKS } from '../data/tariffs.js';
import PhotoGallery from '../components/PhotoGallery.jsx';
import PhotoUploader from '../components/PhotoUploader.jsx';
import LocationPickerMap from '../components/LocationPickerMap.jsx';
import RideHandoffWidget from '../components/RideHandoffWidget.jsx';
import StayAndToursWidget from '../components/StayAndToursWidget.jsx';
import { translateTextWithSarvam, playSarvamSpeech } from '../utils/sarvamAudio.js';

export default function QuestionDetailPage({
  question,
  onBack,
  onAddAnswer,
  onUpvoteQuestion,
  onUpvoteAnswer,
  onHighlightOnMap,
  relatedQuestions = [],
  onSelectRelatedQuestion
}) {
  const [answerText, setAnswerText] = useState('');
  const [authorName, setAuthorName] = useState('Local Explorer');
  const [authorBadge, setAuthorBadge] = useState('Verified Local');
  const [attachPin, setAttachPin] = useState(true);
  const [pinMode, setPinMode] = useState('map'); // 'map' (custom pinpoint) | 'landmark' (predefined)
  const [selectedLandmarkId, setSelectedLandmarkId] = useState('moolchand');
  const [customSpotName, setCustomSpotName] = useState('');
  const [insiderTip, setInsiderTip] = useState('');
  const [answerPhotos, setAnswerPhotos] = useState([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeAnswerSort, setActiveAnswerSort] = useState('upvotes'); // 'upvotes' | 'newest'

  // Sarvam Indic Translation & Spoken Tariff State
  const [activeLang, setActiveLang] = useState('en-IN');
  const [translating, setTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState({}); // { [lang]: { title, body } }
  const [playingTariffAudio, setPlayingTariffAudio] = useState(false);

  const handleTranslate = async (targetLang) => {
    if (targetLang === activeLang) return;
    if (targetLang === 'en-IN') {
      setActiveLang('en-IN');
      return;
    }

    if (translatedData[targetLang]) {
      setActiveLang(targetLang);
      return;
    }

    setTranslating(true);
    try {
      const [transTitle, transBody] = await Promise.all([
        translateTextWithSarvam({ text: question.title, sourceLang: 'en-IN', targetLang }),
        translateTextWithSarvam({ text: question.body, sourceLang: 'en-IN', targetLang }),
      ]);

      setTranslatedData((prev) => ({
        ...prev,
        [targetLang]: { title: transTitle, body: transBody },
      }));
      setActiveLang(targetLang);
    } catch (err) {
      console.warn('[Sarvam Translate UI Error]:', err);
    } finally {
      setTranslating(false);
    }
  };

  const handlePlayTariffAudio = async () => {
    if (playingTariffAudio) return;
    if (!question?.fareCheck) return;

    setPlayingTariffAudio(true);
    const briefingText = `${question.city || 'Delhi'} auto fare advice: Official meter for ${question.fareCheck.distanceKm} kilometers is ${question.fareCheck.officialAutoMeter}. Cab apps estimate ${question.fareCheck.cabEstimate}. Always insist on starting the electronic meter.`;

    await playSarvamSpeech({
      text: briefingText,
      languageCode: activeLang === 'hi-IN' ? 'hi-IN' : 'en-IN',
      speaker: 'meera',
      onEnd: () => setPlayingTariffAudio(false),
      onError: () => setPlayingTariffAudio(false),
    });
  };

  // Scroll to top when post opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [question?.id]);

  // State for interactive pinpointing
  const [customPinCoords, setCustomPinCoords] = useState({
    lat: question?.lat || 28.5459,
    lng: question?.lng || 77.2732,
    area: question?.locationName || 'South Delhi',
    nearestLandmark: question?.locationName || 'Okhla Phase 3',
    description: `Near ${question?.locationName || 'South Delhi'}`,
    isCustomPin: true,
  });

  if (!question) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Discussion Not Found</h2>
        <p className="text-sm text-stone-500">The requested post could not be loaded or may have been archived.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D9532F] text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discussions</span>
        </button>
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      });
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    let pin = null;
    if (attachPin) {
      if (pinMode === 'map') {
        const spotTitle = customSpotName.trim() || customPinCoords.description || 'Secret Local Spot';
        pin = {
          name: spotTitle,
          lat: customPinCoords.lat,
          lng: customPinCoords.lng,
          neighborhood: customPinCoords.area || customPinCoords.nearestLandmark || 'Delhi Area',
          type: 'gem',
          isCustomPin: true,
          insiderTip: insiderTip.trim() || null,
          suggestedBy: authorName || 'Helpful Resident',
        };
      } else {
        const landmark = POPULAR_LANDMARKS.find((l) => l.id === selectedLandmarkId) || POPULAR_LANDMARKS[0];
        const spotName = customSpotName.trim() || landmark.name;

        pin = {
          name: spotName,
          lat: landmark.lat,
          lng: landmark.lng,
          neighborhood: landmark.area,
          type: 'gem',
          isCustomPin: false,
          insiderTip: insiderTip.trim() || null,
          suggestedBy: authorName || 'Helpful Resident',
        };
      }
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

  const sortedAnswers = [...(question.answers || [])].sort((a, b) => {
    if (activeAnswerSort === 'upvotes') {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="w-full pb-16 bg-[#F4F1EA] dark:bg-[#050505] min-h-[calc(100vh-65px)]">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-[#E8E5DF] dark:border-[#1a1a1a] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-[#D9532F] dark:hover:text-[#D9532F] bg-stone-100 dark:bg-[#141414] hover:bg-stone-200 dark:hover:bg-[#1f1f1f] px-3 py-1.5 rounded-full transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Discussions</span>
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500">
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{question.city || 'Delhi NCR'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#D9532F] font-semibold">{question.community || 'c/DelhiTransit'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-[#141414] hover:bg-stone-200 dark:hover:bg-[#1f1f1f] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#222] transition-colors"
              title="Share Discussion Link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => onUpvoteQuestion(question.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                question.userUpvoted
                  ? 'bg-[#D9532F] border-[#D9532F] text-white shadow-xs'
                  : 'bg-white dark:bg-[#111] border-stone-200 dark:border-[#262626] text-stone-700 dark:text-stone-300 hover:text-[#D9532F]'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${question.userUpvoted ? 'fill-white' : ''}`} />
              <span>{question.upvotes} Upvotes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: 2-Column Responsive Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Discussion & Answers Column (8 cols) */}
          <main className="lg:col-span-8 space-y-5">
            
            {/* Sarvam Mayura Indic Translation Bar */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200">
                <Languages className="w-4 h-4 text-[#D9532F]" />
                <span>Indic Translation (Sarvam Mayura AI):</span>
                {translating && (
                  <span className="flex items-center gap-1 text-[11px] text-[#D9532F] font-normal">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Translating...</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { code: 'en-IN', label: 'English', flag: '🇬🇧' },
                  { code: 'hi-IN', label: 'हिंदी', flag: '🇮🇳' },
                  { code: 'mr-IN', label: 'मराठी', flag: '🇮🇳' },
                  { code: 'kn-IN', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleTranslate(l.code)}
                    disabled={translating}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      activeLang === l.code
                        ? 'bg-[#D9532F] text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-[#161616] text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Question Article Card */}
            <article className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-6 sm:p-7 shadow-xs space-y-5">
              
              {/* Meta tags & Community badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#D9532F] bg-terracotta-50 dark:bg-terracotta-950/40 border border-terracotta-200 dark:border-terracotta-800/60 px-3 py-1 rounded-full">
                  {question.community || 'c/DelhiTransit'}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                  <span>{question.locationName}</span>
                </span>
                {question.city && (
                  <span className="text-[11px] bg-stone-100 dark:bg-[#161616] text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-md font-medium">
                    {question.city}
                  </span>
                )}
                {activeLang !== 'en-IN' && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-md font-semibold">
                    ⚡ Translated to {activeLang === 'hi-IN' ? 'Hindi' : activeLang === 'mr-IN' ? 'Marathi' : 'Kannada'}
                  </span>
                )}
                {question.tags?.map((tag, idx) => (
                  <span key={idx} className="text-[10px] text-stone-400 dark:text-stone-500">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author Row */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-[#161616]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-[#D9532F] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {question.author?.name?.[0] || 'T'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-white">
                        {question.author?.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#1a1a1a] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-[#282828] font-medium">
                        {question.author?.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{question.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Body (Live Sarvam Translation) */}
              <div className="space-y-3 pt-1">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug">
                  {translatedData[activeLang]?.title || question.title}
                </h1>
                <div className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed bg-[#FAF8F5] dark:bg-[#121212] p-5 rounded-xl border border-[#E8E5DF] dark:border-[#1a1a1a] whitespace-pre-line">
                  {translatedData[activeLang]?.body || question.body}
                </div>
              </div>

              {/* High-Resolution Photos Gallery */}
              {question.photos && question.photos.length > 0 && (
                <div className="space-y-2 pt-2">
                  <PhotoGallery photos={question.photos} title={question.title} />
                </div>
              )}

              {/* Embedded Real-Time Fair Fare Protection Card */}
              {question.fareCheck && (
                <div className="bg-[#FAF8F5] dark:bg-[#111] border border-terracotta-200 dark:border-terracotta-900/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-[#D9532F] font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-[#D9532F]" />
                      <span>Real-Time Fair Fare Protection Card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePlayTariffAudio}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#181818] text-[#D9532F] border border-terracotta-200 hover:bg-terracotta-50 transition-colors shadow-2xs"
                        title="Listen to Spoken Municipal Fare Briefing"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{playingTariffAudio ? 'Speaking...' : '🔊 Spoken Fare Briefing'}</span>
                      </button>
                      <span className="font-mono text-stone-500 dark:text-stone-400 text-xs font-semibold">
                        Distance: {question.fareCheck.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-[#0a0a0a] p-3.5 rounded-xl border border-terracotta-200 dark:border-terracotta-900/60 shadow-xs">
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Legal Auto Meter</div>
                      <div className="text-lg font-extrabold text-[#D9532F] font-mono mt-0.5">
                        {question.fareCheck.officialAutoMeter}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#0a0a0a] p-3.5 rounded-xl border border-stone-200 dark:border-[#1e1e1e] shadow-xs">
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Cab Aggregators</div>
                      <div className="text-lg font-extrabold text-stone-800 dark:text-stone-200 font-mono mt-0.5">
                        {question.fareCheck.cabEstimate}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#0a0a0a] p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">City Metro</div>
                      <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                        {question.fareCheck.metroFare}
                      </div>
                    </div>
                  </div>

                  {question.fareCheck.scamWarning && (
                    <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800/50 font-medium leading-relaxed">
                      ⚠️ <strong>Local Transit Advisory:</strong> {question.fareCheck.scamWarning}
                    </div>
                  )}

                  {/* 1-Click Ride Booking Handoff */}
                  <div className="pt-1">
                    <RideHandoffWidget
                      destination={question.fareCheck.destination || question.locationName}
                      origin={question.fareCheck.origin || 'Current Location'}
                      destLat={question.lat}
                      destLng={question.lng}
                      targetFare={question.fareCheck.officialAutoMeter}
                      compact={false}
                    />
                  </div>
                </div>
              )}
            </article>

            {/* Answers & Recommendations Section */}
            <section className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-6 sm:p-7 shadow-xs space-y-6">
              
              {/* Section Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-[#161616]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#D9532F]" />
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                    Verified Local Answers ({question.answers?.length || 0})
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#141414] p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveAnswerSort('upvotes')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      activeAnswerSort === 'upvotes'
                        ? 'bg-white dark:bg-[#222] text-[#D9532F] shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Top Upvoted
                  </button>
                  <button
                    onClick={() => setActiveAnswerSort('newest')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      activeAnswerSort === 'newest'
                        ? 'bg-white dark:bg-[#222] text-[#D9532F] shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Newest
                  </button>
                </div>
              </div>

              {/* Answers List */}
              {sortedAnswers.length === 0 ? (
                <div className="text-center py-10 bg-[#FAF8F5] dark:bg-[#111] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] space-y-2">
                  <Award className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">No suggestions posted yet.</p>
                  <p className="text-xs text-stone-400">Be the first verified local to share insider advice and pinpoint a location below!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedAnswers.map((ans) => (
                    <div
                      key={ans.id}
                      className="bg-[#FAF8F5] dark:bg-[#121212] border border-[#E8E5DF] dark:border-[#1a1a1a] rounded-2xl p-5 space-y-4 shadow-xs"
                    >
                      {/* Author bar & upvotes */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                            {ans.author?.name?.[0] || 'L'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-stone-900 dark:text-white">
                                {ans.author?.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-semibold">
                                {ans.author?.badge}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500">{ans.createdAt}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onUpvoteAnswer(question.id, ans.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                            ans.userUpvoted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white dark:bg-[#181818] border-stone-200 dark:border-[#262626] text-stone-700 dark:text-stone-300 hover:text-emerald-600'
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${ans.userUpvoted ? 'fill-white' : ''}`} />
                          <span>{ans.upvotes}</span>
                        </button>
                      </div>

                      {/* Answer Body */}
                      <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                        {ans.body}
                      </p>

                      {/* Answer Attached Photos */}
                      {ans.photos && ans.photos.length > 0 && (
                        <PhotoGallery photos={ans.photos} title={`Photo suggestion by ${ans.author.name}`} />
                      )}

                      {/* Prominent Suggested Location Button */}
                      {ans.pin && (
                        <div className="bg-white dark:bg-[#0a0a0a] border border-stone-200 dark:border-[#222] hover:border-terracotta-300 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-terracotta-50 dark:bg-terracotta-950/50 border border-terracotta-200 dark:border-terracotta-900/60 text-[#D9532F] flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-[#D9532F]" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                                <span>{ans.pin.name}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                                  ans.pin.isCustomPin
                                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                                }`}>
                                  {ans.pin.isCustomPin ? '✨ Custom Pinned Spot' : 'Official Landmark'}
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                                📍 {ans.pin.neighborhood || 'Local Area'} • Click button to view on map
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onHighlightOnMap(ans.pin)}
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
                        <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/30 border-l-2 border-amber-500 p-2.5 rounded-r-lg font-medium leading-relaxed">
                          <strong>Insider Tip:</strong> {ans.insiderTip}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Post a Verified Answer Form */}
              <div className="pt-6 border-t border-stone-200 dark:border-[#1a1a1a] space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-terracotta-50 dark:bg-terracotta-950 text-[#D9532F] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      Know the answer? Share local advice & give a location
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Your answer will help travelers navigate fair fares and authentic spots
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aditya M."
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-400 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Resident Credential
                      </label>
                      <select
                        aria-label="Author Credential Badge"
                        value={authorBadge}
                        onChange={(e) => setAuthorBadge(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-terracotta-400 font-medium"
                      >
                        <option value="Verified Local">Verified Local</option>
                        <option value="College Student">College Student Resident</option>
                        <option value="City Resident (10+ yrs)">City Resident (10+ yrs)</option>
                        <option value="Food & Transit Curator">Food & Transit Curator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Your Advice & Experience
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Give genuine local advice (e.g. skip the unmetered auto outside gate 2, take the metro violet line, or try the parathas behind the corner)..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl p-3.5 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-400 leading-relaxed"
                    />
                  </div>

                  {/* Dedicated Location Suggestion Box */}
                  <div className="bg-[#FAF8F5] dark:bg-[#121212] p-4 rounded-xl border border-terracotta-200 dark:border-terracotta-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={attachPin}
                          onChange={(e) => setAttachPin(e.target.checked)}
                          className="rounded accent-[#D9532F] w-4 h-4"
                        />
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#D9532F]" />
                          <span>Pin a location with this advice (Clickable on Map)</span>
                        </span>
                      </label>
                      <span className="text-[10px] text-[#D9532F] font-bold bg-terracotta-50 dark:bg-terracotta-950/60 px-2.5 py-0.5 rounded-full border border-terracotta-200/50">
                        Interactive Map Pin
                      </span>
                    </div>

                    {attachPin && (
                      <div className="pt-2 border-t border-stone-200/80 dark:border-[#1f1f1f] space-y-3">
                        {/* Pin Mode Tabs */}
                        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#181818] p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setPinMode('map')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                              pinMode === 'map'
                                ? 'bg-white dark:bg-[#252525] text-[#D9532F] shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                            <span>📍 Pinpoint on Map (Hidden / Unofficial Spot)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPinMode('landmark')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                              pinMode === 'landmark'
                                ? 'bg-white dark:bg-[#252525] text-[#D9532F] shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                            }`}
                          >
                            <Compass className="w-3.5 h-3.5 text-stone-500" />
                            <span>🏛️ Select Registered Landmark</span>
                          </button>
                        </div>

                        {pinMode === 'map' ? (
                          <div className="space-y-2">
                            <LocationPickerMap
                              initialLat={question?.lat || 28.5459}
                              initialLng={question?.lng || 77.2732}
                              spotName={customSpotName}
                              onSpotNameChange={setCustomSpotName}
                              onSelectLocation={setCustomPinCoords}
                              height="220px"
                            />
                            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>
                                <strong>Exact Pinpoint Ready:</strong> Even if this spot is an unlisted alley stall, travelers will see your exact pin on the city map!
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label htmlFor="answer-landmark" className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                                  Nearby area / landmark:
                                </label>
                                <select
                                  id="answer-landmark"
                                  aria-label="Nearby Area or Landmark"
                                  value={selectedLandmarkId}
                                  onChange={(e) => setSelectedLandmarkId(e.target.value)}
                                  className="w-full bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-lg p-2 text-xs text-stone-900 dark:text-white font-medium"
                                >
                                  {POPULAR_LANDMARKS.map((l) => (
                                    <option key={l.id} value={l.id}>
                                      {l.name} ({l.area})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                                  Specific stall / spot name:
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Moolchand Paratha Corner Gate 2"
                                  value={customSpotName}
                                  onChange={(e) => setCustomSpotName(e.target.value)}
                                  className="w-full bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-lg p-2 text-xs text-stone-900 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Secret Insider Tip */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Secret Insider Tip (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ask for extra butter, use exit gate 3, bargain down by ₹30..."
                      value={insiderTip}
                      onChange={(e) => setInsiderTip(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-400"
                    />
                  </div>

                  {/* Cloudinary Photo Uploader */}
                  <PhotoUploader
                    photos={answerPhotos}
                    onChange={setAnswerPhotos}
                    label="Attach Photos with your Suggestion (Food, Stall, Menu, Bill...)"
                    maxPhotos={4}
                  />

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-md shadow-terracotta-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Post Verified Answer with Location Pin</span>
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </main>

          {/* Sticky Context Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            
            {/* Spot Location & Map Card */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D9532F]" />
                  <span>Discussion Location</span>
                </span>
                <span className="text-[10px] text-stone-400">
                  {question.lat?.toFixed(3)}, {question.lng?.toFixed(3)}
                </span>
              </div>

              <div className="bg-[#FAF8F5] dark:bg-[#121212] p-3.5 rounded-xl border border-[#E8E5DF] dark:border-[#1a1a1a] space-y-1">
                <div className="text-sm font-bold text-stone-900 dark:text-white">
                  {question.locationName}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {question.city || 'Delhi NCR'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onHighlightOnMap({
                  name: question.locationName,
                  lat: question.lat,
                  lng: question.lng,
                  neighborhood: question.locationName,
                  type: 'question'
                })}
                className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs hover:bg-black dark:hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#D9532F]" />
                <span>Open Location in Spatial Map</span>
              </button>
            </div>

            {/* Backpacker Hostels & Guided Walk Affiliate Widget */}
            <StayAndToursWidget
              locationName={question.locationName || question.city}
              city={question.city}
              category={question.category}
            />

            {/* Verified Community Standards Card */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Local Moderation</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Answers on NearGo are ranked by verified residents and vetted against municipal transport tariffs to protect travelers from tourist markups and unmetered scam fares.
              </p>
            </div>

            {/* Related Community Discussions */}
            {relatedQuestions && relatedQuestions.length > 0 && (
              <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#D9532F]" />
                  <span>More in {question.city || 'Delhi NCR'}</span>
                </h4>
                <div className="space-y-2.5">
                  {relatedQuestions.slice(0, 4).map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectRelatedQuestion && onSelectRelatedQuestion(rel)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors border border-transparent hover:border-stone-200 dark:hover:border-[#222] group"
                    >
                      <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-[#D9532F] line-clamp-2 transition-colors">
                        {rel.title}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1 flex items-center justify-between">
                        <span>📍 {rel.locationName}</span>
                        <span>{rel.upvotes} upvotes</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
