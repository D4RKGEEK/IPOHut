import { useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = "G-4NKZT0DTZX";

// Track page views
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);
}

// Track custom events
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

// Predefined event trackers for common actions
export const analytics = {
  // Navigation events
  navClick: (menuItem: string) => trackEvent("nav_click", { menu_item: menuItem }),
  logoClick: () => trackEvent("logo_click"),

  // IPO events
  ipoCardClick: (ipoName: string, ipoSlug: string) =>
    trackEvent("ipo_card_click", { ipo_name: ipoName, ipo_slug: ipoSlug }),
  ipoDetailView: (ipoName: string, ipoSlug: string) =>
    trackEvent("ipo_detail_view", { ipo_name: ipoName, ipo_slug: ipoSlug }),
  ipoTabChange: (ipoSlug: string, tabName: string) =>
    trackEvent("ipo_tab_change", { ipo_slug: ipoSlug, tab_name: tabName }),

  // Allotment events
  allotmentCheckClick: (ipoName: string) =>
    trackEvent("allotment_check_click", { ipo_name: ipoName }),
  registrarLinkClick: (registrar: string, ipoName: string) =>
    trackEvent("registrar_link_click", { registrar, ipo_name: ipoName }),

  // Share events
  shareClick: (platform: string, ipoName: string) =>
    trackEvent("share_click", { platform, ipo_name: ipoName }),
  copyLinkClick: (ipoName: string) =>
    trackEvent("copy_link_click", { ipo_name: ipoName }),

  // Download events
  pdfDownload: (ipoName: string) =>
    trackEvent("pdf_download", { ipo_name: ipoName }),

  // Tools events
  toolOpen: (toolName: string) =>
    trackEvent("tool_open", { tool_name: toolName }),
  ipoSelect: (toolName: string, ipoName: string) =>
    trackEvent("ipo_select", { tool_name: toolName, ipo_name: ipoName }),
  calculatorUse: (calculatorType: string, values: Record<string, number>) =>
    trackEvent("calculator_use", { calculator_type: calculatorType, ...values }),
  compareAdd: (ipoName: string, position: number) =>
    trackEvent("compare_add", { ipo_name: ipoName, position }),
  compareRemove: (ipoName: string) =>
    trackEvent("compare_remove", { ipo_name: ipoName }),

  // Filter & Sort events
  filterApply: (filterType: string, filterValue: string) =>
    trackEvent("filter_apply", { filter_type: filterType, filter_value: filterValue }),
  sortApply: (sortBy: string, sortOrder: string) =>
    trackEvent("sort_apply", { sort_by: sortBy, sort_order: sortOrder }),

  // Scroll events
  scrollDepth: (pageName: string, depth: number) =>
    trackEvent("scroll_depth", { page_name: pageName, depth_percent: depth }),

  // Chart events
  chartInteraction: (chartType: string, action: string) =>
    trackEvent("chart_interaction", { chart_type: chartType, action }),
  chartPeriodChange: (ipoSlug: string, period: string) =>
    trackEvent("chart_period_change", { ipo_slug: ipoSlug, period }),

  // Search events
  searchQuery: (query: string, resultsCount: number) =>
    trackEvent("search_query", { query, results_count: resultsCount }),
  searchResultClick: (query: string, resultName: string) =>
    trackEvent("search_result_click", { query, result_name: resultName }),

  // Theme events
  themeChange: (theme: string) =>
    trackEvent("theme_change", { theme }),

  // External link clicks
  externalLinkClick: (url: string, linkType: string) =>
    trackEvent("external_link_click", { url, link_type: linkType }),

  // FAQ events
  faqExpand: (question: string, ipoName?: string) =>
    trackEvent("faq_expand", { question: question.substring(0, 100), ipo_name: ipoName || "general" }),

  // Error events
  errorOccurred: (errorType: string, errorMessage: string) =>
    trackEvent("error_occurred", { error_type: errorType, error_message: errorMessage.substring(0, 100) }),
};

// Hook to track scroll depth
export function useScrollTracking(pageName: string) {
  useEffect(() => {
    let maxDepth = 0;
    const thresholds = [25, 50, 75, 90, 100];
    const reportedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      if (depth > maxDepth) {
        maxDepth = depth;

        thresholds.forEach((threshold) => {
          if (depth >= threshold && !reportedThresholds.has(threshold)) {
            reportedThresholds.add(threshold);
            analytics.scrollDepth(pageName, threshold);
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageName]);
}

// Hook for tracking time on page
export function useTimeOnPage(pageName: string) {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // Only track if more than 5 seconds
        trackEvent("time_on_page", {
          page_name: pageName,
          time_seconds: timeSpent,
        });
      }
    };
  }, [pageName]);
}
