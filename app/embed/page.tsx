"use client";

import ReviewsDisplay from "@/components/ReviewsDisplay";

function EmbedContent() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ReviewsDisplay placeId="" compact />
    </div>
  );
}

export default function EmbedPage() {
  return <EmbedContent />;
}
