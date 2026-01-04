import { APIResponse, IPOGain, IPOStatus, IPONews, IPOCalendar, IPODetail } from "@/types/ipo";

const BASE_URL = "https://ipo-api-production.up.railway.app";

async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): Promise<APIResponse<T>> {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Gains API
export async function fetchGains(params?: {
  sort_by?: "listing_gain_percent" | "name" | "issue_price" | "current_price" | "listing_date" | "subscription_times";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<APIResponse<IPOGain[]>> {
  return fetchAPI<IPOGain[]>("/api/ipos/gains", params);
}

// Status API
export async function fetchStatus(params: {
  status: "open" | "closed" | "recently_listed" | "upcoming" | "listed";
  sort_by?: string;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<APIResponse<IPOStatus[]>> {
  return fetchAPI<IPOStatus[]>("/api/ipos/status", params);
}

// News API
export async function fetchNews(params?: {
  type?:
  | "announcement"
  | "opening_today"
  | "closing_today"
  | "listing"
  | "subscription"
  | "gmp"
  | "allotment_date"
  | "shares_credited";
  priority?: "high" | "medium" | "low";
  limit?: number;
  offset?: number;
}): Promise<APIResponse<IPONews[]>> {
  return fetchAPI<IPONews[]>("/api/ipos/news", params);
}

// Calendar API
export async function fetchCalendar(params?: {
  month?: number;
  year?: number;
  status?: "open" | "closed" | "upcoming" | "listed";
  ipo_type?: "mainboard" | "sme";
  listing_at?: string;
  min_issue_size?: number;
  max_issue_size?: number;
  has_subscription?: boolean;
  has_gmp?: boolean;
  sort_by?: "open_date" | "close_date" | "listing_date" | "issue_size" | "subscription_times" | "gmp";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<APIResponse<IPOCalendar[]>> {
  return fetchAPI<IPOCalendar[]>("/api/ipos/calendar", params);
}

// Detail API
export async function fetchIPODetail(slug: string): Promise<APIResponse<IPODetail>> {
  return fetchAPI<IPODetail>(`/api/ipos/${slug}/details`);
}

// Metadata API (for sitemap/static params)
export async function fetchIPOMetadata(): Promise<APIResponse<Array<{ slug: string; name: string; updated_at: string }>>> {
  // The user specified: https://ipo-api-production.up.railway.app/api/ipos/metadata
  // Our base URL is already set to that domain.
  return fetchAPI<Array<{ slug: string; name: string; updated_at: string }>>("/api/ipos/metadata");
}

// Helper to format currency
export function formatCurrency(value: number | string | undefined, showSymbol = true): string {
  if (value === undefined || value === null) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";

  const formatted = num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return showSymbol ? `₹${formatted}` : formatted;
}

// Helper to format large numbers (crores)
export function formatCrores(value: number | string | undefined): string {
  if (value === undefined || value === null) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";

  return `₹${num.toLocaleString("en-IN")} Cr`;
}

// Helper to format percentage
export function formatPercent(value: number | string | undefined): string {
  if (value === undefined || value === null) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";

  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

// Helper to format subscription times
export function formatSubscription(value: number | string | undefined): string {
  if (value === undefined || value === null) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";

  return `${num.toFixed(2)}x`;
}

// Helper to get status color class
export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case "open":
      return "status-open";
    case "closed":
      return "status-closed";
    case "upcoming":
      return "status-upcoming";
    case "listed":
    case "recently_listed":
      return "status-listed";
    default:
      return "";
  }
}

// Helper to get gain/loss color class
export function getGainLossClass(value: number | undefined): string {
  if (value === undefined || value === null) return "";
  return value >= 0 ? "text-gain" : "text-loss";
}

// Parse date string to Date object
export function parseIPODate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  // Handle formats like "Mon, Jan 13, 2025"
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  return null;
}

// Calculate days until/since date
export function getDaysUntil(dateStr: string | undefined): number | null {
  const date = parseIPODate(dateStr);
  if (!date) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
