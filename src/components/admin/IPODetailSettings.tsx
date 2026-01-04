import { useAdmin } from "@/contexts/AdminContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function IPODetailSettings() {
  const { settings, updateSiteSettings } = useAdmin();
  const config = settings.site.ipoDetailConfig;

  const updateConfig = (updates: Partial<typeof config>) => {
    updateSiteSettings({
      ipoDetailConfig: { ...config, ...updates },
    });
  };

  const updateTabs = (tab: keyof typeof config.tabs, value: boolean) => {
    updateSiteSettings({
      ipoDetailConfig: {
        ...config,
        tabs: { ...config.tabs, [tab]: value },
      },
    });
  };

  const updateOverview = (key: keyof typeof config.overview, value: boolean) => {
    updateSiteSettings({
      ipoDetailConfig: {
        ...config,
        overview: { ...config.overview, [key]: value },
      },
    });
  };

  const updateDetails = (key: keyof typeof config.details, value: boolean) => {
    updateSiteSettings({
      ipoDetailConfig: {
        ...config,
        details: { ...config.details, [key]: value },
      },
    });
  };

  const updateFinancials = (key: keyof typeof config.financials, value: boolean) => {
    updateSiteSettings({
      ipoDetailConfig: {
        ...config,
        financials: { ...config.financials, [key]: value },
      },
    });
  };

  const updateTools = (key: keyof typeof config.tools, value: boolean) => {
    updateSiteSettings({
      ipoDetailConfig: {
        ...config,
        tools: { ...config.tools, [key]: value },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle>Header Components</CardTitle>
          <CardDescription>Control what shows in the IPO detail page header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Company Logo</Label>
              <Switch checked={config.showLogo} onCheckedChange={v => updateConfig({ showLogo: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Status Badges</Label>
              <Switch checked={config.showBadges} onCheckedChange={v => updateConfig({ showBadges: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Share Button</Label>
              <Switch checked={config.showShareButton} onCheckedChange={v => updateConfig({ showShareButton: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label>PDF Download</Label>
              <Switch checked={config.showPDFDownload} onCheckedChange={v => updateConfig({ showPDFDownload: v })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Main Sections</CardTitle>
          <CardDescription>Toggle visibility of main page sections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Vital Stats</Label>
                <p className="text-xs text-muted-foreground">Issue price, lot size, etc.</p>
              </div>
              <Switch checked={config.showVitalStats} onCheckedChange={v => updateConfig({ showVitalStats: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>GMP Widget</Label>
                <p className="text-xs text-muted-foreground">Grey market premium display</p>
              </div>
              <Switch checked={config.showGMPWidget} onCheckedChange={v => updateConfig({ showGMPWidget: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Market Chart</Label>
                <p className="text-xs text-muted-foreground">Price history for listed IPOs</p>
              </div>
              <Switch checked={config.showMarketChart} onCheckedChange={v => updateConfig({ showMarketChart: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>IPO Timeline</Label>
                <p className="text-xs text-muted-foreground">Visual timeline of events</p>
              </div>
              <Switch checked={config.showTimeline} onCheckedChange={v => updateConfig({ showTimeline: v })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Tab Visibility</CardTitle>
          <CardDescription>Show or hide individual tabs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(config.tabs).map(([tab, visible]) => (
              <div key={tab} className="flex items-center justify-between">
                <Label className="capitalize">{tab}</Label>
                <Switch 
                  checked={visible} 
                  onCheckedChange={v => updateTabs(tab as keyof typeof config.tabs, v)} 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab-specific Components */}
      <Card>
        <CardHeader>
          <CardTitle>Tab Components</CardTitle>
          <CardDescription>Fine-tune components within each tab</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* Overview Tab */}
            <AccordionItem value="overview">
              <AccordionTrigger>Overview Tab</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label>Timeline Card</Label>
                  <Switch checked={config.overview.showTimeline} onCheckedChange={v => updateOverview('showTimeline', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Subscription Table</Label>
                  <Switch checked={config.overview.showSubscription} onCheckedChange={v => updateOverview('showSubscription', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Key Metrics</Label>
                  <Switch checked={config.overview.showKeyMetrics} onCheckedChange={v => updateOverview('showKeyMetrics', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Broker Sentiment</Label>
                  <Switch checked={config.overview.showBrokerSentiment} onCheckedChange={v => updateOverview('showBrokerSentiment', v)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Details Tab */}
            <AccordionItem value="details">
              <AccordionTrigger>Details Tab</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label>Basic Information</Label>
                  <Switch checked={config.details.showBasicInfo} onCheckedChange={v => updateDetails('showBasicInfo', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Lot Size Table</Label>
                  <Switch checked={config.details.showLotSize} onCheckedChange={v => updateDetails('showLotSize', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Reservation Table</Label>
                  <Switch checked={config.details.showReservation} onCheckedChange={v => updateDetails('showReservation', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>IPO Objectives</Label>
                  <Switch checked={config.details.showObjectives} onCheckedChange={v => updateDetails('showObjectives', v)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Financials Tab */}
            <AccordionItem value="financials">
              <AccordionTrigger>Financials Tab</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label>Company Financials</Label>
                  <Switch checked={config.financials.showFinancials} onCheckedChange={v => updateFinancials('showFinancials', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Key Metrics</Label>
                  <Switch checked={config.financials.showKeyMetrics} onCheckedChange={v => updateFinancials('showKeyMetrics', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Promoter Holding</Label>
                  <Switch checked={config.financials.showPromoterHolding} onCheckedChange={v => updateFinancials('showPromoterHolding', v)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Tools Tab */}
            <AccordionItem value="tools">
              <AccordionTrigger>Tools Tab</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label>GMP Calculator</Label>
                  <Switch checked={config.tools.showGMPCalculator} onCheckedChange={v => updateTools('showGMPCalculator', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Broker Sentiment</Label>
                  <Switch checked={config.tools.showBrokerSentiment} onCheckedChange={v => updateTools('showBrokerSentiment', v)} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
