import { WidgetType, WidgetConfig } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPOTimeline, GMPCalculator, BrokerSentiment } from "@/components/shared";
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
  MarketCandlesChart,
  IPOFAQSection,
  AIInsightsWidget,
} from "@/components/ipo";
import { Phone, Mail, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WidgetRendererProps {
  widgetId: WidgetType;
  data: {
    basicInfo: any;
    timeline: any;
    gmpData: any;
    financials: any;
    subscription: any;
    recommendations: any;
    registrar: any;
    peMetrics: any;
    promoterHolding: any;
    objectives: any;
    lotSizeTable: any;
    reservationTable: any;
    aboutCompany: any;
    leadManagers: any;
    marketData: any;
    timelineSteps: any[];
    issuePrice: number;
    lotSize: number;
    status: string;
    slug: string;
    listingInfo?: any;
    gainLossPercent?: number;
    aiData?: any;
  };
}

export function WidgetRenderer({ widgetId, data }: WidgetRendererProps) {
  const {
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
    slug,
    aiData,
  } = data;

  switch (widgetId) {
    case 'vital_stats':
      return <IPOVitalStats
        basicInfo={basicInfo}
        timeline={timeline}
        subscription={subscription}
        listingInfo={data.listingInfo}
        gainLossPercent={data.gainLossPercent}
      />;

    case 'gmp_widget':
      if (gmpData?.current_gmp !== undefined && issuePrice > 0) {
        return <IPOGMPWidget gmpData={gmpData} issuePrice={issuePrice} lotSize={lotSize} showDummyData={false} />;
      }
      // Show with dummy data if no real data
      return <IPOGMPWidget gmpData={undefined} issuePrice={issuePrice || 300} lotSize={lotSize || 50} showDummyData={false} />;

    case 'market_chart':
      if (marketData && status === "listed") {
        return <MarketCandlesChart marketData={marketData} issuePrice={issuePrice} ipoSlug={slug} />;
      }
      return null;

    case 'ai_insights':
      return <AIInsightsWidget data={aiData} showDummyData={true} />;

    case 'timeline':
      return (
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">IPO Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <IPOTimeline steps={timelineSteps} />
          </CardContent>
        </Card>
      );

    case 'subscription_table':
      if (subscription) {
        return <SubscriptionTable subscription={subscription} />;
      }
      return null;

    case 'key_metrics':
      if (peMetrics) {
        return <KeyMetrics peMetrics={peMetrics} />;
      }
      return null;

    case 'broker_sentiment':
      if (recommendations?.brokers) {
        return (
          <BrokerSentiment
            subscribe={recommendations.brokers.subscribe || 0}
            mayApply={recommendations.brokers.may_apply || 0}
            neutral={recommendations.brokers.neutral || 0}
            avoid={recommendations.brokers.avoid || 0}
          />
        );
      }
      return null;

    case 'basic_info':
      return (
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
      );

    case 'lot_size_table':
      if (lotSizeTable) {
        return <LotSizeTable lotSizeTable={lotSizeTable} />;
      }
      return null;

    case 'reservation_table':
      if (reservationTable) {
        return <ReservationTable reservationTable={reservationTable} />;
      }
      return null;

    case 'objectives':
      if (objectives && objectives.length > 0) {
        return <ObjectivesList objectives={objectives} />;
      }
      return null;

    case 'financials':
      if (financials) {
        return <CompanyFinancials financials={financials} />;
      }
      return null;

    case 'promoter_holding':
      if (promoterHolding) {
        return <PromoterHolding promoterHolding={promoterHolding} />;
      }
      return null;

    case 'gmp_calculator':
      if (gmpData?.current_gmp !== undefined && issuePrice > 0 && lotSize > 0) {
        return (
          <GMPCalculator
            issuePrice={issuePrice}
            gmp={gmpData.current_gmp}
            lotSize={lotSize}
          />
        );
      }
      return null;

    case 'about_company':
      if (aboutCompany) {
        return <AboutCompany about={aboutCompany} aiAbout={aiData?.seo_about} />;
      }
      return null;

    case 'contact_registrar':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {leadManagers && leadManagers.length > 0 && (
            <LeadManagersList leadManagers={leadManagers} />
          )}
        </div>
      );

    case 'faq_section':
      return (
        <IPOFAQSection
          ipoName={basicInfo["IPO Name"]}
          basicInfo={basicInfo}
          timeline={timeline}
          gmpValue={gmpData?.current_gmp}
          issuePrice={issuePrice}
          registrarName={registrar?.registrar?.name}
          slug={slug}
        />
      );

    default:
      return null;
  }
}

// Render multiple widgets based on config
interface WidgetListProps {
  widgets: WidgetConfig[];
  data: WidgetRendererProps['data'];
  className?: string;
}

export function WidgetList({ widgets, data, className }: WidgetListProps) {
  const sortedWidgets = [...widgets]
    .filter(w => w.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={className}>
      {sortedWidgets.map(widget => (
        <WidgetRenderer key={widget.id} widgetId={widget.id} data={data} />
      ))}
    </div>
  );
}
