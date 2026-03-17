"use client";

import { useEffect, useState } from "react";
import { BusinessData } from "@/types/review";
import ReviewCard from "./ReviewCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewsDisplayProps {
  placeId: string;
  compact?: boolean;
}

export default function ReviewsDisplay({
  placeId,
  compact = false,
}: ReviewsDisplayProps) {
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const url = placeId
          ? `/api/reviews?placeId=${placeId}`
          : "/api/reviews";
        console.log("Fetching reviews from:", url);

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          console.error("API Error Response:", result);
          throw new Error(
            result.message || result.error || "Failed to fetch reviews",
          );
        }

        console.log("Reviews loaded successfully:", result);
        setData(result);
      } catch (err) {
        console.error("Error in fetchReviews:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [placeId]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!data || data.reviews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.reviews.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [data, isPaused]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            ⚠️ Error Loading Reviews
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="bg-white rounded p-4 text-left text-sm">
            <p className="font-semibold text-gray-900 mb-2">Common issues:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Check that GOOGLE_PLACE_ID is set in .env.local</li>
              <li>Check that GOOGLE_PLACES_API_KEY is set in .env.local</li>
              <li>Restart your dev server after adding env variables</li>
              <li>Verify your Place ID is correct</li>
              <li>Check that Places API is enabled in Google Cloud Console</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Filter for only 5-star reviews
  const fiveStarReviews = data.reviews.filter((review) => review.rating === 5);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % fiveStarReviews.length);
  };

  const prevReview = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + fiveStarReviews.length) % fiveStarReviews.length,
    );
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="w-full h-full"
    >
      <div className="bg-white shadow-lg h-full">
        {fiveStarReviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reviews available</p>
        ) : (
          <div
            className="flex flex-col h-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Container */}
            <div className="overflow-hidden flex-1">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {fiveStarReviews.map((review, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            {fiveStarReviews.length > 1 && (
              <div className="flex items-center justify-between mt-auto pt-6">
                <button
                  onClick={prevReview}
                  className="hover:opacity-60 transition-opacity"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-8 h-8 text-gray-700" />
                </button>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    {fiveStarReviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToReview(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "w-8 bg-blue-600"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to review ${index + 1}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">
                    {currentIndex + 1} of {fiveStarReviews.length}
                  </p>
                </div>

                <button
                  onClick={nextReview}
                  className="hover:opacity-60 transition-opacity"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-8 h-8 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
