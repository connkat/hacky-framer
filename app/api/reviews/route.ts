import { NextRequest, NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const queryPlaceId = request.nextUrl.searchParams.get('placeId');
    const envPlaceId = process.env.GOOGLE_PLACE_ID;
    const placeId = queryPlaceId || envPlaceId;
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

    if (!placeId) {
      return NextResponse.json(
        { error: 'placeId is required. Set GOOGLE_PLACE_ID in .env or pass as query parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Set GOOGLE_PLACES_API_KEY in .env' },
        { status: 500 }
      );
    }

    const cacheKey = `reviews-${placeId}`;

    if (!forceRefresh) {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        console.log('Returning cached reviews for', placeId);
        return NextResponse.json({
          ...cachedData,
          cached: true,
        });
      }
    }

    console.log('Fetching fresh reviews from Google API for', placeId);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total,formatted_address&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: data.status, message: data.error_message },
        { status: 400 }
      );
    }

    const reviewData = {
      name: data.result.name,
      rating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
      address: data.result.formatted_address,
      reviews: data.result.reviews || [],
    };

    await setCache(cacheKey, reviewData);

    return NextResponse.json({
      ...reviewData,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
