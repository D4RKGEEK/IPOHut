import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useIPODetail } from "@/hooks/useIPO";
import { applyTemplate } from "@/types/admin";
import { StatusBadge, TypeBadge, IPOTimeline, GMPCalculator, BrokerSentiment } from "@/components/shared";
import { parseIPODate } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Phone, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  IPOVitalStats,
  IPOGMPWidget,
  LotSizeTable,
  ReservationTable,
  PromoterHolding,
  ObjectivesList,
  LeadManagersList,
  KeyMetrics,
  SubscriptionTable,
  CompanyFinancials,
  AboutCompany,
  PDFDownloadButton,
  MarketCandlesChart,
} from "@/components/ipo";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function IPODetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useAdmin();
  const { data, isLoading, error } = useIPODetail(slug || "");

  const pageSettings = settings.pages.ipoDetail;

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
          <Link to="/">
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
  const listingDate = parseIPODate(timeline["Tentative Listing Date"]);
  
  let status = "upcoming";
  if (listingDate && now > listingDate) status = "listed";
  else if (closeDate && now > closeDate) status = "closed";
  else if (openDate && now >= openDate) status = "open";

  // Build timeline steps
  const timelineSteps = [
    { label: "IPO Open", date: timeline["IPO Open Date"] || "TBA", status: openDate && now >= openDate ? "completed" : now < (openDate || new Date()) ? "upcoming" : "current" },
    { label: "IPO Close", date: timeline["IPO Close Date"] || "TBA", status: closeDate && now >= closeDate ? "completed" : "upcoming" },
    { label: "Allotment", date: timeline["Tentative Allotment"] || "TBA", status: "upcoming" },
    { label: "Refund Initiation", date: timeline["Initiation of Refunds"] || "TBA", status: "upcoming" },
    { label: "Credit to Demat", date: timeline["Credit of Shares to Demat"] || "TBA", status: "upcoming" },
    { label: "Listing", date: timeline["Tentative Listing Date"] || "TBA", status: listingDate && now >= listingDate ? "completed" : "upcoming" },
  ].map(step => ({
    ...step,
    status: step.status as "completed" | "current" | "upcoming",
  }));

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

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </Helmet>

      <MainLayout>
        <div className="container px-2 sm:px-4 md:px-6 py-4 md:py-8 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            {ipo.logo_about?.logo && (
              <img 
                src={ipo.logo_about.logo} 
                alt={basicInfo["IPO Name"]} 
                className="h-10 w-10 sm:h-16 sm:w-16 rounded-md border object-contain bg-white p-1 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">{basicInfo["IPO Name"]}</h1>
                <TypeBadge type={ipo.ipo_type} />
                <StatusBadge status={status} />
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {basicInfo["Listing At"]} • {basicInfo["Issue Type"] || "Book Built"}
              </p>
            </div>
            <PDFDownloadButton ipo={ipo} status={status} />
          </header>

          {/* Vital Stats */}
          <IPOVitalStats basicInfo={basicInfo} timeline={timeline} />

          {/* GMP Widget */}
          {gmpData?.current_gmp !== undefined && issuePrice > 0 && (
            <IPOGMPWidget gmpData={gmpData} issuePrice={issuePrice} lotSize={lotSize} />
          )}

          {/* Market Data Chart for listed IPOs */}
          {marketData && status === "listed" && (
            <MarketCandlesChart marketData={marketData} issuePrice={issuePrice} />
          )}

          {/* Tabs - Horizontal scrollable on mobile */}
          <Tabs defaultValue="overview" className="w-full">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex h-10 items-center gap-1 bg-muted/50 p-1 rounded-lg w-max min-w-full sm:w-auto">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="subscription" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap">
                  Subscription
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap">
                  Details
                </TabsTrigger>
                <TabsTrigger value="financials" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap">
                  Financials
                </TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap">
                  About
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap">
                  Contacts
                </TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap">
                  Tools
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                  {/* Timeline */}
                  <Card className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base">IPO Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <IPOTimeline steps={timelineSteps} />
                    </CardContent>
                  </Card>

                  {/* Subscription Status */}
                  {subscription && <SubscriptionTable subscription={subscription} />}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Key Metrics */}
                  {peMetrics && <KeyMetrics peMetrics={peMetrics} />}

                  {/* Broker Sentiment */}
                  {recommendations?.brokers && (
                    <BrokerSentiment
                      subscribe={recommendations.brokers.subscribe || 0}
                      mayApply={recommendations.brokers.may_apply || 0}
                      neutral={recommendations.brokers.neutral || 0}
                      avoid={recommendations.brokers.avoid || 0}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {subscription && <SubscriptionTable subscription={subscription} />}
              
              {!subscription && (
                <Card className="border">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Subscription data not available yet
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* Basic Info Card */}
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        ["IPO Date", basicInfo["IPO Date"]],
                        ["Face Value", basicInfo["Face Value"]],
                        ["Price Band", basicInfo["Price Band"]],
                        ["Issue Price", basicInfo["Issue Price"]],
                        ["Lot Size", basicInfo["Lot Size"]],
                        ["Total Issue Size", basicInfo["Total Issue Size"]],
                        ["Fresh Issue", basicInfo["Fresh Issue"]],
                        ["OFS", basicInfo["Offer for Sale"]],
                        ["Sale Type", basicInfo["Sale Type"]],
                        ["Issue Type", basicInfo["Issue Type"]],
                        ["ISIN", basicInfo["ISIN"]],
                        ["BSE/NSE Symbol", basicInfo["BSE Script Code / NSE Symbol"]],
                      ].filter(([, value]) => value).map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-2 py-2 border-b border-border/50 last:border-0">
                          <span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
                          <span className="text-xs sm:text-sm font-medium text-right font-tabular">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lot Size Table */}
                {lotSizeTable && <LotSizeTable lotSizeTable={lotSizeTable} />}
              </div>

              {/* Reservation Table */}
              {reservationTable && <ReservationTable reservationTable={reservationTable} />}

              {/* Objectives */}
              {objectives && objectives.length > 0 && <ObjectivesList objectives={objectives} />}
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {financials && <CompanyFinancials financials={financials} />}
                {peMetrics && <KeyMetrics peMetrics={peMetrics} />}
              </div>
              
              {promoterHolding && <PromoterHolding promoterHolding={promoterHolding} />}

              {!financials && !peMetrics && !promoterHolding && (
                <Card className="border">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Financial data not available
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {aboutCompany && <AboutCompany about={aboutCompany} />}
              
              {!aboutCompany && (
                <Card className="border">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Company information not available
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* Registrar Info */}
                {registrar?.registrar && (
                  <Card className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base">Registrar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="font-medium text-sm sm:text-base">{registrar.registrar.name}</div>
                      
                      {registrar.registrar.phone && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {registrar.registrar.phone}
                        </div>
                      )}
                      
                      {registrar.registrar.email && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {registrar.registrar.email}
                        </div>
                      )}
                      
                      {registrar.registrar.website && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={registrar.registrar.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {registrar.registrar.website}
                          </a>
                        </div>
                      )}

                      {registrar.registrar.website && (
                        <a 
                          href={registrar.registrar.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Check Allotment Status
                            <ExternalLink className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Lead Managers */}
                {leadManagers && leadManagers.length > 0 && (
                  <LeadManagersList leadManagers={leadManagers} />
                )}
              </div>

              {!registrar?.registrar && (!leadManagers || leadManagers.length === 0) && (
                <Card className="border">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Contact information not available
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* GMP Calculator */}
                {gmpData?.current_gmp !== undefined && issuePrice > 0 && lotSize > 0 && (
                  <GMPCalculator
                    issuePrice={issuePrice}
                    gmp={gmpData.current_gmp}
                    lotSize={lotSize}
                  />
                )}

                {/* Broker Sentiment */}
                {recommendations?.brokers && (
                  <BrokerSentiment
                    subscribe={recommendations.brokers.subscribe || 0}
                    mayApply={recommendations.brokers.may_apply || 0}
                    neutral={recommendations.brokers.neutral || 0}
                    avoid={recommendations.brokers.avoid || 0}
                  />
                )}
              </div>

              {!gmpData?.current_gmp && !recommendations?.brokers && (
                <Card className="border">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Tools not available for this IPO
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </>
  );
}
