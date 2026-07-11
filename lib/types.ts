export type Category = "hike" | "bike" | "camp" | "other";

export interface Waypoint {
  lat: number;
  lng: number;
  title: string;
  photo_url?: string;
}

export interface Photo {
  url: string;
  caption?: string;
}

export interface Post {
  id: string;
  slug: string;
  title_uk: string;
  title_en: string | null;
  excerpt_uk: string | null;
  excerpt_en: string | null;
  content_uk: string | null;
  content_en: string | null;
  category: Category;
  days: number | null;
  distance_km: number | null;
  route: [number, number][] | null; // [lat, lng]
  waypoints: Waypoint[] | null;
  photos: Photo[] | null;
  cover_url: string | null;
  published: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
}
