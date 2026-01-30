import { useEffect } from "react";

import { usePageTracking } from "@/hooks/useAnalytics";

export function AnalyticsProvider() {
  // Track all page views automatically
  usePageTracking();

  return null;
}
