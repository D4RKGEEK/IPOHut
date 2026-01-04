"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useIPODetail } from "@/hooks/useIPO";
import { applyTemplate } from "@/types/admin";
import { StatusBadge, TypeBadge, IPOTimeline, ShareButtons, BreadcrumbNav } from "@/components/shared";
import { parseIPODate } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck } from "lucide-react";
import { analytics, useScrollTracking, useTimeOnPage } from "@/hooks/useAnalytics";
import { PDFDownloadButton, WidgetRenderer } from "@/components/ipo";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from "react";

import { IPODetail } from "@/types/ipo";

interface IPODetailPageProps {
  initialData?: IPODetail;
}

export default function IPODetailPage({ initialData }: IPODetailPageProps) {
  const params = useParams();
  const slug = params?.slug as string;
  const { settings } = useAdmin();
  const { data: queryData, isLoading, error } = useIPODetail(slug || "", {
    enabled: !initialData, // Only fetch if no initial data
  });

  const data = initialData ? { data: initialData } : queryData;

  // Track scroll and time on page
  useScrollTracking(`ipo-detail-${slug}`);
  useTimeOnPage(`ipo-detail-${slug}`);

  const pageSettings = settings.pages.ipoDetail;
  const rawDetailConfig = settings.site.ipoDetailConfig;

  // Migrate old format to new format if needed
  const detailConfig = useMemo(() => {
    const isNewFormat = Array.isArray(rawDetailConfig.tabs);

    if (isNewFormat && rawDetailConfig.aboveFoldWidgets) {
      return rawDetailConfig;
    }

    // Return defaults for old format
    return {
      showLogo: rawDetailConfig.showLogo ?? true,
      showBadges: rawDetailConfig.showBadges ?? true,
      showShareButton: rawDetailConfig.showShareButton ?? true,
      showPDFDownload: rawDetailConfig.showPDFDownload ?? true,
      showAllotmentButton: true,
      aboveFoldWidgets: [
        { id: 'vital_stats' as const, enabled: true, order: 0 },
        { id: 'gmp_widget' as const, enabled: true, order: 1 },
        { id: 'market_chart' as const, enabled: true, order: 2 },
      ],
      tabs: [
        {
          id: 'overview', label: 'Overview', enabled: true, widgets: [
            { id: 'timeline' as const, enabled: true, order: 0 },
            { id: 'subscription_table' as const, enabled: true, order: 1 },
            { id: 'key_metrics' as const, enabled: true, order: 2 },
            { id: 'broker_sentiment' as const, enabled: true, order: 3 },
          ]
        },
        {
          id: 'subscription', label: 'Subscription', enabled: true, widgets: [
            { id: 'subscription_table' as const, enabled: true, order: 0 },
          ]
        },
        {
          id: 'details', label: 'Details', enabled: true, widgets: [
            { id: 'basic_info' as const, enabled: true, order: 0 },
            { id: 'lot_size_table' as const, enabled: true, order: 1 },
            { id: 'reservation_table' as const, enabled: true, order: 2 },
            { id: 'objectives' as const, enabled: true, order: 3 },
          ]
        },
        {
          id: 'financials', label: 'Financials', enabled: true, widgets: [
            { id: 'financials' as const, enabled: true, order: 0 },
            { id: 'key_metrics' as const, enabled: true, order: 1 },
            { id: 'promoter_holding' as const, enabled: true, order: 2 },
          ]
        },
        {
          id: 'about', label: 'About', enabled: true, widgets: [
            { id: 'about_company' as const, enabled: true, order: 0 },
            { id: 'faq_section' as const, enabled: true, order: 1 },
          ]
        },
        {
          id: 'contacts', label: 'Contacts', enabled: true, widgets: [
            { id: 'contact_registrar' as const, enabled: true, order: 0 },
          ]
        },
        {
          id: 'tools', label: 'Tools', enabled: true, widgets: [
            { id: 'gmp_calculator' as const, enabled: true, order: 0 },
            { id: 'broker_sentiment' as const, enabled: true, order: 1 },
          ]
        },
      ],
    };
  }, [rawDetailConfig]);

  const handleTabChange = (tabName: string) => {
    analytics.ipoTabChange(slug || "", tabName);
  };

  // Get enabled tabs
  const enabledTabs = useMemo(() => {
    return detailConfig.tabs.filter(tab => tab.enabled);
  }, [detailConfig.tabs]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container px-2 sm:px-4 md:px-6 py-4 md:py-8 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64" />
        </div>
      </MainLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <MainLayout title="IPO Not Found">
        <div className="container px-2 sm:px-4 md:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">IPO Not Found</h1>
          <p className="text-muted-foreground mb-6">The IPO you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const ipo = data.data;
  const basicInfo = ipo.basic_info;
  const timeline = ipo.ipo_timeline;
  const gmpData = ipo.gmp_data;
  const financials = ipo.financials;
  const subscription = ipo.subscription_status;
  const recommendations = ipo.ipo_recommendation_summary;
  const registrar = ipo.contact_and_registrar?.ipo_registrar_lead_managers;
  const peMetrics = ipo.pe_metrics;
  const promoterHolding = ipo.promoter_holding;
  const objectives = ipo.objectives;
  const lotSizeTable = ipo.lot_size_table;
  const reservationTable = ipo.reservation_table;
  const aboutCompany = ipo.about_company;
  const leadManagers = registrar?.lead_managers;
  const marketData = ipo.market_data;

  // Parse issue price from string
  const issuePrice = parseFloat(basicInfo["Issue Price"]?.replace(/[^\d.]/g, "") || "0");
  const lotSize = parseInt(basicInfo["Lot Size"]?.replace(/[^\d]/g, "") || "0");

  // Template variables for SEO
  const templateVars = {
    ipo_name: basicInfo["IPO Name"] || slug,
    company_name: basicInfo["IPO Name"] || slug,
    gmp_value: gmpData?.current_gmp ?? 0,
    gmp_percent: gmpData?.current_gmp && issuePrice ? ((gmpData.current_gmp / issuePrice) * 100).toFixed(2) : "0",
    listing_date: timeline["Tentative Listing Date"] || "TBA",
    open_date: timeline["IPO Open Date"] || "",
    close_date: timeline["IPO Close Date"] || "",
    issue_price: issuePrice,
    subscription_times: subscription?.SubscriptionTable?.[0]?.subscription_times ?? 0,
  };

  const pageTitle = applyTemplate(pageSettings.titleTemplate, templateVars);
  const pageDescription = applyTemplate(pageSettings.descriptionTemplate, templateVars);

  // Determine status
  const now = new Date();
  const openDate = parseIPODate(timeline["IPO Open Date"]);
  const closeDate = parseIPODate(timeline["IPO Close Date"]);
  const allotmentDate = parseIPODate(timeline["Tentative Allotment"]);
  const refundDate = parseIPODate(timeline["Initiation of Refunds"]);
  const creditDate = parseIPODate(timeline["Credit of Shares to Demat"]);
  const listingDate = parseIPODate(timeline["Tentative Listing Date"]);

  let status = "upcoming";
  if (listingDate && now > listingDate) status = "listed";
  else if (closeDate && now > closeDate) status = "closed";
  else if (openDate && now >= openDate) status = "open";

  // Helper to determine step status
  const getStepStatus = (date: Date | null): "completed" | "current" | "upcoming" => {
    if (!date) return "upcoming";
    if (now >= date) return "completed";
    return "upcoming";
  };

  // Build timeline steps
  const timelineSteps = [
    { label: "IPO Open", date: timeline["IPO Open Date"] || "TBA", status: getStepStatus(openDate) },
    { label: "IPO Close", date: timeline["IPO Close Date"] || "TBA", status: getStepStatus(closeDate) },
    { label: "Allotment", date: timeline["Tentative Allotment"] || "TBA", status: getStepStatus(allotmentDate) },
    { label: "Refund Initiation", date: timeline["Initiation of Refunds"] || "TBA", status: getStepStatus(refundDate) },
    { label: "Credit to Demat", date: timeline["Credit of Shares to Demat"] || "TBA", status: getStepStatus(creditDate) },
    { label: "Listing", date: timeline["Tentative Listing Date"] || "TBA", status: getStepStatus(listingDate) },
  ].map(step => ({
    ...step,
    status: step.status as "completed" | "current" | "upcoming",
  }));

  // Widget data object
  const widgetData = {
    basicInfo,
    timeline,
    gmpData,
    financials,
    subscription,
    recommendations,
    registrar,
    peMetrics,
    promoterHolding,
    objectives,
    lotSizeTable,
    reservationTable,
    aboutCompany,
    leadManagers,
    marketData,
    timelineSteps,
    issuePrice,
    lotSize,
    status,
    slug: slug || "",
  };

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": basicInfo["IPO Name"],
    "description": ipo.about_company?.about_company || pageDescription,
    "provider": {
      "@type": "Organization",
      "name": basicInfo["IPO Name"]?.replace(" IPO", ""),
    },
    "offers": {
      "@type": "Offer",
      "price": issuePrice,
      "priceCurrency": "INR",
      "availability": status === "open" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the GMP of ${basicInfo["IPO Name"]}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The current Grey Market Premium (GMP) of ${basicInfo["IPO Name"]} is ₹${gmpData?.current_gmp ?? 0}.`,
        },
      },
      {
        "@type": "Question",
        "name": `When is the allotment of ${basicInfo["IPO Name"]}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The tentative allotment date for ${basicInfo["IPO Name"]} is ${timeline["Tentative Allotment"] || "to be announced"}.`,
        },
      },
      {
        "@type": "Question",
        "name": `What is the issue price of ${basicInfo["IPO Name"]}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The issue price of ${basicInfo["IPO Name"]} is ${basicInfo["Issue Price"] || "to be announced"}.`,
        },
      },
    ],
  };

  // Sort above fold widgets
  const sortedAboveFoldWidgets = [...detailConfig.aboveFoldWidgets]
    .filter(w => w.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <MainLayout>
        <div className="container px-2 sm:px-4 md:px-6 py-4 md:py-8 space-y-3 sm:space-y-4 md:space-y-6">
          <BreadcrumbNav
            items={[
              { label: ipo.ipo_type === "sme" ? "SME IPO" : "Mainboard IPO", href: ipo.ipo_type === "sme" ? "/sme-ipo" : "/mainboard-ipo" },
              { label: basicInfo["IPO Name"]?.replace(" IPO", "") || slug || "" }
            ]}
          />

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            {detailConfig.showLogo && ipo.logo_about?.logo && (
              <img
                src={ipo.logo_about.logo}
                alt={basicInfo["IPO Name"]}
                className="h-10 w-10 sm:h-16 sm:w-16 rounded-md border object-contain bg-white p-1 shrink-0"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">{basicInfo["IPO Name"]}</h1>
                {detailConfig.showBadges && (
                  <>
                    <TypeBadge type={ipo.ipo_type} />
                    <StatusBadge status={status} />
                  </>
                )}
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {basicInfo["Listing At"]} • {basicInfo["Issue Type"] || "Book Built"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
              {detailConfig.showAllotmentButton && (
                <Link href={`/ipo/${slug}/allotment`}>
                  <Button variant="default" size="sm" className="gap-1.5">
                    <FileCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Check Allotment</span>
                    <span className="sm:hidden">Allotment</span>
                  </Button>
                </Link>
              )}
              {detailConfig.showShareButton && (
                <ShareButtons
                  title={basicInfo["IPO Name"]}
                  description={`${basicInfo["IPO Name"]} - Issue Price: ${basicInfo["Issue Price"]}, Listing: ${timeline["Tentative Listing Date"]}`}
                />
              )}
              {detailConfig.showPDFDownload && (
                <PDFDownloadButton ipo={ipo} status={status} />
              )}
            </div>
          </header>

          {/* Above Fold Widgets */}
          {sortedAboveFoldWidgets.map(widget => (
            <WidgetRenderer key={widget.id} widgetId={widget.id} data={widgetData} />
          ))}

          {/* Tabs */}
          {enabledTabs.length > 0 && (
            <Tabs defaultValue={enabledTabs[0]?.id} className="w-full" onValueChange={handleTabChange}>
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex h-10 items-center gap-1 bg-muted/50 p-1 rounded-lg w-max min-w-full sm:w-auto">
                  {enabledTabs.map(tab => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" className="invisible" />
              </ScrollArea>

              {enabledTabs.map(tab => {
                const sortedWidgets = [...tab.widgets]
                  .filter(w => w.enabled)
                  .sort((a, b) => a.order - b.order);

                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                    {sortedWidgets.length > 0 ? (
                      sortedWidgets.map(widget => (
                        <WidgetRenderer key={widget.id} widgetId={widget.id} data={widgetData} />
                      ))
                    ) : (
                      <Card className="border">
                        <CardContent className="py-12 text-center text-muted-foreground">
                          No content available for this tab
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </MainLayout>

      {/* JSON-LD - Injected in Body for now, or use next/script if needed, but plain script works */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
    </>
  );
}
