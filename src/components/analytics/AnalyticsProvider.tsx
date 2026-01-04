import { useEffect } from "react";

import { usePageTracking } from "@/hooks/useAnalytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Track all page views automatically
  usePageTracking();

  return <>{children}</>;
}
