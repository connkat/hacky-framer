export interface Review {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface BusinessData {
  name: string;
  rating: number;
  totalReviews: number;
  address: string;
  reviews: Review[];
  cached?: boolean;
}
