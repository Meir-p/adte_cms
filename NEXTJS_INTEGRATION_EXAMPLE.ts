// lib/strapi.ts
// Strapi API integration for Adte Events platform
// Place this file in your Next.js project

const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.warn('STRAPI_API_TOKEN is not set. API requests may fail.');
}

// Types
export interface StrapiImage {
  id: number;
  attributes: {
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
  };
}

export interface Event {
  id: number;
  attributes: {
    title: string;
    slug: string;
    shortDescription: string;
    eventUrl: string;
    eventDate: string;
    eventEndDate: string | null;
    location: string | null;
    eventType: 'conference' | 'webinar' | 'networking' | 'workshop' | 'trade-show' | 'other';
    isPastEvent: boolean;
    featured: boolean;
    registrationStatus: 'open' | 'closing-soon' | 'closed' | 'waitlist';
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    featuredImage: {
      data: StrapiImage;
    };
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Helper function to build Strapi image URLs
export function getStrapiImageUrl(url: string): string {
  if (url.startsWith('http')) {
    return url;
  }
  return `${STRAPI_API_URL}${url}`;
}

// Base fetch function
async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<StrapiResponse<T>> {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    ...options.headers,
  };

  const response = await fetch(`${STRAPI_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Get all events with optional filters
export async function fetchEvents(filters: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    'populate': '*',
    'sort[0]': 'displayOrder:asc',
    'sort[1]': 'eventDate:asc',
    ...filters,
  });

  return fetchStrapi<Event[]>(`/api/events?${queryParams}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
}

// Get upcoming events only
export async function getUpcomingEvents() {
  return fetchEvents({
    'filters[isPastEvent][$eq]': 'false',
  });
}

// Get past events only
export async function getPastEvents() {
  return fetchEvents({
    'filters[isPastEvent][$eq]': 'true',
    'sort[0]': 'eventDate:desc', // Most recent first
  });
}

// Get featured events only
export async function getFeaturedEvents() {
  return fetchEvents({
    'filters[featured][$eq]': 'true',
    'filters[isPastEvent][$eq]': 'false',
  });
}

// Get events by type
export async function getEventsByType(
  type: 'conference' | 'webinar' | 'networking' | 'workshop' | 'trade-show' | 'other'
) {
  return fetchEvents({
    'filters[eventType][$eq]': type,
    'filters[isPastEvent][$eq]': 'false',
  });
}

// Get events by registration status
export async function getEventsByStatus(
  status: 'open' | 'closing-soon' | 'closed' | 'waitlist'
) {
  return fetchEvents({
    'filters[registrationStatus][$eq]': status,
    'filters[isPastEvent][$eq]': 'false',
  });
}

// Get single event by ID
export async function getEventById(id: number) {
  return fetchStrapi<Event>(`/api/events/${id}?populate=*`, {
    next: { revalidate: 60 },
  });
}

// Get event by slug
export async function getEventBySlug(slug: string) {
  const response = await fetchStrapi<Event[]>(
    `/api/events?populate=*&filters[slug][$eq]=${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!response.data || response.data.length === 0) {
    return null;
  }

  return { ...response, data: response.data[0] };
}

// Example usage in Next.js App Router:
/*
// app/events/page.tsx
import { getUpcomingEvents, getStrapiImageUrl } from '@/lib/strapi';

export default async function EventsPage() {
  const { data: events } = await getUpcomingEvents();

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.attributes.title}</h2>
          <img
            src={getStrapiImageUrl(event.attributes.featuredImage.data.attributes.url)}
            alt={event.attributes.featuredImage.data.attributes.alternativeText || ''}
          />
          <p>{event.attributes.shortDescription}</p>
          <a href={event.attributes.eventUrl}>Register</a>
        </div>
      ))}
    </div>
  );
}

// app/events/[slug]/page.tsx
import { getEventBySlug, getStrapiImageUrl } from '@/lib/strapi';
import { notFound } from 'next/navigation';

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const response = await getEventBySlug(params.slug);

  if (!response) {
    notFound();
  }

  const event = response.data;

  return (
    <div>
      <h1>{event.attributes.title}</h1>
      <img
        src={getStrapiImageUrl(event.attributes.featuredImage.data.attributes.url)}
        alt={event.attributes.featuredImage.data.attributes.alternativeText || ''}
      />
      <p>{event.attributes.shortDescription}</p>
      <p>Location: {event.attributes.location}</p>
      <p>Date: {new Date(event.attributes.eventDate).toLocaleDateString()}</p>
      <p>Status: {event.attributes.registrationStatus}</p>
      <a href={event.attributes.eventUrl}>Register Now</a>
    </div>
  );
}
*/

