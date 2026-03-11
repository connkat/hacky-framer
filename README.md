# Google Business Reviews Display

A modern Next.js TypeScript application that fetches and displays Google Business reviews with a beautiful, customizable layout. Includes embeddable widget support for easy integration into any website.

## Features

- 🎨 Modern, responsive UI built with Tailwind CSS
- 📊 Display Google Business reviews with star ratings
- 🖼️ Customizable layout with gradient headers
- 🔗 Embeddable iframe version for easy website integration
- ⚡ Built with Next.js 15 and TypeScript
- 🎭 Profile photos and author information
- 📱 Mobile-friendly design
- 💾 **File-based review caching (24-hour cache duration)**
- 🔄 **Automatic review persistence to reduce API calls**
- 🌍 **Environment-based Place ID configuration**

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get a Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**
4. Create credentials (API Key)
5. Restrict the API key to Places API for security

### 3. Find Your Place ID

You need a Google Place ID for your business:

1. Visit [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business
3. Copy the Place ID

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
GOOGLE_PLACES_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=your_place_id_here
```

**Important**:

- Never commit your `.env.local` file to version control
- `GOOGLE_PLACE_ID` is **required** - the app uses this to fetch your business reviews

## Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **"Load Reviews"** to display your reviews.

## Review Persistence & Caching

Reviews are automatically cached for **24 hours** to reduce Google API calls and improve performance.

- **First request**: Fetches from Google Places API and saves to `.cache/` directory
- **Subsequent requests**: Returns cached data (indicated by `cached: true` in API response)
- **Cache location**: `.cache/reviews-{placeId}.json`
- **Cache duration**: 24 hours

**Force refresh cache:**

```
GET /api/reviews?refresh=true
```

## Using the Embed Widget

### Standalone HTML Embed

A standalone HTML file is available at `/public/embed.html`:

- **Serve directly** from your app: `https://yourdomain.com/embed.html`
- **Copy and host anywhere** - self-contained with inline CSS/JS
- **Customize** by editing the HTML file directly

```html
<iframe
  src="https://yourdomain.com/embed.html"
  width="100%"
  height="800"
  frameborder="0"
  style="border: 0;"
></iframe>
```

### Next.js Embed Route

Use the React-based embed page at `/embed`:

```html
<iframe
  src="https://yourdomain.com/embed"
  width="100%"
  height="800"
  frameborder="0"
  style="border: 0;"
></iframe>
```

Both options use `GOOGLE_PLACE_ID` from your environment configuration.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── reviews/
│   │       └── route.ts          # API endpoint with caching logic
│   ├── embed/
│   │   └── page.tsx              # Embeddable widget page
│   └── page.tsx                  # Main application page
├── components/
│   ├── ReviewCard.tsx            # Individual review card component
│   └── ReviewsDisplay.tsx        # Reviews container component
├── lib/
│   └── cache.ts                  # File-based caching utilities
├── types/
│   └── review.ts                 # TypeScript interfaces
├── .cache/                       # Cached review data (git-ignored)
└── next.config.ts                # Next.js configuration
```

## Customization

### Modify the Layout

Edit `components/ReviewsDisplay.tsx` to customize:

- Color scheme
- Card layout
- Header design
- Spacing and sizing

### Adjust the Embed View

Edit `app/embed/page.tsx` to customize the embedded version specifically.

## API Endpoint

The application includes an API route at `/api/reviews` that uses `GOOGLE_PLACE_ID` from environment:

**Get reviews:**

```
GET /api/reviews
```

**Force cache refresh:**

```
GET /api/reviews?refresh=true
```

**Response includes:**

- Business name
- Overall rating
- Total review count
- Address
- Array of reviews with author details, ratings, and text

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `GOOGLE_PLACES_API_KEY` environment variable in Vercel settings
4. Deploy

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service) - Reviews data

## License

MIT
