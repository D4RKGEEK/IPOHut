import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, GitCompare, TrendingUp, ArrowRight } from "lucide-react";
import { analytics, useScrollTracking, useTimeOnPage } from "@/hooks/useAnalytics";

const tools = [
  {
    title: "Investment Calculator",
    description: "Calculate investment amount, expected returns, profit per lot, and allotment probability for any IPO.",
    icon: Calculator,
    href: "/tools/investment-calculator",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Compare IPOs",
    description: "Compare multiple IPOs side by side. Analyze GMP, returns, subscription, and more to find the best opportunity.",
    icon: GitCompare,
    href: "/tools/compare",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Returns Calculator",
    description: "Calculate listing gains, current returns from your holdings, and target prices for desired returns.",
    icon: TrendingUp,
    href: "/tools/returns-calculator",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export default function ToolsPage() {
  // Track page
  useScrollTracking("tools");
  useTimeOnPage("tools");

  const handleToolClick = (toolName: string) => {
    analytics.toolOpen(toolName);
  };
  return (
    <MainLayout>
      <Helmet>
        <title>IPO Tools & Calculators | IPO Watch</title>
        <meta 
          name="description" 
          content="Free IPO calculators and tools - Investment calculator, IPO comparison tool, and return calculator. Select any IPO to auto-load data." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="border-b">
        <div className="container py-5 md:py-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-1">
            IPO Tools & Calculators
          </h1>
          <p className="text-sm text-muted-foreground">
            Calculate returns, compare opportunities, and plan your IPO investments. Select any IPO to auto-load its data.
          </p>
        </div>
      </section>

      <div className="container py-6 md:py-8">
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} to={tool.href} className="group" onClick={() => handleToolClick(tool.title)}>
              <Card className="h-full card-hover border-2 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-3`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="ghost" className="gap-2 p-0 h-auto text-primary group-hover:gap-3 transition-all">
                    Open Tool
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-10 p-6 rounded-lg bg-muted/50 border">
          <h2 className="text-lg font-semibold mb-4">Why Use Our IPO Tools?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Auto-Load IPO Data</h3>
              <p className="text-xs text-muted-foreground">
                Select any IPO from our database and instantly load issue price, lot size, GMP, and subscription data.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Real-Time Calculations</h3>
              <p className="text-xs text-muted-foreground">
                Get instant results as you modify inputs. No need to click calculate - everything updates automatically.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Compare Multiple IPOs</h3>
              <p className="text-xs text-muted-foreground">
                Compare up to 5 IPOs side by side with highlighted best values for each metric.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
