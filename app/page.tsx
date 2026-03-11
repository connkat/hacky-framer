"use client";

import { useState } from "react";
import ReviewsDisplay from "@/components/ReviewsDisplay";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const [activeView, setActiveView] = useState(false);

  const handleLoadReviews = () => {
    setActiveView(true);
  };

  const embedUrl =
    typeof window !== "undefined" ? `${window.location.origin}/embed` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={handleLoadReviews}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-lg"
            >
              <RefreshCw className="w-6 h-6" />
              Load Reviews
            </button>
            <p className="mt-3 text-sm text-gray-500 text-center">
              Using GOOGLE_PLACE_ID from environment configuration
            </p>
          </div>

          {activeView && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Embed Code
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Copy this code to embed the reviews on your website:
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="800"\n  frameborder="0"\n  style="border: 0;"\n></iframe>`}</code>
              </pre>
              <p className="mt-3 text-xs text-gray-500">
                Or use:{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  {embedUrl.replace("/embed", "/embed.html")}
                </code>{" "}
                for the standalone HTML version
              </p>
            </div>
          )}
        </div>

        {activeView && (
          <div className="mb-12">
            <ReviewsDisplay placeId="" />
          </div>
        )}
      </div>
    </div>
  );
}
