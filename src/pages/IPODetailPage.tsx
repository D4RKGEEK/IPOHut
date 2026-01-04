import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useIPODetail } from "@/hooks/useIPO";
import { applyTemplate } from "@/types/admin";
import { StatusBadge, TypeBadge, IPOTimeline, GMPCalculator, BrokerSentiment } from "@/components/shared";
import { formatCurrency, formatPercent, formatSubscription, parseIPODate } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, TrendingDown, Building2, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function IPODetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useAdmin();
  const { data, isLoading, error } = useIPODetail(slug || "");

  const pageSettings = settings.pages.ipoDetail;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </MainLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <MainLayout title="IPO Not Found">
        <div className="container py-16 text-center">
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
        <div className="container py-6 md:py-8 space-y-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-start gap-4">
            {ipo.logo_about?.logo && (
              <img 
                src={ipo.logo_about.logo} 
                alt={basicInfo["IPO Name"]} 
                className="h-16 w-16 rounded-md border object-contain bg-white p-1"
              />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{basicInfo["IPO Name"]}</h1>
                <TypeBadge type={ipo.ipo_type} />
                <StatusBadge status={status} />
              </div>
              <p className="text-muted-foreground text-sm">
                Listed on {basicInfo["Listing At"]} • {basicInfo["Issue Type"]}
              </p>
            </div>
          </header>

          {/* Vital Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Issue Price</div>
                <div className="text-lg font-semibold font-tabular">{basicInfo["Issue Price"] || "—"}</div>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Lot Size</div>
                <div className="text-lg font-semibold font-tabular">{basicInfo["Lot Size"] || "—"}</div>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Issue Size</div>
                <div className="text-lg font-semibold font-tabular">{basicInfo["Total Issue Size"] || "—"}</div>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Listing Date</div>
                <div className="text-lg font-semibold">{timeline["Tentative Listing Date"] || "TBA"}</div>
              </CardContent>
            </Card>
          </section>

          {/* GMP Widget */}
          {gmpData?.current_gmp !== undefined && (
            <Card className={cn(
              "border-2",
              gmpData.current_gmp >= 0 ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
            )}>
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground mb-2">Current Grey Market Premium</div>
                <div className="flex items-center justify-center gap-3">
                  {gmpData.current_gmp >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-success" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  )}
                  <span className={cn(
                    "text-4xl font-bold font-tabular",
                    gmpData.current_gmp >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatCurrency(gmpData.current_gmp)}
                  </span>
                  {issuePrice > 0 && (
                    <span className={cn(
                      "text-xl font-tabular",
                      gmpData.current_gmp >= 0 ? "text-success" : "text-destructive"
                    )}>
                      ({formatPercent((gmpData.current_gmp / issuePrice) * 100)})
                    </span>
                  )}
                </div>
                {gmpData.estimated_listing && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Estimated Listing Price: <span className="font-semibold text-foreground">{formatCurrency(gmpData.estimated_listing)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timeline */}
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-base">IPO Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <IPOTimeline steps={timelineSteps} />
                </CardContent>
              </Card>

              {/* Subscription Status */}
              {subscription?.SubscriptionTable && subscription.SubscriptionTable.length > 0 && (
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-4 w-4" />
                      Live Subscription Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Subscription</TableHead>
                          <TableHead className="text-right hidden md:table-cell">Shares Offered</TableHead>
                          <TableHead className="text-right hidden md:table-cell">Shares Bid</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscription.SubscriptionTable.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{row.category}</TableCell>
                            <TableCell className="text-right font-tabular font-semibold text-primary">
                              {formatSubscription(row.subscription_times)}
                            </TableCell>
                            <TableCell className="text-right font-tabular hidden md:table-cell">
                              {row.shares_offered?.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-tabular hidden md:table-cell">
                              {row.shares_bid?.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {subscription.TotalApplications && (
                      <div className="mt-4 text-sm text-muted-foreground text-center">
                        Total Applications: <span className="font-semibold text-foreground font-tabular">{subscription.TotalApplications.toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Financials */}
              {financials && Object.keys(financials).length > 0 && (
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4" />
                      Company Financials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          {Object.keys(financials.Assets || financials["Total Income"] || {}).map(year => (
                            <TableHead key={year} className="text-right">{year}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(financials).map(([metric, values]) => (
                          <TableRow key={metric}>
                            <TableCell className="font-medium">{metric}</TableCell>
                            {Object.values(values as Record<string, string | number>).map((value, idx) => (
                              <TableCell key={idx} className="text-right font-tabular">
                                {typeof value === "number" ? value.toLocaleString() : value}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* About Company */}
              {ipo.about_company?.about_company && (
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="h-4 w-4" />
                      About the Company
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ipo.about_company.about_company}
                    </p>
                    {ipo.about_company.lists && ipo.about_company.lists.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {ipo.about_company.lists.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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

              {/* Registrar Info */}
              {registrar?.registrar && (
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-base">Registrar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="font-medium">{registrar.registrar.name}</div>
                    {registrar.registrar.website && (
                      <a 
                        href={registrar.registrar.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Check Allotment Status
                          <ExternalLink className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
