import { useAdmin } from "@/contexts/AdminContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WIDGET_METADATA, WidgetType, WidgetConfig, TabConfig } from "@/types/admin";
import { GripVertical, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// All available widgets
const ALL_WIDGETS: WidgetType[] = [
  'timeline', 'subscription_table', 'key_metrics', 'broker_sentiment',
  'basic_info', 'lot_size_table', 'reservation_table', 'objectives',
  'financials', 'promoter_holding', 'gmp_calculator', 'about_company',
  'contact_registrar', 'faq_section', 'vital_stats', 'gmp_widget', 'market_chart'
];

export function IPODetailSettings() {
  const { settings, updateSiteSettings } = useAdmin();
  const config = settings.site.ipoDetailConfig;

  const updateConfig = (updates: Partial<typeof config>) => {
    updateSiteSettings({
      ipoDetailConfig: { ...config, ...updates },
    });
  };

  // Update above fold widgets
  const updateAboveFoldWidget = (widgetId: WidgetType, enabled: boolean) => {
    const updated = config.aboveFoldWidgets.map(w => 
      w.id === widgetId ? { ...w, enabled } : w
    );
    updateConfig({ aboveFoldWidgets: updated });
  };

  const moveAboveFoldWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...config.aboveFoldWidgets];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newWidgets.length) return;
    [newWidgets[index], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[index]];
    newWidgets.forEach((w, i) => w.order = i);
    updateConfig({ aboveFoldWidgets: newWidgets });
  };

  const addAboveFoldWidget = (widgetId: WidgetType) => {
    if (config.aboveFoldWidgets.some(w => w.id === widgetId)) return;
    updateConfig({
      aboveFoldWidgets: [
        ...config.aboveFoldWidgets,
        { id: widgetId, enabled: true, order: config.aboveFoldWidgets.length }
      ]
    });
  };

  const removeAboveFoldWidget = (widgetId: WidgetType) => {
    updateConfig({
      aboveFoldWidgets: config.aboveFoldWidgets
        .filter(w => w.id !== widgetId)
        .map((w, i) => ({ ...w, order: i }))
    });
  };

  // Update tab
  const updateTab = (tabId: string, updates: Partial<TabConfig>) => {
    const updatedTabs = config.tabs.map(tab =>
      tab.id === tabId ? { ...tab, ...updates } : tab
    );
    updateConfig({ tabs: updatedTabs });
  };

  // Update widget in tab
  const updateTabWidget = (tabId: string, widgetId: WidgetType, enabled: boolean) => {
    const tab = config.tabs.find(t => t.id === tabId);
    if (!tab) return;
    const updatedWidgets = tab.widgets.map(w =>
      w.id === widgetId ? { ...w, enabled } : w
    );
    updateTab(tabId, { widgets: updatedWidgets });
  };

  // Move widget within tab
  const moveTabWidget = (tabId: string, index: number, direction: 'up' | 'down') => {
    const tab = config.tabs.find(t => t.id === tabId);
    if (!tab) return;
    const newWidgets = [...tab.widgets];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newWidgets.length) return;
    [newWidgets[index], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[index]];
    newWidgets.forEach((w, i) => w.order = i);
    updateTab(tabId, { widgets: newWidgets });
  };

  // Add widget to tab
  const addWidgetToTab = (tabId: string, widgetId: WidgetType) => {
    const tab = config.tabs.find(t => t.id === tabId);
    if (!tab) return;
    updateTab(tabId, {
      widgets: [...tab.widgets, { id: widgetId, enabled: true, order: tab.widgets.length }]
    });
  };

  // Remove widget from tab
  const removeWidgetFromTab = (tabId: string, widgetId: WidgetType) => {
    const tab = config.tabs.find(t => t.id === tabId);
    if (!tab) return;
    updateTab(tabId, {
      widgets: tab.widgets
        .filter(w => w.id !== widgetId)
        .map((w, i) => ({ ...w, order: i }))
    });
  };

  // Get available widgets not in a list
  const getAvailableWidgets = (currentWidgets: WidgetConfig[]) => {
    const currentIds = new Set(currentWidgets.map(w => w.id));
    return ALL_WIDGETS.filter(id => !currentIds.has(id));
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
            <div className="flex items-center justify-between">
              <Label>Allotment Button</Label>
              <Switch checked={config.showAllotmentButton} onCheckedChange={v => updateConfig({ showAllotmentButton: v })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Above Fold Widgets */}
      <Card>
        <CardHeader>
          <CardTitle>Above Fold Widgets</CardTitle>
          <CardDescription>Widgets that appear before the tabs. Drag to reorder.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.aboveFoldWidgets
            .sort((a, b) => a.order - b.order)
            .map((widget, index) => {
              const meta = WIDGET_METADATA[widget.id];
              return (
                <div 
                  key={widget.id} 
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg bg-muted/30",
                    !widget.enabled && "opacity-50"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => moveAboveFoldWidget(index, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => moveAboveFoldWidget(index, 'down')}
                      disabled={index === config.aboveFoldWidgets.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{meta.label}</p>
                    <p className="text-xs text-muted-foreground">{meta.description}</p>
                  </div>
                  <Switch 
                    checked={widget.enabled} 
                    onCheckedChange={v => updateAboveFoldWidget(widget.id, v)} 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeAboveFoldWidget(widget.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          
          {/* Add widget dropdown */}
          {getAvailableWidgets(config.aboveFoldWidgets).length > 0 && (
            <div className="pt-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="add" className="border-0">
                  <AccordionTrigger className="text-sm text-primary py-2 hover:no-underline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Widget
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {getAvailableWidgets(config.aboveFoldWidgets).map(widgetId => (
                        <Button
                          key={widgetId}
                          variant="outline"
                          size="sm"
                          className="justify-start text-xs h-auto py-2"
                          onClick={() => addAboveFoldWidget(widgetId)}
                        >
                          {WIDGET_METADATA[widgetId].label}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs Configuration</CardTitle>
          <CardDescription>Configure tabs and their widgets. Each widget can appear in multiple tabs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {config.tabs.map((tab) => (
              <AccordionItem key={tab.id} value={tab.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={tab.enabled}
                      onCheckedChange={v => updateTab(tab.id, { enabled: v })}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className={cn(!tab.enabled && "text-muted-foreground")}>
                      {tab.label}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {tab.widgets.filter(w => w.enabled).length} widgets
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  {/* Tab label edit */}
                  <div className="flex items-center gap-2 pb-2">
                    <Label className="text-xs text-muted-foreground">Tab Label:</Label>
                    <Input
                      value={tab.label}
                      onChange={e => updateTab(tab.id, { label: e.target.value })}
                      className="h-7 text-sm w-32"
                    />
                  </div>

                  {/* Widgets in this tab */}
                  {tab.widgets
                    .sort((a, b) => a.order - b.order)
                    .map((widget, index) => {
                      const meta = WIDGET_METADATA[widget.id];
                      return (
                        <div 
                          key={widget.id} 
                          className={cn(
                            "flex items-center gap-2 p-2 border rounded bg-background",
                            !widget.enabled && "opacity-50"
                          )}
                        >
                          <div className="flex flex-col">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 p-0"
                              onClick={() => moveTabWidget(tab.id, index, 'up')}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 p-0"
                              onClick={() => moveTabWidget(tab.id, index, 'down')}
                              disabled={index === tab.widgets.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium">{meta.label}</p>
                          </div>
                          <Switch 
                            checked={widget.enabled} 
                            onCheckedChange={v => updateTabWidget(tab.id, widget.id, v)} 
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeWidgetFromTab(tab.id, widget.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}

                  {/* Add widget to tab */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Add widget to this tab:</p>
                    <div className="flex flex-wrap gap-1">
                      {ALL_WIDGETS.map(widgetId => {
                        const isInTab = tab.widgets.some(w => w.id === widgetId);
                        return (
                          <Button
                            key={widgetId}
                            variant={isInTab ? "secondary" : "outline"}
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={() => {
                              if (isInTab) {
                                removeWidgetFromTab(tab.id, widgetId);
                              } else {
                                addWidgetToTab(tab.id, widgetId);
                              }
                            }}
                          >
                            {isInTab && "✓ "}
                            {WIDGET_METADATA[widgetId].label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
