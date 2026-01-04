import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AdminProvider } from "@/contexts/AdminContext";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

import HomePage from "./pages/HomePage";
import IPODetailPage from "./pages/IPODetailPage";
import IPOAllotmentCheckerPage from "./pages/IPOAllotmentCheckerPage";
import MainboardIPOPage from "./pages/MainboardIPOPage";
import SMEIPOPage from "./pages/SMEIPOPage";
import GMPTrackerPage from "./pages/GMPTrackerPage";
import AllotmentStatusPage from "./pages/AllotmentStatusPage";
import IPOCalendarPage from "./pages/IPOCalendarPage";
import PerformanceTrackerPage from "./pages/PerformanceTrackerPage";
import IPOStatisticsPage from "./pages/IPOStatisticsPage";
import ToolsPage from "./pages/ToolsPage";
import InvestmentCalculatorPage from "./pages/tools/InvestmentCalculatorPage";
import CompareIPOPage from "./pages/tools/CompareIPOPage";
import ReturnsCalculatorPage from "./pages/tools/ReturnsCalculatorPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ipo/:slug" element={<IPODetailPage />} />
                  <Route path="/ipo/:slug/allotment" element={<IPOAllotmentCheckerPage />} />
                  <Route path="/mainboard-ipo" element={<MainboardIPOPage />} />
                  <Route path="/sme-ipo" element={<SMEIPOPage />} />
                  <Route path="/ipo-gmp-today" element={<GMPTrackerPage />} />
                  <Route path="/ipo-allotment-status" element={<AllotmentStatusPage />} />
                  <Route path="/ipo-calendar" element={<IPOCalendarPage />} />
                  <Route path="/ipo-listing-performance" element={<PerformanceTrackerPage />} />
                  <Route path="/ipo-statistics" element={<IPOStatisticsPage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/tools/investment-calculator" element={<InvestmentCalculatorPage />} />
                  <Route path="/tools/compare" element={<CompareIPOPage />} />
                  <Route path="/tools/returns-calculator" element={<ReturnsCalculatorPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnalyticsProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
