import { NextRequest, NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const queryPlaceId = request.nextUrl.searchParams.get('placeId');
    const envPlaceId = process.env.GOOGLE_PLACE_ID;
    const placeId = queryPlaceId || envPlaceId;
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

    console.log('=== API Route Debug ===');
    console.log('Query placeId:', queryPlaceId);
    console.log('Env GOOGLE_PLACE_ID:', envPlaceId ? 'SET' : 'NOT SET');
    console.log('Final placeId:', placeId);

    if (!placeId) {
      console.error('❌ Missing Place ID');
      return NextResponse.json(
        { error: 'Missing Place ID', message: 'Set GOOGLE_PLACE_ID in your .env.local file' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      console.error('❌ Missing API Key');
      return NextResponse.json(
        { error: 'Missing API Key', message: 'Set GOOGLE_PLACES_API_KEY in your .env.local file' },
        { status: 500 }
      );
    }

    console.log('API Key:', apiKey ? 'SET' : 'NOT SET');

    const cacheKey = `reviews-${placeId}`;

    if (!forceRefresh) {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        console.log('Returning cached reviews');
        return NextResponse.json({
          ...cachedData,
          cached: true,
        });
      }
    }

    console.log('Fetching fresh reviews from Google API');
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total,formatted_address&key=${apiKey}`
    );

    const data = await response.json();

    console.log('Google API Response Status:', data.status);

    if (data.status !== 'OK') {
      console.error('❌ Google API Error:', data.status, data.error_message);
      return NextResponse.json(
        {
          error: `Google API Error: ${data.status}`,
          message: data.error_message || 'Invalid Place ID or API configuration',
          details: data
        },
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
    console.error('❌ Unexpected error fetching reviews:', error);
    return NextResponse.json(
      {
        error: 'Server Error',
        message: error instanceof Error ? error.message : 'Failed to fetch reviews',
        details: String(error)
      },
      { status: 500 }
    );
  }
}
