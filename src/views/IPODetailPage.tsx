"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { applyTemplate } from "@/types/admin";
import { StatusBadge, TypeBadge, IPOTimeline, ShareButtons, BreadcrumbNav } from "@/components/shared";
import { parseIPODate } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck } from "lucide-react";
import { analytics, useScrollTracking, useTimeOnPage } from "@/hooks/useAnalytics";
import { PDFDownloadButton, WidgetRenderer, RelatedIPOs } from "@/components/ipo";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import Image from "next/image";

import { IPODetail, IPOStatus } from "@/types/ipo";

interface IPODetailPageProps {
  initialData?: IPODetail;
  relatedIpos?: IPOStatus[];
}

export default function IPODetailPage({ initialData, relatedIpos = [] }: IPODetailPageProps) {
  const params = useParams();
  const slug = params?.slug as string;
  const { settings } = useAdmin();
  const data = initialData ? { data: initialData } : undefined;
  const isLoading = false;
  const error = null;

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
            { id: 'ai_insights' as const, enabled: true, order: 1 },
            { id: 'subscription_table' as const, enabled: true, order: 2 },
            { id: 'key_metrics' as const, enabled: true, order: 3 },
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
          ]
        },
      ],
      sidebarWidgets: [
        { id: 'key_metrics' as const, enabled: true, order: 0 },
      ]
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

  // Parse issue price from string, fallback to price band upper limit
  const getIssuePrice = (): number => {
    const issuePriceStr = basicInfo["Issue Price"];
    if (issuePriceStr) {
      const price = parseFloat(issuePriceStr.replace(/[^\d.]/g, ""));
      if (price > 0) return price;
    }

    // Fallback to extracting upper price from Price Band (e.g., "₹100 to ₹105")
    const priceBand = basicInfo["Price Band"];
    if (priceBand) {
      const matches = priceBand.match(/(\d+)\s*to\s*(\d+)/i);
      if (matches && matches[2]) {
        return parseFloat(matches[2]);
      }
      // Try to extract any number from price band as last resort
      const numbers = priceBand.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        return parseFloat(numbers[numbers.length - 1]);
      }
    }

    return 0;
  };

  const issuePrice = getIssuePrice();
  const lotSize = parseInt(basicInfo["Lot Size"]?.replace(/[^\d]/g, "") || "0");

  // Template variables for SEO
  const templateVars = {
    ipo_name: basicInfo["IPO Name"] || slug,
    company_name: basicInfo["IPO Name"] || slug,
    gmp_value: gmpData?.current_gmp ?? 0,
    gmp_percent: gmpData?.current_gmp && issuePrice ? ((gmpData.current_gmp / issuePrice) * 100).toFixed(2) : "0",
    listing_date: timeline["Listing"] || "TBA",
    open_date: timeline["IPO Open"] || "",
    close_date: timeline["IPO Close"] || "",
    issue_price: issuePrice,
    subscription_times: subscription?.SubscriptionTable?.[0]?.["Subscription (times)"]
      ? parseFloat(String(subscription.SubscriptionTable[0]["Subscription (times)"]).replace(/,/g, ""))
      : 0,
  };

  const pageTitle = applyTemplate(pageSettings.titleTemplate, templateVars);
  const pageDescription = applyTemplate(pageSettings.descriptionTemplate, templateVars);

  // Determine status
  const now = new Date();
  const openDate = parseIPODate(timeline["IPO Open"]);
  const closeDate = parseIPODate(timeline["IPO Close"]);
  const allotmentDate = parseIPODate(timeline["Allotment"]);
  const refundDate = parseIPODate(timeline["Refund"]);
  const creditDate = parseIPODate(timeline["Credit of Shares"]);
  const listingDate = parseIPODate(timeline["Listing"]);

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

  // Build timeline steps with correct API keys
  const timelineSteps = [
    { label: "IPO Open", date: timeline["IPO Open"] || "TBA", status: getStepStatus(openDate) },
    { label: "IPO Close", date: timeline["IPO Close"] || "TBA", status: getStepStatus(closeDate) },
    { label: "Allotment", date: timeline["Allotment"] || "TBA", status: getStepStatus(allotmentDate) },
    { label: "Refund Initiation", date: timeline["Refund"] || "TBA", status: getStepStatus(refundDate) },
    { label: "Credit to Demat", date: timeline["Credit of Shares"] || "TBA", status: getStepStatus(creditDate) },
    { label: "Listing", date: timeline["Listing"] || "TBA", status: getStepStatus(listingDate) },
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
    listingInfo: ipo.listing_info,
    gainLossPercent: ipo.gain_loss_percent,
    aiData: ipo.ai_data
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
          "text": `The tentative allotment date for ${basicInfo["IPO Name"]} is ${timeline["Allotment"] || "to be announced"}.`,
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

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ipohut.com" },
      { "@type": "ListItem", "position": 2, "name": ipo.ipo_type === "sme" ? "SME IPO" : "Mainboard IPO", "item": `https://ipohut.com/${ipo.ipo_type}-ipo` },
      { "@type": "ListItem", "position": 3, "name": basicInfo["IPO Name"], "item": `https://ipohut.com/ipo/${slug}` }
    ]
  };

  // Sort widgets
  const sortedAboveFoldWidgets = [...detailConfig.aboveFoldWidgets]
    .filter(w => w.enabled)
    .sort((a, b) => a.order - b.order);

  const sidebarWidgets = (detailConfig.sidebarWidgets || []).length > 0
    ? detailConfig.sidebarWidgets
    : [
      { id: 'key_metrics' as const, enabled: true, order: 0 },
    ];

  const sortedSidebarWidgets = [...sidebarWidgets]
    .filter(w => w.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <MainLayout>
        <div className="container max-w-7xl px-4 sm:px-6 py-6 md:py-10 space-y-8">
          <BreadcrumbNav
            items={[
              { label: ipo.ipo_type === "sme" ? "SME IPO" : "Mainboard IPO", href: ipo.ipo_type === "sme" ? "/sme-ipo" : "/mainboard-ipo" },
              { label: basicInfo["IPO Name"]?.replace(" IPO", "") || slug || "" }
            ]}
          />

          {/* Clean Modern Header */}
          <header className="flex flex-col md:flex-row md:items-start gap-6 border-b pb-8">
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-start gap-4">
                {detailConfig.showLogo && ipo.logo_about?.logo && (
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl border bg-white p-2 shrink-0 shadow-sm flex items-center justify-center overflow-hidden">
                    <Image
                      src={ipo.logo_about.logo}
                      alt={`${basicInfo["IPO Name"]} Logo`}
                      width={80}
                      height={80}
                      className="max-h-full max-w-full object-contain"
                      priority
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={status} />
                    <TypeBadge type={ipo.ipo_type} />
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {basicInfo["IPO Name"]}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground ml-0 md:ml-24">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">Listing At:</span> {basicInfo["Listing At"]}
                </div>
                {basicInfo["Issue Type"] && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">Type:</span> {basicInfo["Issue Type"]}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 ml-0 md:ml-auto md:self-center">
              {detailConfig.showAllotmentButton && (status === "listed" || status === "recently_listed") && (
                <Link
                  href={`/ipo/${slug}/allotment`}
                  className="w-full sm:w-auto"
                  aria-label={`Check allotment status for ${basicInfo["IPO Name"]}`}
                >
                  <Button variant="default" className="w-full gap-2 shadow-sm hover:shadow-md transition-all">
                    <FileCheck className="h-4 w-4" />
                    Check Allotment
                  </Button>
                </Link>
              )}
              <div className="flex gap-2 w-full sm:w-auto">
                {detailConfig.showPDFDownload && (
                  <PDFDownloadButton ipo={ipo} status={status} />
                )}
                {detailConfig.showShareButton && (
                  <ShareButtons
                    title={basicInfo["IPO Name"]}
                    description={`${basicInfo["IPO Name"]} - Issue Price: ${basicInfo["Issue Price"]}, Listing: ${timeline["Listing"]}`}
                  />
                )}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">

              {/* Above Fold Widgets */}
              <div className="space-y-8">
                {sortedAboveFoldWidgets.map(widget => (
                  <WidgetRenderer key={widget.id} widgetId={widget.id} data={widgetData} />
                ))}
              </div>

              {/* Minimal Tabs */}
              {enabledTabs.length > 0 && (
                <Tabs defaultValue={enabledTabs[0]?.id} className="w-full" onValueChange={handleTabChange}>
                  <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 -mx-4 px-4 md:mx-0 md:px-0">
                    <ScrollArea className="w-full whitespace-nowrap pb-2">
                      <TabsList className="h-auto bg-transparent p-0 gap-6 border-b w-full justify-start rounded-none">
                        {enabledTabs.map(tab => (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <ScrollBar orientation="horizontal" className="invisible" />
                    </ScrollArea>
                  </div>

                  {enabledTabs.map(tab => {
                    const sortedWidgets = [...tab.widgets]
                      .filter(w => w.enabled)
                      .sort((a, b) => a.order - b.order);

                    return (
                      <TabsContent key={tab.id} value={tab.id} className="mt-6 space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        {sortedWidgets.length > 0 ? (
                          sortedWidgets.map(widget => (
                            <WidgetRenderer key={widget.id} widgetId={widget.id} data={widgetData} />
                          ))
                        ) : (
                          <div className="py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                            No content available for this section
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              )}

              {/* Mobile Only Related IPOs */}
              <div className="lg:hidden space-y-6 mt-8">
                {Array.isArray(relatedIpos) && relatedIpos.length > 0 && (
                  <RelatedIPOs
                    relatedIpos={relatedIpos}
                    title={`Other ${String(ipo.ipo_type) === 'sme' ? 'SME' : 'Mainboard'} IPOs`}
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Related IPOs Sidebar - Better SEO & Internal Linking */}
                {Array.isArray(relatedIpos) && relatedIpos.length > 0 && (
                  <RelatedIPOs
                    relatedIpos={relatedIpos}
                    title={`Other ${String(ipo.ipo_type) === 'sme' ? 'SME' : 'Mainboard'} IPOs`}
                  />
                )}

                {sortedSidebarWidgets.map(widget => (
                  <WidgetRenderer key={widget.id} widgetId={widget.id} data={widgetData} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {/* JSON-LD - Injected in Body for now, or use next/script if needed, but plain script works */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
    </>
  );
}
