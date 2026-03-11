'use client';

import { useEffect, useState } from 'react';
import { BusinessData } from '@/types/review';
import ReviewCard from './ReviewCard';
import { Star, MapPin, Users } from 'lucide-react';

interface ReviewsDisplayProps {
  placeId: string;
  compact?: boolean;
}

export default function ReviewsDisplay({ placeId, compact = false }: ReviewsDisplayProps) {
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/reviews?placeId=${placeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [placeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={`w-full ${compact ? 'max-w-2xl' : 'max-w-6xl'} mx-auto`}>
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-t-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-3">{data.name}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-blue-50">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            <span className="text-2xl font-semibold">{data.rating.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{data.totalReviews.toLocaleString()} reviews</span>
          </div>
          
          {data.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{data.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-b-2xl p-8 shadow-lg">
        {data.reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reviews available</p>
        ) : (
          <div className="space-y-4">
            {data.reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
