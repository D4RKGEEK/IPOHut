import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { 
  fetchGains, 
  fetchStatus, 
  fetchNews, 
  fetchCalendar, 
  fetchIPODetail 
} from "@/lib/api";
import { APIResponse, IPOGain, IPOStatus, IPONews, IPOCalendar, IPODetail } from "@/types/ipo";

// Stale time: 5 minutes to match API cache
const STALE_TIME = 5 * 60 * 1000;

export function useIPOGains(params?: Parameters<typeof fetchGains>[0]) {
  return useQuery({
    queryKey: ["ipo-gains", params],
    queryFn: () => fetchGains(params),
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
  });
}

export function useIPOStatus(params: Parameters<typeof fetchStatus>[0]) {
  return useQuery({
    queryKey: ["ipo-status", params],
    queryFn: () => fetchStatus(params),
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
  });
}

export function useIPONews(params?: Parameters<typeof fetchNews>[0]) {
  return useQuery({
    queryKey: ["ipo-news", params],
    queryFn: () => fetchNews(params),
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
  });
}

export function useIPOCalendar(params?: Parameters<typeof fetchCalendar>[0]) {
  return useQuery({
    queryKey: ["ipo-calendar", params],
    queryFn: () => fetchCalendar(params),
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
  });
}

export function useIPODetail(slug: string, options?: Partial<UseQueryOptions<APIResponse<IPODetail>>>) {
  return useQuery({
    queryKey: ["ipo-detail", slug],
    queryFn: () => fetchIPODetail(slug),
    staleTime: STALE_TIME,
    enabled: !!slug,
    ...options,
  });
}

// Specific hooks for common use cases
export function useOpenIPOs(limit = 10) {
  return useIPOStatus({ status: "open", limit });
}

export function useUpcomingIPOs(limit = 10) {
  return useIPOStatus({ status: "upcoming", limit });
}

export function useRecentlyListedIPOs(limit = 10) {
  return useIPOStatus({ status: "recently_listed", limit });
}

export function useClosedIPOs(limit = 20) {
  return useIPOStatus({ status: "closed", limit });
}

export function useTopGainers(limit = 10) {
  return useIPOGains({ sort_by: "listing_gain_percent", order: "desc", limit });
}

export function useTopLosers(limit = 10) {
  return useIPOGains({ sort_by: "listing_gain_percent", order: "asc", limit });
}

export function useGMPIPOs(limit = 50) {
  return useIPOCalendar({ has_gmp: true, sort_by: "gmp", order: "desc", limit });
}

export function useMainboardIPOs(limit = 50) {
  return useIPOCalendar({ ipo_type: "mainboard", limit });
}

export function useSMEIPOs(limit = 50) {
  return useIPOCalendar({ ipo_type: "sme", limit });
}
