"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AdminProvider } from "@/contexts/AdminContext";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { HelmetProvider } from "react-helmet-async";
import { useState, Suspense } from "react";
import { AdminSettings } from "@/types/admin";

export function Providers({ children, initialAdminSettings }: { children: React.ReactNode; initialAdminSettings?: AdminSettings }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
                refetchOnWindowFocus: false,
                retry: 2,
            },
        },
    }));

    return (
        <HelmetProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <QueryClientProvider client={queryClient}>
                    <AdminProvider initialSettings={initialAdminSettings}>
                        <TooltipProvider>
                            <Suspense fallback={null}>
                                <AnalyticsProvider>
                                    {children}
                                    <Toaster />
                                    <Sonner />
                                </AnalyticsProvider>
                            </Suspense>
                        </TooltipProvider>
                    </AdminProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
}
