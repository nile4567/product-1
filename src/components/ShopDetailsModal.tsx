import { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Footprints,
  Car,
  Navigation,
  Flame,
  MessageSquarePlus,
  Send,
  Sparkles,
} from 'lucide-react';
import { PizzaShop, PizzaReview } from '../types/pizza';
import { formatDistance, formatDuration, calculateWeightedScore } from '../utils/distance';

interface ShopDetailsModalProps {
  shop: PizzaShop;
  onClose: () => void;
  onPlotRoute: (shop: PizzaShop) => void;
  onAddReview: (shopId: string, review: PizzaReview) => void;
  distanceUnit: 'miles' | 'km';
}

export function ShopDetailsModal({
  shop,
  onClose,
  onPlotRoute,
  onAddReview,
  distanceUnit,
}: ShopDetailsModalProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [crustScore, setCrustScore] = useState(5);
  const [sauceScore, setSauceScore] = useState(5);
  const [cheeseScore, setCheeseScore] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmitting(true);
    const newRev: PizzaReview = {
      id: `user-rev-${Date.now()}`,
      author: author.trim() || 'Pizza Lover',
      rating,
      text: reviewText.trim(),
      date: 'Just now',
      crustScore,
      sauceScore,
      cheeseScore,
    };

    onAddReview(shop.id, newRev);
    setIsSubmitting(false);
    setShowReviewForm(false);
    setReviewText('');
  };

  const weightedScore = calculateWeightedScore(shop.rating, shop.userRatingCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-stone-700"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header / Photo with Scrim */}
        <div className="relative h-48 sm:h-60 w-full shrink-0 bg-stone-800 overflow-hidden">
          {shop.photoUrl ? (
            <img
              src={shop.photoUrl}
              alt={shop.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-600">
              <span className="text-4xl">🍕</span>
            </div>
          )}
          {/* Measured Scrim for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {shop.woodFired && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-400 bg-stone-900/80 px-2 py-0.5 rounded border border-orange-500/30">
                    <Flame className="w-3 h-3" /> Wood-Fired
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-stone-300 bg-stone-900/80 px-2 py-0.5 rounded border border-stone-700">
                  {'$'.repeat(shop.priceLevel)}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                {shop.name}
              </h2>
            </div>

            {/* Overall Score Badge */}
            <div className="text-right shrink-0 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                Index Score
              </div>
              <div className="text-xl font-black text-orange-400 font-mono tabular-nums">
                {weightedScore}
                <span className="text-xs text-stone-500">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Real-time Distance Tracking Banner */}
          <div className="bg-stone-850 border border-stone-750 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-400 font-mono">Real-Time Distance</div>
                <div className="text-base font-bold text-white font-mono tabular-nums">
                  {formatDistance(shop.distanceMeters, distanceUnit)} from your location
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onPlotRoute(shop);
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Track Route on Map</span>
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Google Maps</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-sans">
                Google Rating
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-400 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{shop.rating.toFixed(1)}</span>
                <span className="text-stone-500 font-normal text-xs">
                  ({shop.userRatingCount.toLocaleString()})
                </span>
              </div>
            </div>

            <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-sans">
                Walking Time
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-stone-200 mt-0.5">
                <Footprints className="w-3.5 h-3.5 text-stone-400" />
                <span>{formatDuration(shop.walkDurationSeconds)}</span>
              </div>
            </div>

            <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-sans">
                Driving Time
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-stone-200 mt-0.5">
                <Car className="w-3.5 h-3.5 text-stone-400" />
                <span>{formatDuration(shop.durationSeconds)}</span>
              </div>
            </div>

            <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-sans">
                Current Status
              </span>
              <div className="flex items-center gap-1 text-sm font-bold mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    shop.isOpen !== false ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                ></span>
                <span className={shop.isOpen !== false ? 'text-emerald-400' : 'text-rose-400'}>
                  {shop.isOpen !== false ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Location */}
          <div className="space-y-2 text-sm text-stone-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>{shop.address}</span>
            </div>

            {shop.phoneNumber && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <a
                  href={`tel:${shop.phoneNumber}`}
                  className="hover:text-orange-400 transition-colors font-mono"
                >
                  {shop.phoneNumber}
                </a>
              </div>
            )}

            {shop.website && (
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-stone-400 shrink-0" />
                <a
                  href={shop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline truncate"
                >
                  {shop.website}
                </a>
              </div>
            )}

            {shop.openHours && shop.openHours.length > 0 && (
              <div className="flex items-start gap-2.5 text-xs text-stone-400">
                <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>{shop.openHours.join(' · ')}</div>
              </div>
            )}
          </div>

          {/* Specialty Pie & Styles */}
          {shop.specialtyPie && (
            <div className="bg-orange-950/20 border border-orange-900/40 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>House Signature Pie</span>
              </div>
              <p className="text-sm font-semibold text-white mt-1">{shop.specialtyPie}</p>
              <div className="flex flex-wrap gap-x-2 text-xs text-stone-400 mt-2">
                <span>Styles: {shop.pizzaStyles.join(' · ')}</span>
              </div>
            </div>
          )}

          {/* Community Ratings & Reviews Section */}
          <div className="pt-3 border-t border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white font-display">
                Community Pizza Reviews ({shop.userReviews.length})
              </h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg border border-orange-500/30 transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Rate This Pie</span>
              </button>
            </div>

            {/* Interactive Review Submission Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-stone-850 border border-stone-750 rounded-xl p-4 mb-4 space-y-3"
              >
                <h4 className="text-sm font-bold text-white">Your Pizza Assessment</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Frank P."
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">
                      Overall Star Rating ({rating}★)
                    </label>
                    <div className="flex gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= rating
                                ? 'fill-amber-400 stroke-amber-400'
                                : 'stroke-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specific Category Ratings */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800 text-xs">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">
                      Crust ({crustScore}/5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={crustScore}
                      onChange={(e) => setCrustScore(parseFloat(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">
                      Sauce ({sauceScore}/5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={sauceScore}
                      onChange={(e) => setSauceScore(parseFloat(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">
                      Cheese ({cheeseScore}/5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={cheeseScore}
                      onChange={(e) => setCheeseScore(parseFloat(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">
                    Tasting Notes & Undercarriage Details
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Char, crispness, flop factor, tomato sweetness, cheese quality..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {shop.userReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 bg-stone-850/70 border border-stone-800 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{rev.author}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-amber-400 font-mono">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        <span>{rev.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-stone-600">·</span>
                      <span className="text-stone-500">{rev.date}</span>
                    </div>
                  </div>

                  {/* Subscores */}
                  {(rev.crustScore || rev.sauceScore || rev.cheeseScore) && (
                    <div className="flex items-center gap-3 text-[11px] font-mono text-stone-400">
                      {rev.crustScore && (
                        <span>Crust: <b className="text-stone-200">{rev.crustScore}</b></span>
                      )}
                      {rev.sauceScore && (
                        <span>Sauce: <b className="text-stone-200">{rev.sauceScore}</b></span>
                      )}
                      {rev.cheeseScore && (
                        <span>Cheese: <b className="text-stone-200">{rev.cheeseScore}</b></span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-stone-300 leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
