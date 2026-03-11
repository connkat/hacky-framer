import { Review } from "@/types/review";
import { Star, User } from "lucide-react";
import Image from "next/image";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="hidden md:block flex-shrink-0">
          {review.profile_photo_url ? (
            <Image
              src={review.profile_photo_url}
              alt={review.author_name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-1">
            <h3 className="font-semibold text-gray-900">
              {review.author_name}
            </h3>
            <span className="text-sm text-gray-500">
              {review.relative_time_description}
            </span>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed line-clamp-4">
            {review.text}
          </p>
        </div>
      </div>
    </div>
  );
}
